import json
import subprocess
import uuid
from pathlib import Path
from typing import Dict

import modal

# from dotenv import load_dotenv

# load_dotenv(".env.local")

# Build Modal Image
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git")
    .pip_install("fastapi[standard]==0.115.4")
    .pip_install("comfy-cli==1.3.8")
    .run_commands("comfy --skip-prompt install --fast-deps --nvidia --version 0.3.10")
    .run_commands("comfy node install --fast-deps comfyui-impact-pack@8.14.2")
    .run_commands("comfy node install --fast-deps comfyui_layerstyle@1.0.90")
    .run_commands("comfy node install --fast-deps comfyui-easy-use@1.2.9")
    .run_commands("comfy node install --fast-deps comfyui-kjnodes@1.0.9")
    .run_commands("comfy node install --fast-deps comfyui_essentials@1.1.0")
    .run_commands("comfy node install --fast-deps comfyui-inpaint-cropandstitch@2.1.4")
    .run_commands("comfy node install --fast-deps comfys3@1.0.1")
    .run_commands(
        "git clone https://github.com/ZHO-ZHO-ZHO/ComfyUI-YoloWorld-EfficientSAM /root/comfy/ComfyUI/custom_nodes/ComfyUI-YoloWorld-EfficientSAM --depth 1"
    )
)

# Download custom nodes (example: WAS Node Suite)
# Find node names on the ComfyUI Registry: https://comfyregistry.org/
# image = image.run_commands(
#     "comfy node install --fast-deps was-node-suite-comfyui@1.0.2"
# )


def create_s3_env():
    import os

    Path("/root/comfy/ComfyUI/custom_nodes/comfys3/.env").write_text(
        f"""
S3_REGION = {os.environ["S3_REGION"]}
S3_ENDPOINT = {os.environ["S3_ENDPOINT"]}
S3_ACCESS_KEY = {os.environ["S3_ACCESS_KEY"]}
S3_SECRET_KEY = {os.environ["S3_SECRET_KEY"]}
S3_BUCKET_NAME = {os.environ["S3_BUCKET_NAME"]}
S3_INPUT_DIR = {os.environ["S3_INPUT_DIR"]}
S3_OUTPUT_DIR = {os.environ["S3_OUTPUT_DIR"]}
"""
    )


image = image.run_function(
    create_s3_env,
    secrets=[modal.Secret.from_name("s3-secrets")],
)

# Add memory snapshot helper custom node
# See https://modal.com/docs/guide/faster-cold-starts#memory-snapshotting for details
# image = image.add_local_dir(
#     local_path=Path(__file__).parent / "memory_snapshot_helper",
#     remote_path="/root/comfy/ComfyUI/custom_nodes/memory_snapshot_helper",
#     copy=True,
# )


# Function to download models using hf_hub_download for faster downloads
def hf_download(
    repo_id: str,
    filename: str,
    model_dir: str = "/root/comfy/ComfyUI/models/checkpoints",
):
    import subprocess

    from huggingface_hub import hf_hub_download

    # Example: Download Flux Schnell model
    model = hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        cache_dir="/cache",
    )

    # Symlink the model to the correct ComfyUI directory
    model_dir = "/root/comfy/ComfyUI/models/"
    Path(model_dir).mkdir(parents=True, exist_ok=True)
    subprocess.run(
        f"ln -s {model} {model_dir}/{filename}",
        shell=True,
        check=True,
    )


def hf_download_all():
    models = [
        {
            "repo_id": "jackzheng/flux-fill-FP8",
            "filename": "fluxFillFP8_v10.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/unet",
        },
        {
            "repo_id": "comfyanonymous/flux_text_encoders",
            "filename": "t5xxl_fp16.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/text_encoders",
        },
        {
            "repo_id": "lovis93/testllm",
            "filename": "ae.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/vae",
        },
        {
            "repo_id": "second-state/FLUX.1-Redux-dev-GGUF",
            "filename": "flux1-redux-dev.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/style_models",
        },
        {
            "repo_id": "Comfy-Org/sigclip_vision_384",
            "filename": "sigclip_vision_patch14_384.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/clip_vision",
        },
        {
            "repo_id": "camenduru/YoloWorld-EfficientSAM",
            "filename": "efficient_sam_s_gpu.jit",
            "model_dir": "/root/comfy/ComfyUI/custom_nodes/ComfyUI-YoloWorld-EfficientSAM",
        },
    ]

    for model in models:
        hf_download(model["repo_id"], model["filename"])


