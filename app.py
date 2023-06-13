from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2

app = Flask(__name__)
model_path = 'models/model.json'

def preprocess_image(image):
    # Resize the image to the desired input shape
    resized_image = cv2.resize(image, (224, 224))
    
    # Convert the image to the range of 0-1
    processed_image = resized_image / 255.0
    
    # Add an extra dimension to match the expected input shape of the model
    processed_image = np.expand_dims(processed_image, axis=0)
    
    return processed_image


def process_prediction(prediction):
    # Get the index of the predicted class
    predicted_class_index = np.argmax(prediction)
    
    # Map the predicted class index to the corresponding class label
    class_labels = ['Class A', 'Class B', 'Class C']  # Replace with your actual class labels
    predicted_class_label = class_labels[predicted_class_index]
    
    return predicted_class_label

@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Ambil data gambar dari permintaan
        image = request.files['image']

        # Baca gambar menggunakan OpenCV
        img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)

        # Lakukan prapemrosesan jika diperlukan
        processed_image = preprocess_image(img)

        # Lakukan prediksi menggunakan model TensorFlow
        model = tf.keras.models.load_model(model_path)
        prediction = model.predict(processed_image)

        # Ambil hasil prediksi
        result = process_prediction(prediction)

        # Kirim respon berupa hasil prediksi
        return jsonify({'aksara': result})

    except Exception as e:
        print('Terjadi kesalahan:', e)
        return jsonify({'error': 'Terjadi kesalahan dalam memproses gambar.'}), 500


if __name__ == '__main__':
    app.run()
