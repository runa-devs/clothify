import json

import requests

API_URL = "REDACTED"

# Define the payload for the API request
# Replace with actual S3 keys if necessary for a full test
payload = {
    "costumeKey": "input/kirby.jpg",  # Example S3 key
    "selfieKey": "input/elon.jpg",  # Example S3 key
}

# Define headers
headers = {"Content-Type": "application/json"}

try:
    # Send the POST request
    print(f"Sending request to {API_URL} with payload: {payload}")
    response = requests.post(API_URL, headers=headers, json=payload)

    # Check if the request was successful
    if response.status_code == 200:
        # Check if the content type is an image
        if "image" in response.headers.get("Content-Type", ""):
            # Save the image
            output_filename = "output_image.png"
            with open(output_filename, "wb") as f:
                f.write(response.content)
            print(f"Success! Image saved as {output_filename}")
        else:
            print(
                f"Success! Status code: {response.status_code}, but content type is not image: {response.headers.get('Content-Type')}"
            )
            print("Response content:")
            print(response.text)  # Print text content if not an image
    else:
        print(f"Error: Request failed with status code {response.status_code}")
        print("Response content:")
        try:
            # Try to print JSON error detail if available
            error_detail = response.json()
            print(json.dumps(error_detail, indent=2))
        except json.JSONDecodeError:
            # Otherwise print raw text
            print(response.text)

except requests.exceptions.RequestException as e:
    print(f"An error occurred during the request: {e}")
