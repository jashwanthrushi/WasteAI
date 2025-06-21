const endpoint = "https://wastesortingproject79-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/efc79c31-52f5-4201-8198-9e0f6c46c702/classify/iterations/waste-classifier/image";
const predictionKey = "CLwfwnbXujAzDlUCplywg6A54EGzKYG7UFcSLBziAqarVigKb7nCJQQJ99BCACGhslBXJ3w3AAAIACOG5F4a";

async function predictWaste() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");
  const preview = document.getElementById("preview");

  resultDiv.innerText = "";
  errorDiv.innerText = "";

  if (!file) {
    errorDiv.innerText = "Please select an image file.";
    return;
  }

  // Show image preview
  const reader = new FileReader();
  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Prediction-Key": predictionKey,
        "Content-Type": "application/octet-stream"
      },
      body: file
    });

    if (!response.ok) {
      throw new Error(`Prediction failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const topPrediction = data.predictions[0];
    resultDiv.innerText = `Predicted Waste Type: ${topPrediction.tagName} (Confidence: ${(topPrediction.probability * 100).toFixed(2)}%)`;

  } catch (err) {
    errorDiv.innerText = err.message;
  }
}
