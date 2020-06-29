import http from "http";
import { Perceptron } from "./brain";
import { createCanvas } from "canvas";

const LIGHT_GREEN = "#a0ffb9";
const LIGHT_RED = "#ffa0a2";

const perceptron = new Perceptron({
  inputNum: 2,
  lossFn: ([x, y]: Array<number>): number => (x > y ? x - y : y - x) / 2
});

const canvas = createCanvas(800, 800);
const ctx = canvas.getContext("2d");

type dot = { x: number; y: number; color: string };
const dots: dot[] = [];
function addDot(x: number, y: number, color: string): void {
  dots.push({ x, y, color });
}

function redraw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // visualize correct answer
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.moveTo(800, 800);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // visualize understanding
  ctx.strokeStyle = "rgba(100,0,100,0.5)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  // @TODO: this doesn't take the bias into account but still happens to seem
  // correct. Figure that out!
  ctx.lineTo(800, -(800 * perceptron.weights[0]) / perceptron.weights[1]);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#003300";
  for (const dot of dots) {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
}

function train(): [number, number, number, boolean] {
  const x = Math.random() * 800;
  const y = Math.random() * 800;
  const [guess, error] = perceptron.train([x, y], x > y ? 1 : -1);
  addDot(x, y, guess === 1 ? "blue" : "orange");
  return [x, y, guess, error === 0];
}

http
  .createServer(function(req, res) {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const [x, y, guess, correct] = train();
      redraw();

      res.end(
        `<html><body style="background:#eee">` +
          '<div style="float:right;padding-left:1em"><img src="' +
          canvas.toDataURL() +
          '" /></div>' +
          `<p><b>weight 1: </b>${perceptron.weights[0]}</p>` +
          `<p><b>weight 2: </b>${perceptron.weights[1]}</p>` +
          `<p><b>certainty: </b>${perceptron.certainty * 100}%</p>` +
          `<p style="background-color:${
            correct ? LIGHT_GREEN : LIGHT_RED
          };"><b>last guess:</b>` +
          `<br />x: ${x}` +
          `<br />y: ${y}` +
          `<br />guess: ${guess}` +
          `</p>` +
          `<p><b>Key:</b><dl>` +
          `<dt>black line</dt> <dd>A static line representing the "correct" vector distinguishing between the two halves of the canvas.</dd>` +
          `<dt>purple line</dt> <dd>A line representing the perceptron's understanding of the vector distinguishing between the two halves of the canvas.</dd>` +
          `<dt>blue dot</dt> <dd>A dot inserted at randomly generated coordinates which the perceptron has guessed to have been inserted in the top-right half of the canvas.</dd>` +
          `<dt>yellow dot</dt> <dd>A dot inserted at randomly generated coordinates which the perceptron has guessed to have been inserted in the bottom-left half of the canvas.</dd>` +
          `</dl></p>` +
          `</body></html>`
      );
    }
  })
  .listen(3000, function() {
    console.log("Server started on port 3000");
  });
