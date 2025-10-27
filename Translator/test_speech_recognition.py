import speech_recognition as sr

recognizer = sr.Recognizer()

# Create a sample test file (replace 'test.wav' with an actual .wav file path)
audio_file_path = "test.wav"

try:
    with sr.AudioFile(audio_file_path) as source:
        print("Audio file loaded successfully.")
        audio_data = recognizer.record(source)
        print("Audio data recorded successfully.")
        text = recognizer.recognize_google(audio_data)
        print(f"Recognized Text: {text}")
except Exception as e:
    print(f"Error: {e}")
