import base64
import json

import requests

API_URL = "REDACTED"


# Function to encode image to base64
def image_to_base64(filepath):
    with open(filepath, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")


# Image paths (assuming they are in the same directory or provide full path)
costume_image_path = ".venv/test_images/kirby.jpg"
selfie_image_path = ".venv/test_images/elon.jpg"

# Encode images to base64
costume_base64 = image_to_base64(costume_image_path)
selfie_base64 = image_to_base64(selfie_image_path)

# Define the payload for the API request
# Replace with actual S3 keys if necessary for a full test
payload = {
    "costumeData": costume_base64,
    "selfieData": selfie_base64,
    "category": "upper_clothes",
}

headers = {"Content-Type": "application/json"}

print(f"Sending request to {API_URL}")
response = requests.post(API_URL, headers=headers, json=payload)

if response.status_code == 200:
    if "image" in response.headers.get("Content-Type", ""):
        output_filename = "output_image.png"
        with open(output_filename, "wb") as f:
            f.write(response.content)
        print(f"Success! Image saved as {output_filename}")
    else:
        print(
            f"Success! Status code: {response.status_code}, but content type is not image: {response.headers.get('Content-Type')}"
        )
        print("Response content:")
        print(response.text)
else:
    print(f"Error: Request failed with status code {response.status_code}")
    print("Response content:")
    try:
        error_detail = response.json()
        print(json.dumps(error_detail, indent=2))
    except json.JSONDecodeError:
        print(response.text)
