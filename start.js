const os = require('os')
module.exports = async (kernel) => {
  return {
    run: [{
      method: "shell.start",
      params: {
        path: "automatic",
        env: {
          HF_HOME: "../huggingface"
        },
      }
    }, {
      method: "shell.enter",
      params: {
        message: "{{os.platform() === 'win32' ? 'webui.bat' : 'bash webui.sh -f'}}",
        on: [{
          event: "/(http:\/\/127.0.0.1:[0-9]+)/",
          return: "{{event.matches[0][1]}}"
        }]
      }
    }, {
      method: "self.set",
      params: {
        "session.json": {
          "url": "{{input}}"
        }

      }
    }, {
      method: "browser.open",
      params: {
        uri: "/?selected=Stable Diffusion web UI"
      }
//    }, {
//      method: "notify",
//      params: {
//        html: "Successfully launched. Go to the dashboard to open the web ui",
//        href: "/?selected=Stable Diffusion web UI"
//      }
    }, {
      method: "process.wait"
    }]
  }
}
