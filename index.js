const injectSpeedControls = document.getElementById('speed-injector');
injectSpeedControls.addEventListener('click', injectSpeed);

const injectRepeaterButton = document.getElementById('repeat-injector');
injectRepeaterButton.addEventListener('click', injectRepeater);



async function injectSpeed() {
  const tabs = await chrome.tabs.query({ 
    active: true, 
    currentWindow: true, 
    status: 'complete',
    windowType: 'normal',
  });

  let fc;
  tabs.forEach(t => {
    if (/youtube/.test(t.url)) {
      fc = t;
    }
  });
  
  if(!fc) {
    console.log('did not find youtube chrome tab!!', tabs);
    return;
  }

  if (fc) {
    await chrome.scripting.executeScript({
      target: { tabId: fc.id },
      func: () => {
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="modal" id="modal">
            <div class="speeds"><button id="setup">Setup</button></div>

            <div id="controls" class="controls hide">
              <div class="speeds">
                <button id="spd-1">1</button>
                <button id="spd-2">2</button>
                <button id="spd-3">3</button>
                <button id="spd-4">4</button>
                <button id="spd-5">5</button>
                <button id="spd-6">6</button>
              </div>
              <div class="speeds">
                <p> 
                  <input type="number" id="spd-in">
                  <button id="spd-apply">Apply</button>
                </p>
              </div>
            </div>
            <div class="speeds">
              <div class="dragger" id="dragger">Dragger</div>
            </div>
          </div>
        `;


        const style = document.createElement('style');
        style.innerHTML =`
          .modal {
            border: 1px solid salmon;
            border-radius: 5px;
            position: absolute;
            padding: 5px;
            width: 250px;
            background-color: rgba(237, 20, 61, 0.5);
            top: 90px;
          }
          .speeds {
            display: flex;
            flex-direction: row;
            text-align: center;
            justify-content: center;
            margin: 5px;
          }
          .dragger {
            border: 1px solid salmon;
            border-radius: 5px;
            background-color: antiquewhite;
            width: 60px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin: 5px;
            cursor: grab;
          }
          .hide {
            display: none;
          }
        `;

        const body = document.getElementsByTagName('body')[0];

        body.appendChild(div);
        body.appendChild(style);

        const modal = document.getElementById('modal');
        const dragger = document.getElementById('dragger');
        const controls = document.getElementById('controls');
        const speedInput = document.getElementById('spd-in');
        const speedAply = document.getElementById('spd-apply');
        const setupButton = document.getElementById('setup');
          
        let clientX;
        let clientY;
        let dragging = false;

        let vid;
    
        dragger.onpointerdown = (e) => {
          e.preventDefault();
          clientX = e.clientX;
          clientY = e.clientY;
          dragging = true;
        };
        dragger.onpointermove = (e) => {
          e.preventDefault();
          if (dragging) {
            const deltax = clientX - e.clientX;
            const deltay = clientY - e.clientY;
            clientX = e.clientX;
            clientY = e.clientY;
            modal.style.top = (modal.offsetTop - deltay) + 'px';
            modal.style.left = (modal.offsetLeft - deltax) + 'px';
          }
        };
        dragger.onpointerup = (e) => {
          e.preventDefault();
          dragging = false;
        };
    
        function setup() {
          vid = document.getElementsByClassName('video-stream html5-main-video')[0];
          if (vid) {
            controls.classList.remove('hide');
            setupButton.classList.add('hide');
          }
        }
        setupButton.onclick = setup;

        speedAply.onclick = () => {
          if (vid && vid.playbackRate !== parseFloat(speedInput.value)) {
            vid.playbackRate = parseFloat(speedInput.value);
          }
        }
        for( let i = 1; i <=6; i++) {
          document.getElementById(`spd-${i}`).onclick = () => {
            if (vid && vid.playbackRate !== i) {
              vid.playbackRate = i;
            }
          };
        }
      },
      // files: ['contentScript.js'],  // To call external file instead
    })
  }
}

async function injectRepeater() {
  const tabs = await chrome.tabs.query({ 
    active: true, 
    currentWindow: true, 
    status: 'complete',
    windowType: 'normal',
    // audible: true,
  });

  let fc;
  tabs.forEach(t => {
    if (/youtube/.test(t.url)) {
      fc = t;
    }
  });

  if(!fc) {
    console.log('did not find youtube chrome tab!!', tabs);
    return;
  }

  if (fc) {
    await chrome.scripting.executeScript({
      target: { tabId: fc.id },
      func: () => {
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="modal" id="modal">
            <div class="speeds"><button id="setup">Setup</button></div>

            <div id="controls" class="controls hide">
              <div class="speeds"><button id="active">Start Repeating</button></div>
              <div class="speeds">Start: <input type="range" id="start-time" step="0.01" min="0" value="0" oninput="document.getElementById('start-value').innerText = this.value"> <span id="start-value"></span></div>
              <div class="speeds">End: <input type="range" id="end-time" step="0.01" min="0" oninput="document.getElementById('end-value').innerText = this.value"> <span id="end-value"></span></div>
              <div class="speeds">Speed: <input type="range" id="speed" value="1" step="0.05" min="0.25" max="3" oninput="document.getElementById('speed-value').innerText = this.value"> <span id="speed-value"></span></div>
            </div>
            <div class="speeds">
              <div class="dragger" id="dragger">Dragger</div>
            </div>
          </div>
        `;


        const style = document.createElement('style');
        style.innerHTML =`
          .modal {
            border: 1px solid salmon;
            border-radius: 5px;
            position: absolute;
            padding: 5px;
            width: 250px;
            background-color: rgba(237, 20, 61, 0.5);
            top: 90px;
          }
          .speeds {
            display: flex;
            flex-direction: row;
            text-align: center;
            justify-content: center;
            margin: 5px;
            color: white;
          }
          .dragger {
            border: 1px solid salmon;
            border-radius: 5px;
            background-color: antiquewhite;
            width: 60px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin: 5px;
            cursor: grab;
            color: black;
          }
          .hide {
            display: none;
          }
        `;

        const body = document.getElementsByTagName('body')[0];

        body.appendChild(div);
        body.appendChild(style);

        const modal = document.getElementById('modal');
        const dragger = document.getElementById('dragger');
        const controls = document.getElementById('controls');
        const startRange = document.getElementById('start-time');
        const endRange = document.getElementById('end-time');
        const speed = document.getElementById('speed');
        const setupButton = document.getElementById('setup');
        const repeatingButton = document.getElementById('active');
          
        let clientX;
        let clientY;
        let dragging = false;
    
        let vid;
        let duration;
        let repeatingOn = false;

        repeatingButton.onclick = () => {
          repeatingOn = !repeatingOn;
          if (repeatingOn) {
            repeatingButton.innerText = 'Stop Repeating';
          } else {
            repeatingButton.innerText = 'Start Repeating';
          }
        };
    
        dragger.onpointerdown = (e) => {
          e.preventDefault();
          clientX = e.clientX;
          clientY = e.clientY;
          dragging = true;
        };
        dragger.onpointermove = (e) => {
          e.preventDefault();
          if (dragging) {
            const deltax = clientX - e.clientX;
            const deltay = clientY - e.clientY;
            clientX = e.clientX;
            clientY = e.clientY;
            modal.style.top = (modal.offsetTop - deltay) + 'px';
            modal.style.left = (modal.offsetLeft - deltax) + 'px';
          }
        };
        dragger.onpointerup = (e) => {
          e.preventDefault();
          dragging = false;
        };
    
        function setup() {
          vid = document.getElementsByClassName('video-stream html5-main-video')[0];
          if (vid) {
            duration = vid.duration;
            controls.classList.remove('hide');
            startRange.max = duration;
            endRange.max = duration;
            endRange.value = duration;
            vid.addEventListener('timeupdate',  ontimeupdate);
            setupButton.classList.add('hide');
          }
        }
        setupButton.onclick = setup;
    
        function ontimeupdate() {
          if (!repeatingOn) { return; }

          if ( vid.currentTime >= parseFloat(endRange.value) ) {
            vid.pause();
            vid.currentTime = parseFloat(startRange.value);
            vid.play();
          }

          if (vid.playbackRate !== parseFloat(speed.value)) {
            vid.playbackRate = parseFloat(speed.value);
          }
        }

        console.log('repeater ran');
      },
      // files: ['contentScript.js'],  // To call external file instead
    })
  }

}
