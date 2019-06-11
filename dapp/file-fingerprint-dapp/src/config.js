const config = {
  "ethereum": {
    "host": "wss://kovan.infura.io/ws",
    "contract": {
      "address": "0x42aea6fa6f8b2c60a3a75b41045e9c2fd288efc3",
    }
  },
  "fileserver": {
    "endpoint": process.env.REACT_APP_FILESERVER_ENDPOINT || '/',
  }
}

export default config;
