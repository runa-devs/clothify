import json
import subprocess
from pathlib import Path
from typing import Dict

import modal

# from dotenv import load_dotenv
# load_dotenv(".env.local")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "git-lfs", "libgl1-mesa-dev", "libglib2.0-0")
    .pip_install("fastapi[standard]==0.115.4")
    .pip_install("comfy-cli==1.3.8")
    .pip_install("requests")
    .run_commands("comfy --skip-prompt install --fast-deps --nvidia --version 0.3.10")
    .run_commands("comfy node install --fast-deps comfyui-impact-pack@8.14.2")
    .run_commands("comfy node install --fast-deps comfyui_layerstyle@1.0.90")
    .run_commands("comfy node install --fast-deps comfyui-easy-use@1.2.9")
    .run_commands("comfy node install --fast-deps comfyui-kjnodes@1.0.9")
    .run_commands("comfy node install --fast-deps comfyui_essentials@1.1.0")
    .run_commands("comfy node install --fast-deps comfyui-inpaint-cropandstitch@2.1.4")
    .run_commands("git lfs install")
    .run_commands(
        "git clone https://github.com/ZHO-ZHO-ZHO/ComfyUI-YoloWorld-EfficientSAM /root/comfy/ComfyUI/custom_nodes/ComfyUI-YoloWorld-EfficientSAM --depth 1"
    )
    .run_commands(
        "git clone https://huggingface.co/mattmdjaga/segformer_b2_clothes /root/comfy/ComfyUI/models/segformer_b2_clothes"
    )
)

# Download custom nodes (example: WAS Node Suite)
# Find node names on the ComfyUI Registry: https://comfyregistry.org/
# image = image.run_commands(
#     "comfy node install --fast-deps was-node-suite-comfyui@1.0.2"
# )

# Add memory snapshot helper custom node
# See https://modal.com/docs/guide/faster-cold-starts#memory-snapshotting for details
# image = image.add_local_dir(
#     local_path=Path(__file__).parent / "memory_snapshot_helper",
#     remote_path="/root/comfy/ComfyUI/custom_nodes/memory_snapshot_helper",
#     copy=True,
# )


def hf_download(
    repo_id: str,
    filename: str,
    model_dir: str = "/root/comfy/ComfyUI/models/checkpoints",
):
    import subprocess

    from huggingface_hub import hf_hub_download

    model = hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        cache_dir="/cache",
    )

    model_dir
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
            "repo_id": "comfyanonymous/flux_text_encoders",
            "filename": "clip_l.safetensors",
            "model_dir": "/root/comfy/ComfyUI/models/text_encoders",
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
        hf_download(model["repo_id"], model["filename"], model["model_dir"])


vol = modal.Volume.from_name("hf-hub-cache", create_if_missing=True)

image = (
    image.pip_install("huggingface_hub[hf_transfer]==0.30.0")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .run_function(
        hf_download_all,
        volumes={"/cache": vol},
    )
)

workflow_file_path = Path(__file__).parent / "workflow_api.json"
if workflow_file_path.exists():
    image = image.add_local_file(
        workflow_file_path, "/root/workflow_api.json", copy=True
    )
else:
    print(
        f"Warning: {workflow_file_path} not found. API endpoint might not work without a workflow."
    )

app = modal.App(name="clothify-comfyui", image=image)


@app.function(
    max_containers=1,
    gpu="A10G",
    volumes={"/cache": vol},
)
@modal.concurrent(max_inputs=10)
@modal.web_server(8000, startup_timeout=60)
def ui():
    subprocess.Popen(
        "comfy launch --background -- --listen 0.0.0.0 --port 8000", shell=True
    )


