const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
          video: true
        },
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata', () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  })
};

let net;


async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();
  while (true) {
    const result = await net.classify(webcamElement);

    document.getElementById('console').innerText = `
      style:
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
};

app();

// const videoBox = () =>{
// let my_class = document.createAttribute('class');
// let my_floatingBox = document.getElementsByTagName('video')

// floatingBox.append



