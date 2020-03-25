export type PerceptronOutput = 1 | -1;
export type LossFunction = (
  inputs: Array<number>,
  guess: PerceptronOutput,
  res: PerceptronOutput,
  error: number
) => number;
export type ActivationFunction = (res: number) => PerceptronOutput;
export type PerceptronOptions = {
  inputNum?: number;
  bias?: number;
  learningRate?: number;
  lossFn?: LossFunction;
  activationFn?: ActivationFunction;
};

const getRandomWeight = (): number => Math.random() * 2 - 1;

export class Perceptron {
  inputNum: number;
  weights: Array<number>;
  bias: number;
  learningRate: number;
  lossFn: LossFunction;
  activationFn: ActivationFunction;
  certainty: number;
  trainingNum: number;
  errorNum: number;

  constructor({
    inputNum = 2,
    bias = 1,
    learningRate = 0.0001,
    lossFn = (): number => 1,
    activationFn = (res: number): PerceptronOutput => (res >= 0 ? 1 : -1)
  }: PerceptronOptions = {}) {
    this.weights = Array(inputNum)
      .fill(null)
      .map(getRandomWeight);
    this.inputNum = inputNum;
    this.bias = bias;
    this.learningRate = learningRate;
    this.lossFn = lossFn;
    this.activationFn = activationFn;
    this.certainty = 0;
    this.trainingNum = 0;
    this.errorNum = 0;
  }

  validateInput(input: Array<number>): void {
    if (input.length !== this.inputNum) {
      throw new Error(
        `Input has ${input.length} items, but should have ${this.inputNum}.`
      );
    }
  }

  guess(input: Array<number>): PerceptronOutput {
    this.validateInput(input);
    let res = 0;
    for (let i = 0; i < input.length; i++) {
      res = res + input[i] * this.weights[i];
    }

    return this.activationFn(res + this.bias);
  }

  train(
    input: Array<number>,
    res: PerceptronOutput
  ): [PerceptronOutput, number] {
    const guess = this.guess(input);
    const error = res - guess;
    if (error !== 0) {
      const loss = this.lossFn(input, guess, res, error);
      for (let i = 0; i < input.length; i++) {
        this.weights[i] =
          this.weights[i] + error * input[i] * loss * this.learningRate;
      }
      this.errorNum = this.errorNum + 1;
    }

    // update certainty.
    this.trainingNum = this.trainingNum + 1;
    const certaintyTotal = Math.max(100, this.trainingNum);
    this.certainty = (this.trainingNum - this.errorNum) / certaintyTotal;

    return [guess, error];
  }
}
