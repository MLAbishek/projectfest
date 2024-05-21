// Get references to the video, canvas, and button
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const predictBtn = document.getElementById('predict');
const resultEl = document.getElementById('result');

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing webcam:', err);
    });

// Send the captured photo to the backend for prediction
predictBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.width;
    canvas.height = video.height;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.pause(); // Pause the video stream

    const imageData = canvas.toDataURL('image/jpeg');
    const formData = new FormData();
    formData.append('image', imageData.split(',')[1]);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        resultEl.textContent = result;
        video.play(); // Resume the video stream after prediction
    })
    .catch(err => {
        console.error('Error sending image to backend:', err);
        video.play(); // Resume the video stream on error
    });
});