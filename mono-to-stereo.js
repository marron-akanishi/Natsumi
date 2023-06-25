class Mono2StereoProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    // this.port.postMessage(`input: ${inputs[0].length}`);
    // this.port.postMessage(`output: ${outputs[0].length}`);
    const input = inputs[0][0];
    const leftOutput = outputs[0][0];
    let rightOutput = null;
    if (outputs[0].length == 2) {
      rightOutput = outputs[0][1];
    }

    let i = 0;
    while (i < input.length) {
      leftOutput[i] = input[i + 1];
      leftOutput[i + 1] = input[i + 1];

      if (rightOutput) {
        rightOutput[i] = input[i];
        rightOutput[i + 1] = input[i];
      }

      i += 2;
    }

    return true;
  }
}

registerProcessor("mono-to-stereo", Mono2StereoProcessor);