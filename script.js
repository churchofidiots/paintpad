let isThick = false;
let colorPicker, bgColorPicker;
let clearButton, thicknessButton, saveButton, undoButton, imgInput;
let uploadedImage = null;

let strokes = [];
let undoneStrokes = [];
let currentStroke = [];

function setup() {
  const container = createDiv().id("container");
  container.style("display", "flex");
  container.style("flexDirection", "column");
  container.style("alignItems", "center");
  container.style("gap", "10px");
  container.style("width", "850px");

  const canvasContainer = createDiv().id("canvasContainer").parent(container);
  const c = createCanvas(800, 450);
  c.parent(canvasContainer);

  const toolbar = createDiv().id("toolbar").parent(container);

  colorPicker = createColorPicker("#000000");
  colorPicker.parent(toolbar);

  thicknessButton = createButton("Thick Stroke");
  thicknessButton.mousePressed(toggleThickness);
  thicknessButton.parent(toolbar);

  clearButton = createButton("Clear");
  clearButton.mousePressed(clearCanvas);
  clearButton.parent(toolbar);

  undoButton = createButton("Undo");
  undoButton.mousePressed(undoStroke);
  undoButton.parent(toolbar);

  saveButton = createButton("Save");
  saveButton.mousePressed(saveDrawing);
  saveButton.parent(toolbar);

  bgColorPicker = createColorPicker("#ffffff");
  bgColorPicker.parent(toolbar);
   
  imgInput = createFileInput(handleImageUpload);
  imgInput.parent(toolbar);
}

function draw() {
  background(bgColorPicker.color());

  // Draw uploaded image if exists
  if (uploadedImage) {
    image(uploadedImage, 0, 0, width, height);
  }

  // Draw all previous strokes
  for (let strokePath of strokes) {
    for (let i = 1; i < strokePath.length; i++) {
      let p1 = strokePath[i - 1];
      let p2 = strokePath[i];
      stroke(p2.color);
      strokeWeight(p2.weight);
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }

  // Draw the currently active stroke
  if (currentStroke.length > 1) {
    for (let i = 1; i < currentStroke.length; i++) {
      let p1 = currentStroke[i - 1];
      let p2 = currentStroke[i];
      stroke(p2.color);
      strokeWeight(p2.weight);
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
}

function mouseDragged() {
  if (mouseY <= height) {
    currentStroke.push({
      x: mouseX,
      y: mouseY,
      color: colorPicker.color(),
      weight: isThick ? 10 : 2,
    });
  }
}

function mouseReleased() {
  if (currentStroke.length > 0) {
    strokes.push(currentStroke);
    currentStroke = [];
    undoneStrokes = []; // clear redo stack
  }
}

function toggleThickness() {
  isThick = !isThick;
  thicknessButton.html(isThick ? "Thin Stroke" : "Thick Stroke");
}

function clearCanvas() {
  strokes = [];
  undoneStrokes = [];
  uploadedImage = null;
}

function undoStroke() {
  if (strokes.length > 0) {
    undoneStrokes.push(strokes.pop());
  }
}

function redoStroke() {
  if (undoneStrokes.length > 0) {
    strokes.push(undoneStrokes.pop());
  }
}

function saveDrawing() {
  saveCanvas("my-drawing", "png");
}

function handleImageUpload(file) {
  if (file.type === "image") {
    loadImage(file.data, (img) => {
      uploadedImage = img;
      strokes = [];
      undoneStrokes = [];
    });
  } else {
    console.log("File is not an image.");
  }
}

