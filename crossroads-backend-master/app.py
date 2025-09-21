from flask import Flask, request, jsonify, send_from_directory
import json
import os
import shutil
import sys
import predictfood
import predictclasses
import dotenv
import base64

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/image-receiver', methods=['POST'])
def image_receiver():
    # print('test')
    # # Create a temporary directory to save the files
    # TEMP_DIR = os.path.abspath('temp-download')
    # if os.path.exists(TEMP_DIR):
    #     shutil.rmtree(TEMP_DIR)
    # os.makedirs(TEMP_DIR, exist_ok=True)
    #
    # files = {}
    #
    # print("Saving local files:")
    # print(request.files)
    # for [field_name, f] in request.files.items():
    #     print('Saving to ', os.path.join('temp-download', f.filename))
    #     filename = f.filname
    #     f.save(os.path.join('temp-download', f.filename.replace('-', '_')))
    #
    #     files[field_name.replace('-', '_')] = os.path.join('temp-download', f.filename.replace('-', '_'))
    #     print('Saved ', field_name, files[field_name.replace('-', '_')])
    #
    #     # json_data[]
    #
    # print(files)
    # print('Saved all files locally to the temp-download directory')
    # #call model function
    # #return output
    # filepath = './temp-download/' + filename
    # food = predictfood.predictfood(filepath)
    # classes = predictclasses.predictclasses(filepath)
    #
    # return [food, classes]
    if request.is_json:
        data = request.get_json()
        base_string = data.get("baseString", "")

        if base_string:
            # Strip off "data:image/jpeg;base64," if included
            if "," in base_string:
                base_string = base_string.split(",")[1]

            # Decode base64 → bytes
            image_data = base64.b64decode(base_string)

            # Ensure temp directory exists
            TEMP_DIR = os.path.abspath("temp-download")
            os.makedirs(TEMP_DIR, exist_ok=True)

            filename = "uploaded.jpg"
            filepath = os.path.join(TEMP_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(image_data)

            # 🔮 Call your models
            food = predictfood.predictfood(filepath)
            classes = predictclasses.predictclasses(filepath)

            # ✅ Keep the same return format
            return jsonify([food, classes])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
