from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import string
import speech_recognition as sr
from PIL import Image
import tempfile
from subprocess import run  # <-- Add this import


app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB


# Predefined ISL GIF phrases and alphabet
isl_gif = [
    'any questions', 'are you angry', 'are you busy', 'are you hungry', 'are you sick',
    'be careful', 'can we meet tomorrow', 'did you book tickets', 'did you finish homework', 
    # Add more phrases as needed
]
arr = list(string.ascii_lowercase)


def preprocess_audio(input_path, output_path):
    try:
        # Convert Opus to PCM WAV using ffmpeg
        command = [
            "ffmpeg", "-i", input_path, 
            "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "1", 
            output_path
        ]
        run(command, check=True)
        print("Audio conversion successful.")
    except Exception as e:
        print("Error during conversion:", e)

@app.route('/translate', methods=['POST'])
def translate():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    
    input_file = request.files['file']
    print(f"Filename: {input_file.filename}, Content-Type: {input_file.content_type}, Size: {request.content_length}")


    # if input_file:
    #     input_file.save(input_file.filename)
    #     return jsonify({'message': 'Audio uploaded successfully'}), 200
    
    
    # Save the file
    file_path = os.path.join(input_file.filename)
    # os.makedirs('uploaded_files', exist_ok=True)  # Ensure the directory exists
    input_file.save(file_path)


    # Convert to PCM WAV
    converted_path = file_path.replace(".wav", "_converted.wav")
    preprocess_audio(file_path, converted_path)

    audio_file = 'recorded_audio_converted.wav'

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
            # print(f"Detected voice input from: {audio_file}")
            audio = recognizer.record(source)
            voice_input = recognizer.recognize_google(audio).lower()
            print(f"Recognized voice input1: {voice_input}")
    except Exception as e:
        return jsonify({"error": "Audio processing failed", "details": str(e)}), 500
    finally:
        os.remove(file_path)  # Clean up the temporary file
        os.remove(converted_path)  # Clean up the temporary file
    
    print(f"Recognized voice input2: {voice_input}")

    # Remove punctuation
    for c in string.punctuation:
        voice_input = voice_input.replace(c, "")

    print(f"Recognized voice input3: {voice_input}")

    # Check if the voice input matches a predefined ISL phrase
    if voice_input in isl_gif:
        gif_path = os.path.join('ISL_Gifs', f'{voice_input}.gif')
        if os.path.exists(gif_path):
            return send_file(gif_path, mimetype='image/gif')
        else:
            return jsonify({"error": "GIF not found"}), 404

    # If no match, generate image sequence for individual letters
    image_paths = [os.path.join('letters', f'{char}.jpg') for char in voice_input if char in arr]
    missing_letters = [char for char, path in zip(voice_input, image_paths) if not os.path.exists(path)]

    if missing_letters:
        return jsonify({"error": f"Images for the following characters not found: {', '.join(missing_letters)}"}), 404

    # Combine images horizontally
    images = [Image.open(path) for path in image_paths]
    total_width = sum(img.width for img in images)
    max_height = max(img.height for img in images)

    combined_image = Image.new('RGB', (total_width, max_height))
    x_offset = 0
    for img in images:
        combined_image.paste(img, (x_offset, 0))
        x_offset += img.width

    # Save the combined image and return it
    combined_image_path = 'combined_image.jpg'
    combined_image.save(combined_image_path)
    responsefile =send_file(combined_image_path, mimetype='image/jpeg')
    responsefile.headers['cache-control'] = voice_input
    return responsefile

if __name__ == '__main__':
    app.run(debug=True)