@app.cls(
    scaledown_window=15,
    gpu="H100",
    volumes={"/cache": vol},
    # enable_memory_snapshot=True,
)
@modal.concurrent(max_inputs=16)
class ComfyUI:
    port: int = 8188

    # @modal.enter(snap=True)
    @modal.enter()
    def launch_comfy_background(self):
        cmd = f"comfy launch --background -- --port {self.port}"
        subprocess.run(cmd, shell=True, check=True)
        print(f"ComfyUI server started in background on port {self.port}")
        self.poll_server_health(startup=True)

    # @modal.enter(snap=False)
    @modal.enter()
    def restore_snapshot(self):
        import requests

        try:
            response = requests.post(f"http://127.0.0.1:{self.port}/cuda/set_device")
            response.raise_for_status()
            print("Successfully set CUDA device after snapshot restore.")
        except requests.exceptions.RequestException as e:
            print(f"Failed to set CUDA device after snapshot restore: {e}")

    @modal.method()
    def infer(self, workflow_path: str = "/root/workflow_api.json"):
        import sys
        import time

        import requests

        self.poll_server_health()

        try:
            with open(workflow_path, "r") as f:
                prompt = json.load(f)
        except FileNotFoundError:
            print(f"Error: Workflow file not found at {workflow_path}", file=sys.stderr)
            raise
        except json.JSONDecodeError:
            print(
                f"Error: Invalid JSON in workflow file at {workflow_path}",
                file=sys.stderr,
            )
            raise

        print(
            "costume",
            len(prompt["272"]["inputs"]["base64_data"]),
            "selfie",
            len(prompt["273"]["inputs"]["base64_data"]),
        )
        payload = {"prompt": prompt}
        try:
            response = requests.post(
                f"http://127.0.0.1:{self.port}/prompt", json=payload, timeout=10
            )
            response.raise_for_status()
            result = response.json()
            prompt_id = result["prompt_id"]
            print(f"Queued prompt with ID: {prompt_id}", file=sys.stderr)
        except requests.exceptions.Timeout as e:
            print(f"Timeout queuing prompt: {e}", file=sys.stderr)
            raise Exception(f"Failed to queue prompt (timeout): {e}")
        except requests.exceptions.RequestException as e:
            print(f"Error queuing prompt: {e}", file=sys.stderr)
            raise Exception(f"Failed to queue prompt: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding queue response: {e}", file=sys.stderr)
            raise Exception(f"Failed to decode queue response: {e}")

        timeout_seconds = 200
        start_time = time.time()
        while time.time() - start_time < timeout_seconds:
            print(
                f"Waiting for prompt {prompt_id} to complete... {int(time.time() - start_time)}/{timeout_seconds}"
            )
            try:
                history_url = f"http://127.0.0.1:{self.port}/history/{prompt_id}"
                history_response = requests.get(history_url, timeout=5)
                history_response.raise_for_status()
                history_data = history_response.json()

                if (
                    prompt_id in history_data
                    and history_data[prompt_id]["status"]["status_str"] == "error"
                ):
                    raise Exception(
                        f"Prompt {prompt_id} failed with error: \n{history_data[prompt_id]['status']['messages']}"
                    )

                if prompt_id in history_data and history_data[prompt_id]["outputs"]:
                    outputs = history_data[prompt_id]["outputs"]
                    target_node_id = "258"
                    if (
                        target_node_id in outputs
                        and "images" in outputs[target_node_id]
                        and outputs[target_node_id]["images"]
                    ):
                        print(f"Found result node with images: {target_node_id}")
                        image_data = outputs[target_node_id]["images"][0]
                        image_filename = image_data["filename"]
                        image_subfolder = image_data.get("subfolder", "")
                        image_type = image_data["type"]

                        image_params = {
                            "filename": image_filename,
                            "subfolder": image_subfolder,
                            "type": image_type,
                        }
                        image_url = f"http://127.0.0.1:{self.port}/view"
                        img_response = requests.get(
                            image_url, params=image_params, timeout=10
                        )
                        img_response.raise_for_status()

                        print(
                            f"Successfully fetched image for prompt {prompt_id}",
                            file=sys.stderr,
                        )
                        return img_response.content
                    else:
                        print(
                            f"Node {target_node_id} with image data not found in outputs for prompt {prompt_id}",
                            file=sys.stderr,
                        )
            except requests.exceptions.Timeout:
                print(
                    f"Timeout polling history for prompt {prompt_id}, retrying...",
                    file=sys.stderr,
                )
            except requests.exceptions.RequestException as e:
                print(f"Error polling history: {e}", file=sys.stderr)
            except json.JSONDecodeError as e:
                print(f"Error decoding history response: {e}", file=sys.stderr)
            except KeyError:
                print(
                    f"Prompt ID {prompt_id} not yet in history or outputs incomplete, polling again...",
                    file=sys.stderr,
                )

            time.sleep(1)

        print(f"Timeout reached waiting for prompt {prompt_id}", file=sys.stderr)
        raise TimeoutError(f"ComfyUI inference timed out for prompt {prompt_id}")

    @modal.fastapi_endpoint(method="POST")
    def api(self, item: Dict):
        import sys
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

        print("received item", item)

        costume_node_id = "272"
        selfie_node_id = "273"
        category_node_id = "181"
        if "category" in item:
            if (
                category_node_id in workflow_data
                and "inputs" in workflow_data[category_node_id]
                and item["category"] in workflow_data[category_node_id]["inputs"]
            ):
                workflow_data[category_node_id]["inputs"][item["category"]] = True
            else:
                print(
                    f"Warning: Could not find node '{category_node_id}' or its 'inputs' to set the category.",
                    file=sys.stderr,
                )
        else:
            print("Insufficient payload Key [category]")

        if "costumeData" in item and item["costumeData"] is not None:
            if (
                costume_node_id in workflow_data
                and "inputs" in workflow_data[costume_node_id]
            ):
                workflow_data[costume_node_id]["inputs"]["base64_data"] = item[
                    "costumeData"
                ]
            else:
                print(
                    f"Warning: Could not find node '{costume_node_id}' or its 'inputs' to set the prompt.",
                    file=sys.stderr,
                )
        else:
            print("Insufficient payload Key [costumeData]")

        if "selfieData" in item and item["selfieData"] is not None:
            if (
                selfie_node_id in workflow_data
                and "inputs" in workflow_data[selfie_node_id]
            ):
                workflow_data[selfie_node_id]["inputs"]["base64_data"] = item[
                    "selfieData"
                ]
            else:
                print(
                    f"Warning: Could not find node '{selfie_node_id}' or its 'inputs' to set the prompt.",
                    file=sys.stderr,
                )
        else:
            print("Insufficient payload Key [selfieData]")

        print("created workflow", workflow_data)

        try:
            with tempfile.NamedTemporaryFile(
                mode="w", delete=False, suffix=".json"
            ) as temp_workflow_file:
                json.dump(workflow_data, temp_workflow_file)
                temp_workflow_path = temp_workflow_file.name
            print(f"Saved modified workflow to {temp_workflow_path}")

            img_bytes = self.infer.local(temp_workflow_path)

            Path(temp_workflow_path).unlink()

            return Response(img_bytes, media_type="image/png")

        except FileNotFoundError as e:
            print(f"Error during inference: {e}")
            raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
        except TimeoutError as e:
            print(f"Error during inference: {e}")
            raise HTTPException(status_code=504, detail=f"Inference timed out: {e}")
        except Exception as e:
            print(f"Unexpected error during API request: {e}")
            if "temp_workflow_path" in locals() and Path(temp_workflow_path).exists():
                try:
                    Path(temp_workflow_path).unlink()
                except OSError:
                    print(f"Error cleaning up temp file {temp_workflow_path}")
            raise HTTPException(
                status_code=500, detail=f"An unexpected error occurred: {e}"
            )

    def poll_server_health(self, startup=False) -> Dict:
        import time

        import requests

        if startup:
            time.sleep(10)

        url = f"http://127.0.0.1:{self.port}/system_stats"
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            print("ComfyUI server is healthy.")
            return response.json()

        except requests.exceptions.Timeout:
            print(f"ComfyUI server health check timed out: {url}")
            modal.experimental.stop_fetching_inputs()
            raise Exception(f"ComfyUI server health check timed out: {url}")
        except requests.exceptions.ConnectionError as e:
            print(f"ComfyUI server health check failed (connection error): {str(e)}")
            modal.experimental.stop_fetching_inputs()
            raise Exception(f"ComfyUI server is not responding (connection error): {e}")
        except requests.exceptions.HTTPError as e:
            print(
                f"ComfyUI server health check failed with HTTP status: {e.response.status_code} for url: {url}"
            )
            modal.experimental.stop_fetching_inputs()
            raise Exception(
                f"ComfyUI server returned status {e.response.status_code}: {e}"
            )
        except json.JSONDecodeError as e:
            print(f"Error decoding health check response: {e} from url: {url}")
            modal.experimental.stop_fetching_inputs()
            raise Exception(f"Failed to decode server health response: {e}")
        except requests.exceptions.RequestException as e:
            print(
                f"ComfyUI server health check failed (request exception): {str(e)} for url: {url}"
            )
            modal.experimental.stop_fetching_inputs()
            raise Exception(f"ComfyUI server health check failed: {e}")
