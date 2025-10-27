from pydub import AudioSegment
from pydub.utils import which
import os

# Set the path to FFmpeg explicitly
AudioSegment.converter = which("ffmpeg")  # Or provide the full path
AudioSegment.ffprobe = which("ffprobe")  # Or provide the full path

# Print the paths to verify
print("FFmpeg path:", AudioSegment.converter)
print("FFprobe path:", AudioSegment.ffprobe)
print("Current working directory:", os.getcwd())

# Test audio processing
audio = AudioSegment.from_file("recorded_audio.wav")
audio.export("output_audio.mp3", format="mp3")
