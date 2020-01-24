"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Perceptron {
    constructor() {
        this.w1 = Math.random() * 2 - 1;
        this.w2 = Math.random() * 2 - 1;
        this.bias = 1;
        this.learningRate = .001;
        this.certainty = 0;
        this.trainingNum = 0;
        this.errorNum = 0;
    }
    activate(res) {
        return res >= 0 ? 1 : -1;
    }
    guess(i1, i2) {
        return this.activate((i1 * this.w1 + i2 * this.w2) + this.bias);
    }
    train(i1, i2, res) {
        const guess = this.guess(i1, i2);
        const error = res - guess;
        if (error !== 0) {
            this.w1 = this.w1 + error * i1 * this.learningRate;
            this.w2 = this.w2 + error * i2 * this.learningRate;
            this.errorNum = this.errorNum + 1;
        }
        this.trainingNum = this.trainingNum + 1;
        this.certainty = (this.trainingNum - this.errorNum) / this.trainingNum;
        return [guess, error];
    }
}
exports.Perceptron = Perceptron;
