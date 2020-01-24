"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const brain_1 = require("./brain");
const canvas_1 = require("canvas");
const perceptron = new brain_1.Perceptron();
const canvas = canvas_1.createCanvas(800, 800);
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(800, 800);
ctx.lineTo(0, 0);
ctx.stroke();
function addDot() {
    const x = Math.random() * 800;
    const y = Math.random() * 800;
    const [guess] = perceptron.train(x, y, x > y ? 1 : -1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.fillStyle = guess === 1 ? 'green' : 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}
http_1.default.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        addDot();
        res.end(`<p><b>weight 1: </b>${perceptron.w1}</p>` +
            `<p><b>weight 2: </b>${perceptron.w2}</p>` +
            `<p><b>certainty: </b>${perceptron.certainty * 100}%</p>` +
            '<img src="' + canvas.toDataURL() + '" />');
    }
}).listen(3000, function () {
    console.log('Server started on port 3000');
});
