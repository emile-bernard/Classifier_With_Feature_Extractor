// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extractor with MobileNet
=== */

// Grab all the DOM elements
let video = document.getElementById('video');
let videoStatus = document.getElementById('videoStatus');
let loading = document.getElementById('loading');
let aButton = document.getElementById('aButton');
let bButton = document.getElementById('bButton');
let saveButton = document.getElementById('saveButton');
let loadButton = document.getElementById('loadButton');
let amountOfAImages = document.getElementById('amountOfAImages');
let amountOfBImages = document.getElementById('amountOfBImages');
let train = document.getElementById('train');
let loss = document.getElementById('loss');
let result = document.getElementById('result');
var predict = document.getElementById('predict');

// A variable to store the total loss
let totalLoss = 0;

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

// A function to be called when the model has been loaded
function modelLoaded() {
    loading.innerText = 'Model loaded!';
}

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(video, videoReady);

// Predict the current frame.
function predict() {
    classifier.predict(gotResults);
}

// A function to be called when the video is finished loading
function videoReady() {
    videoStatus.innerText = 'Video ready!';
}

// When the A button is pressed, add the current frame
// from the video with a label of a to the classifier
aButton.onclick = function () {
    classifier.addImage('A');
    amountOfAImages.innerText = Number(amountOfAImages.innerText) + 1;
};

// When the B button is pressed, add the current frame
// from the video with a label of b to the classifier
bButton.onclick = function () {
    classifier.addImage('B');
    amountOfBImages.innerText = Number(amountOfBImages.innerText) + 1;
};

// When the train button is pressed, train the classifier
// With all the given a and b images
train.onclick = function () {
    classifier.train(function(lossValue) {
        if (lossValue) {
            totalLoss = lossValue;
            loss.innerHTML = 'Loss: ' + totalLoss;
        } else {
            loss.innerHTML = 'Done Training! Final Loss: ' + totalLoss;
        }
    });
};

saveButton.onclick = function () {
    classifier.save();
};

loadButton.onclick = function () {
    classifier.load('./SavedModel/model.json');
};

// Show the results
function gotResults(err, data) {
    // Display any error
    if (err) {
        console.error(err);
    }
    result.innerText = data;
    classifier.classify(gotResults);
}

// Start predicting when the predict button is clicked
predict.onclick = function () {
    classifier.classify(gotResults);
};
