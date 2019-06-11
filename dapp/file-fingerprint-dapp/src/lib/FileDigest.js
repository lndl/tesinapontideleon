const sha256 = require('js-sha256').sha256;

const calculateDigest = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = (_) => {
      resolve(sha256(reader.result))
    }
    reader.readAsArrayBuffer(file)
  })
}

const calculateDigestFromResponse = (res) => {
  return new Promise((resolve, reject) => {
    if (res.status !== 200) {
      reject()
    }

    const reader = res.body.getReader()
    let chunksRead = []

    const concatBlob = (blob, chunk) => {
      let newBlob = new Uint8Array(blob.length + chunk.length);
      newBlob.set(blob);
      newBlob.set(chunk, blob.length);

      return newBlob
    }

    const pump = () => {
      return reader.read().then(({ done, value: chunk }) => {
        if (done) {
          resolve(sha256(chunksRead.reduce(concatBlob, new Uint8Array())))
        } else {
          chunk && chunksRead.push(chunk)
          return pump()
        }
      })
    }

    return pump()
  });
}

export { calculateDigest, calculateDigestFromResponse }
