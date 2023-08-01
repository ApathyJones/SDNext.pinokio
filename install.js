const path = require("path")
const os = require('os')
module.exports = async (kernel) => {
  const platform = os.platform()
  const graphics = await kernel.system.graphics()
  const vendor = graphics.controllers[0].vendor
  let setup
  if (platform === "darwin") {
    setup = [{
      method: "shell.run",
      params: { message: "brew install cmake protobuf rust python@3.10 git wget", },
      //params: { message: "brew install protobuf rust wget", },
    }, {
      method: "shell.run",
      params: { message: "git clone https://github.com/vladmandic/automatic automatic", path: path.resolve(__dirname) },
    }]
  } else {
    if (/amd/i.test(vendor)) {
      if (platform === 'win32') {
        setup = [{
          method: "shell.run",
      params: { message: "git clone https://github.com/vladmandic/automatic automatic", path: path.resolve(__dirname) },
        }]
      } else {
        setup = [{
          method: "shell.run",
      params: { message: "git clone https://github.com/vladmandic/automatic automatic", path: path.resolve(__dirname) },
        }]
      }
    } else {
      setup = [{
        method: "shell.run",
      params: { message: "git clone https://github.com/vladmandic/automatic automatic", path: path.resolve(__dirname) },
      }]
    }
  }

  let run = setup.concat([{
    "uri": "./index.js",
    "method": "config",
  }, {
    "method": "self.set",
    "params": {
      "automatic/ui-config.json": {
        "txt2img/Width/value": 1024,
        "txt2img/Height/value": 1024,
      }
    }
  }, {
    "method": "notify",
    "params": {
      "html": "<b>Downloading Model</b><br>Downloading the Stable Diffusion XL 1.0 model..."
    }
  }, {
    "method": "fs.download",
    "params": {
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors",
      "path": "automatic/models/Stable-diffusion/sd_xl_base_1.0.safetensors"
    }
  }, {
    "method": "fs.download",
    "params": {
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors",
      "path": "automatic/models/Stable-diffusion/sd_xl_refiner_1.0.safetensors"
    }
//  }, {
//    "method": "fs.download",
//    "params": {
//      //"url": "https://huggingface.co/madebyollin/sdxl-vae-fp16-fix/resolve/main/sdxl_vae.safetensors",
//      //"path": "automatic/models/Stable-diffusion/sd_xl_base_0.9.vae.safetensors"
//      "url": "https://huggingface.co/stabilityai/sdxl-vae/blob/main/sdxl_vae.safetensors",
//      "path": "automatic/models/Stable-diffusion/sd_xl_base_1.0.vae.safetensors"
//    }
  }, {
    "method": "notify",
    "params": {
      "html": "<b>Installing webui</b><br>All SDXL 1.0 models downloaded successfully. Now setting up Automatic/stable-diffusion-webui..."
    }
  }, {
    "method": "shell.start",
    "params": {
      "path": "automatic",
      "env": {
        "HF_HOME": "../huggingface"
      },
    }
  }, {
    "method": "shell.enter",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'webui.bat' : 'bash webui.sh -f'}}",
      "on": [{
        "event": "/(http:\/\/[0-9.:]+)/",
        "return": "{{event.matches[0][1]}}"
      }]
    }
  }, {
    "method": "local.set",
    "params": {
      "url": "{{input}}"
    }
  }, {
    "method": "input",
    "params": {
      "title": "Install Success",
      "description": "Go back to the dashboard and launch the app!"
    }
  }, {
    "method": "browser.open",
    "params": {
      "uri": "/?selected=Stable Diffusion web UI"
    }
  }])
  return { run }
}