# Define a Modal Volume for caching Hugging Face models
vol = modal.Volume.from_name("hf-hub-cache", create_if_missing=True)

image = (
    image.pip_install("huggingface_hub[hf_transfer]==0.30.0")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .run_function(
        hf_download_all,
        volumes={"/cache": vol},
    )
)

# Copy the ComfyUI workflow JSON to the container
# Make sure you have a 'workflow_api.json' file in the same directory
# You can export this from the ComfyUI interface (Export (API) option)
workflow_file_path = Path(__file__).parent / "workflow_api.json"
if workflow_file_path.exists():
    image = image.add_local_file(workflow_file_path, "/root/workflow_api.json")
else:
    print(
        f"Warning: {workflow_file_path} not found. API endpoint might not work without a workflow."
    )


app = modal.App(name="clothify-comfyui", image=image)

# Interactive ComfyUI server (optional, for development/debugging)
# @app.function(
#     max_containers=1,
#     gpu="L40S", # Or choose a suitable GPU
#     volumes={"/cache": vol},
# )
# @modal.concurrent(max_inputs=10)
# @modal.web_server(8000, startup_timeout=60)
# def ui():
#     subprocess.Popen("comfy launch -- --listen 0.0.0.0 --port 8000", shell=True)


# Class to run ComfyUI as an API endpoint
@app.cls(
    scaledown_window=300,
    gpu="L40S",  # Or choose a suitable GPU
    volumes={"/cache": vol},
    enable_memory_snapshot=True,
)
@modal.concurrent(max_inputs=5)
class ComfyUI:
    port: int = 8188  # Default ComfyUI API port

    @modal.enter(snap=True)
    def launch_comfy_background(self):
        # Using --preview-mode to prevent outputs saving to disk unless SaveImage node is used
        # Using --port {self.port} which is the default ComfyUI API port
        cmd = "comfy launch --background"
        subprocess.run(cmd, shell=True, check=True)
        print(f"ComfyUI server started in background on port {self.port}")
        self.poll_server_health(startup=True)  # Initial health check

    @modal.enter(snap=False)
    def restore_snapshot(self):
        # Initialize GPU after snapshot restore using the custom node
        import requests

        try:
            response = requests.post(f"http://127.0.0.1:{self.port}/cuda/set_device")
            response.raise_for_status()  # Raise an exception for bad status codes
            print("Successfully set CUDA device after snapshot restore.")
        except requests.exceptions.RequestException as e:
            print(f"Failed to set CUDA device after snapshot restore: {e}")
            # Depending on the error, you might want to raise it or handle it differently
            # For now, just print the error.
            # raise  # Re-raise the exception if it's critical

    @modal.method()
    def infer(self, workflow_path: str = "/root/workflow_api.json"):
        """Runs a ComfyUI workflow via the API and returns the output image bytes."""
        import time
        import urllib.parse

        self.poll_server_health()  # Check health before inference

        try:
            with open(workflow_path, "r") as f:
                prompt = json.load(f)
        except FileNotFoundError:
            print(f"Error: Workflow file not found at {workflow_path}")
            raise
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in workflow file at {workflow_path}")
            raise

        client_id = str(uuid.uuid4())
        prompt["client_id"] = client_id  # Assign a client ID

        # Make the API request to queue the prompt
        data = json.dumps({"prompt": prompt, "client_id": client_id}).encode("utf-8")
        req = urllib.request.Request(f"http://127.0.0.1:{self.port}/prompt", data=data)

        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read())
            prompt_id = result["prompt_id"]
            print(f"Queued prompt with ID: {prompt_id}")
        except urllib.error.URLError as e:
            print(f"Error queuing prompt: {e}")
            raise Exception(f"Failed to queue prompt: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding queue response: {e}")
            raise Exception(f"Failed to decode queue response: {e}")

        # Poll for results
        timeout = 120  # seconds
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                history_req = urllib.request.Request(
                    f"http://127.0.0.1:{self.port}/history/{prompt_id}"
                )
                history_res = urllib.request.urlopen(history_req)
                history_data = json.loads(history_res.read())

                if prompt_id in history_data and history_data[prompt_id]["outputs"]:
                    outputs = history_data[prompt_id]["outputs"]
                    # Find the output image data
                    for node_id, node_output in outputs.items():
                        if "images" in node_output:
                            image_data = node_output["images"][
                                0
                            ]  # Assuming one image output
                            image_filename = image_data["filename"]
                            image_subfolder = image_data.get(
                                "subfolder", ""
                            )  # Handle optional subfolder
                            image_type = image_data["type"]  # 'output' or 'temp'

                            # Fetch the image using the /view endpoint
                            image_url = f"http://127.0.0.1:{self.port}/view?filename={urllib.parse.quote_plus(image_filename)}&subfolder={urllib.parse.quote_plus(image_subfolder)}&type={image_type}"
                            img_req = urllib.request.Request(image_url)
                            with urllib.request.urlopen(img_req) as img_res:
                                if img_res.status == 200:
                                    print(
                                        f"Successfully fetched image for prompt {prompt_id}"
                                    )
                                    return img_res.read()
                                else:
                                    print(
                                        f"Error fetching image: Status {img_res.status}"
                                    )
                                    raise Exception(
                                        f"Failed to fetch image, status: {img_res.status}"
                                    )
                    # If loop finishes without finding image data
                    print(f"No image data found in outputs for prompt {prompt_id}")
                    raise Exception("No image data found in workflow output")

            except urllib.error.URLError as e:
                print(f"Error polling history: {e}")
                # Keep polling unless it's a fatal error, maybe add more specific error handling
            except json.JSONDecodeError as e:
                print(f"Error decoding history response: {e}")
            except KeyError:
                # This can happen if the prompt_id is not yet in the history
                print(f"Prompt ID {prompt_id} not yet in history, polling again...")

            time.sleep(1)  # Wait before polling again

        print(f"Timeout reached waiting for prompt {prompt_id}")
        raise TimeoutError(f"ComfyUI inference timed out for prompt {prompt_id}")

    @modal.fastapi_endpoint(method="POST")
    def api(self, item: Dict):
        """API endpoint to run inference based on a prompt."""
        import tempfile

        from fastapi import HTTPException, Response

        default_workflow_path = Path("/root/workflow_api.json")
        if not default_workflow_path.exists():
            raise HTTPException(
                status_code=500,
                detail="Default workflow_api.json not found in the container.",
            )

        try:
            with default_workflow_path.open("r") as f:
                workflow_data = json.load(f)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500, detail="Failed to parse default workflow_api.json."
            )

        # --- Workflow Modification Logic ---
        # This section needs to be adapted based on your specific 'workflow_api.json'
        # Find the node to modify (e.g., the KSampler prompt input) and update it.
        # The example below assumes node "6" is ClipTextEncode and node "9" is SaveImage.
        # You MUST inspect your 'workflow_api.json' and update these node IDs and input names.

        costume_node_id = "267"
        human_node_id = "266"

        if "costumeKey" in item:
            if (
                costume_node_id in workflow_data
                and "inputs" in workflow_data[costume_node_id]
            ):
                workflow_data[costume_node_id]["inputs"]["image"] = item["costumeKey"]
            else:
                print(
                    f"Warning: Could not find node '{costume_node_id}' or its 'inputs' to set the prompt."
                )
                # Decide how to handle this: raise error or proceed with default?
                # raise HTTPException(status_code=400, detail=f"Workflow missing expected prompt node '{prompt_node_id}'.")

        if "selfieKey" in item:
            if (
                human_node_id in workflow_data
                and "inputs" in workflow_data[human_node_id]
            ):
                workflow_data[human_node_id]["inputs"]["image"] = item["selfieKey"]
            else:
                print(
                    f"Warning: Could not find node '{human_node_id}' or its 'inputs' to set the prompt."
                )
                # Decide how to handle this: raise error or proceed with default?
                # raise HTTPException(status_code=400, detail=f"Workflow missing expected prompt node '{prompt_node_id}'.")

        # Modify other inputs as needed based on 'item' dictionary
        # Example: Negative prompt
        # negative_prompt_node_id = "7"
        # if 'negative_prompt' in item:
        #      if negative_prompt_node_id in workflow_data and 'inputs' in workflow_data[negative_prompt_node_id]:
        #            workflow_data[negative_prompt_node_id]['inputs']['text'] = item['negative_prompt']
        #      else:
        #            print(f"Warning: Could not find node '{negative_prompt_node_id}' or its 'inputs' to set the negative prompt.")

        # Give the output image a unique prefix based on client request ID
        # client_request_id = uuid.uuid4().hex
        # if save_node_id in workflow_data and 'inputs' in workflow_data[save_node_id]:
        #     workflow_data[save_node_id]['inputs']['filename_prefix'] = client_request_id
        # else:
        #     print(f"Warning: Could not find node '{save_node_id}' or its 'inputs' to set filename_prefix.")
        # If SaveImage node isn't found or modified, ComfyUI might use defaults or fail.

        # --- End Workflow Modification Logic ---

        # Save the modified workflow to a temporary file
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", delete=False, suffix=".json"
            ) as temp_workflow_file:
                json.dump(workflow_data, temp_workflow_file)
                temp_workflow_path = temp_workflow_file.name
            print(f"Saved modified workflow to {temp_workflow_path}")

            # Run inference on the currently running container using the modified workflow
            img_bytes = self.infer.local(temp_workflow_path)

            # Clean up the temporary file
            Path(temp_workflow_path).unlink()

            return Response(
                img_bytes, media_type="image/png"
            )  # Or appropriate media type

        except FileNotFoundError as e:
            print(f"Error during inference: {e}")
            raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
        except TimeoutError as e:
            print(f"Error during inference: {e}")
            raise HTTPException(status_code=504, detail=f"Inference timed out: {e}")
        except Exception as e:
            # Catch other potential errors from infer() or file operations
            print(f"Unexpected error during API request: {e}")
            # Clean up temp file if it exists and an error occurred
            if "temp_workflow_path" in locals() and Path(temp_workflow_path).exists():
                try:
                    Path(temp_workflow_path).unlink()
                except OSError:
                    print(f"Error cleaning up temp file {temp_workflow_path}")
            raise HTTPException(
                status_code=500, detail=f"An unexpected error occurred: {e}"
            )

    def poll_server_health(self, startup=False) -> Dict:
        """Checks if the ComfyUI server is responsive."""
        import socket
        import time
        import urllib.request

        # Give server time to start on initial check
        if startup:
            time.sleep(10)  # Wait a bit longer during startup

        url = f"http://127.0.0.1:{self.port}/system_stats"
        try:
            req = urllib.request.Request(url)
            response = urllib.request.urlopen(req, timeout=5)
            if response.status == 200:
                print("ComfyUI server is healthy.")
                return json.loads(response.read())
            else:
                print(
                    f"ComfyUI server health check failed with status: {response.status}"
                )
                # Decide if this non-200 status is fatal
                # modal.experimental.stop_fetching_inputs() # Uncomment if non-200 means stop
                raise Exception(f"ComfyUI server returned status {response.status}")

        except (socket.timeout, urllib.error.URLError) as e:
            print(f"ComfyUI server health check failed: {str(e)}")
            # Server didn't respond in time or network error, likely needs restart/stop
            modal.experimental.stop_fetching_inputs()
            raise Exception(f"ComfyUI server is not responding: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding health check response: {e}")
            # Server responded but with invalid JSON. Might still be usable?
            # Or treat as failure:
            # modal.experimental.stop_fetching_inputs()
            raise Exception(f"Failed to decode server health response: {e}")


# Example client code (can be run locally)
# import modal
# import os

# def main(prompt: str = "beautiful landscape painting"):
#     payload = {"prompt": prompt}
#     response = modal.Function.lookup("example-comfyui", "ComfyUI.api").remote(payload)

#     # Save the image
#     output_dir = "comfyui_outputs"
#     os.makedirs(output_dir, exist_ok=True)
#     filename = os.path.join(output_dir, f"{prompt[:20].replace(' ', '_')}.png")
#     with open(filename, "wb") as f:
#         f.write(response)
#     print(f"Saved image to {filename}")

# if __name__ == "__main__":
#     # Example usage: python your_client_script.py --prompt "a cat riding a unicorn"
#     # Make sure to deploy the Modal app first: modal deploy comfyapp.py
#     # main() # Needs modal CLI setup to run directly
#     pass # Placeholder
