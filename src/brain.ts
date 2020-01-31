export type PerceptronOutput = 1 | -1;
export type LossFunction = (
  i1: number,
  i2: number,
  guess: PerceptronOutput,
  res: PerceptronOutput,
  error: number
) => number;
export type ActivationFunction = (res: number) => PerceptronOutput;
export type PerceptronOptions = {
  bias?: number;
  learningRate?: number;
  lossFn?: LossFunction;
  activationFn?: ActivationFunction;
};

export class Perceptron {
  w1: number;
  w2: number;
  bias: number;
  learningRate: number;
  lossFn: LossFunction;
  activationFn: ActivationFunction;
  certainty: number;
  trainingNum: number;
  errorNum: number;

  constructor({
    bias = 1,
    learningRate = 0.0001,
    lossFn = (): number => 1,
    activationFn = (res: number): PerceptronOutput => (res >= 0 ? 1 : -1)
  }: PerceptronOptions = {}) {
    this.w1 = Math.random() * 2 - 1;
    this.w2 = Math.random() * 2 - 1;
    this.bias = bias;
    this.learningRate = learningRate;
    this.lossFn = lossFn;
    this.activationFn = activationFn;
    this.certainty = 0;
    this.trainingNum = 0;
    this.errorNum = 0;
  }

  // @TODO: variable number of inputs.
  guess(i1: number, i2: number): PerceptronOutput {
    return this.activationFn(i1 * this.w1 + i2 * this.w2 + this.bias);
  }

  train(
    i1: number,
    i2: number,
    res: PerceptronOutput
  ): [PerceptronOutput, number] {
    const guess = this.guess(i1, i2);
    const error = res - guess;
    if (error !== 0) {
      const loss = this.lossFn(i1, i2, guess, res, error);
      this.w1 = this.w1 + error * i1 * loss * this.learningRate;
      this.w2 = this.w2 + error * i2 * loss * this.learningRate;
      this.errorNum = this.errorNum + 1;
    }

    // update certainty.
    this.trainingNum = this.trainingNum + 1;
    const certaintyTotal = Math.max(100, this.trainingNum);
    this.certainty = (this.trainingNum - this.errorNum) / certaintyTotal;

    return [guess, error];
  }
}
