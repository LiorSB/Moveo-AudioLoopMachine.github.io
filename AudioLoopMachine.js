var audioFiles = [];
var audioControls = [];
var mainAudioSliderLine;
var mainAudioSliderSquare;
var isDraggedLine = false;
var isDraggedSquare = false;

function startup() {
    audioFiles[0] = "Loop%20files/_tambourine_shake_higher.mp3";
    audioFiles[1] = "Loop%20files/ALL%20TRACK.mp3";
    audioFiles[2] = "Loop%20files/B%20VOC.mp3";
    audioFiles[3] = "Loop%20files/DRUMS.mp3";
    audioFiles[4] = "Loop%20files/HE%20HE%20VOC.mp3";
    audioFiles[5] = "Loop%20files/HIGH%20VOC.mp3";
    audioFiles[6] = "Loop%20files/JIBRISH.mp3";
    audioFiles[7] = "Loop%20files/LEAD%201.mp3";
    audioFiles[8] = "Loop%20files/UUHO%20VOC.mp3";

    let randomColors = getRandomColorArrayWithOpacity(audioFiles.length, 0.7);

    buildAudioDiv(randomColors);

    // Setting for each audioControl the audio, audio slider, volume slider, timer and adding eventhandlers.
    for (let i = 0; i < audioFiles.length; i++) {
        let audioControl = {};

        audioControl.audio = new Audio(audioFiles[i]);
        audioControl.audioSlider = document.getElementById("audioSlider" + i);
        audioControl.volumeSlider = document.getElementById("volumeSlider" + i);
        audioControl.isDragged = false;
        audioControl.currentTimeSpan = document.getElementById("currentTimeSpan" + i);
        audioControl.totalTimeSpan = document.getElementById("totalTimeSpan" + i);

        audioControl.volumeSlider.addEventListener("mousemove", function () { setvolume(i); });

        audioControl.audio.addEventListener("timeupdate", function () { audioTimeDisplay(i); });
        audioControl.audio.addEventListener("ended", function () { audioEnded(i); });

        audioControls.push(audioControl);
    }

    // Setting drag and drop for the audio slider, only the one slider is needed from the audio sliders.
    audioControls[0].audioSlider.addEventListener("mousedown", function (event) { audioControls[0].isDragged = true; dragAndDropAudioSlider(event, 0); });
    audioControls[0].audioSlider.addEventListener("mousemove", function (event) { dragAndDropAudioSlider(event, 0); });
    audioControls[0].audioSlider.addEventListener("mouseup", function () { isDragged = false; });

    // Setting the cursor which is on top of all channels
    mainAudioSliderLine = document.getElementById("mainAudioSliderLine");
    mainAudioSliderSquare = document.getElementById("mainAudioSliderSquare");

    mainAudioSliderLine.style.backgroundColor = "#" + randomColors[0];
    mainAudioSliderSquare.style.backgroundColor = "#" + randomColors[0];

    mainAudioSliderLine.addEventListener("mousedown", function (event) { isDraggedLine = true; dragAndDropAudioSlider(event); });
    mainAudioSliderLine.addEventListener("mousemove", function (event) { dragAndDropAudioSlider(event); });
    mainAudioSliderLine.addEventListener("mouseup", function () { isDraggedLine = false; });

    mainAudioSliderSquare.addEventListener("mousedown", function (event) { isDraggedSquare = true; dragAndDropAudioSlider(event); });
    mainAudioSliderSquare.addEventListener("mousemove", function (event) { dragAndDropAudioSlider(event); });
    mainAudioSliderSquare.addEventListener("mouseup", function () { isDraggedSquare = false; });
}

function getRandomColorArrayWithOpacity(numberOfColors, opacity) {
    let randomColors = [];
    opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);

    // Generates a unique random color for each row in hex.
    for (let i = 0; i < numberOfColors; i++) {
        randomColors[i] = Math.floor(Math.random() * 16777215).toString(16);

        for (let j = 0; j < i; j++) {
            if (randomColors[i] == randomColors[j]) {
                randomColors[i] = Math.floor(Math.random() * 16777215).toString(16);
                i = -1;
                contine;
            }
        }
    }

    for (let i = 0; i < numberOfColors; i++) {
        randomColors[i] += opacity.toString(16).toUpperCase();
    }

    return randomColors;
}

function buildAudioDiv(audioDivBackgroundColors) {
    for (let i = 0; i < audioDivBackgroundColors.length; i++) {
        document.getElementById("audioDivMain").innerHTML +=
            `<div class="flex-item" id="audioDiv${i}" style="background-color:#${audioDivBackgroundColors[i]}">
                <div class="grid-container">
                    <label class="muteToggleLabel">
                      <input type="checkbox" id="muteCheckBox${i}" onclick="muteAudio(${i})">
                      <div class="muteToggleSpan">
                        <span class="muteOn">Muted✓</span>
                        <span class="muteOff">Muted✗</span>
                      </div>
                    </label>
                    <input type="range" id="volumeSlider${i}" min="0" max="100" value="100" step="1" style="width:100px">
                    <input type="range" id="audioSlider${i}" class="audioSlider" min="0" max="100" value="0" step="1" style="width:100px">
                    <div id="timebox">
                        <span id="currentTimeSpan${i}">00:00</span> / <span id="totalTimeSpan${i}">00:00</span>
                    </div>
                </div>
             </div>`;
    }
}

function dragAndDropAudioSlider(event) {
    if (!isDraggedLine && !isDraggedSquare) {
        return;
    }

    // Substracting the position of mouse by the left side of the slider to get the value for the sliders.
    if (isDraggedLine) {
        mainAudioSliderLine.value = event.clientX - mainAudioSliderLine.offsetLeft;
        mainAudioSliderSquare.value = mainAudioSliderLine.value;
    }

    if (isDraggedSquare) {
        mainAudioSliderSquare.value = event.clientX - mainAudioSliderSquare.offsetLeft;
        mainAudioSliderLine.value = mainAudioSliderSquare.value;
    }

    for (let i = 0; i < audioFiles.length; i++) {
        audioControls[i].audioSlider.value = mainAudioSliderLine.value;
        audioControls[i].audio.currentTime = audioControls[i].audio.duration * (audioControls[i].audioSlider.value / 100);
    }
}

function setvolume(i) {
    audioControls[i].audio.volume = audioControls[i].volumeSlider.value / 100;
}

function audioTimeDisplay(i) {
    // Multiplying the current time of the playing audio by 100 divided by the audio's total duration to get the sliders value.
    audioControls[i].audioSlider.value = audioControls[i].audio.currentTime * (100 / audioControls[i].audio.duration);
    mainAudioSliderLine.value = audioControls[i].audioSlider.value;
    mainAudioSliderSquare.value = mainAudioSliderLine.value;

    // Calculating the time to display on the timer box by seperating it to (currentTime:totalTime) -> (00:00)
    let currentMinutes = Math.floor(audioControls[i].audio.currentTime / 60);
    let currentSeconds = Math.floor(audioControls[i].audio.currentTime - currentMinutes * 60);
    let totalMinutes = Math.floor(audioControls[i].audio.duration / 60);
    let totalSeconds = Math.floor(audioControls[i].audio.duration - totalMinutes * 60);

    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }

    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }

    if (currentMinutes < 10) {
        currentMinutes = `0${currentMinutes}`;
    }

    if (totalMinutes < 10) {
        totalMinutes = `0${totalMinutes}`;
    }

    audioControls[i].currentTimeSpan.innerHTML = `${currentMinutes}:${currentSeconds}`;
    audioControls[i].totalTimeSpan.innerHTML = `${totalMinutes}:${totalSeconds}`;
}

function audioEnded(i) {
    // When the slider reaches the end and loop isn't activated the slider will return to 0, the time will reset and the music will stop.
    pauseAudio(i);
    audioControls[i].audio.currentTime = 0;
}

function pauseAndPlayAudio() {
    for (let i = 0; i < audioFiles.length; i++) {
        if (audioControls[i].audio.paused) {
            playAudio(i);
        }
        else {
            pauseAudio(i);
        }
    }
}

function playAudio(i) {
    let pauseAndPlayButton = document.getElementById("pauseAndPlayButton");
    audioControls[i].audio.play();
    pauseAndPlayButton.value = "Pause";
    pauseAndPlayButton.style.backgroundColor = "#a9a9a9";

}

function pauseAudio(i) {
    let pauseAndPlayButton = document.getElementById("pauseAndPlayButton");
    audioControls[i].audio.pause();
    pauseAndPlayButton.value = "Play";
    pauseAndPlayButton.style.backgroundColor = "#1e90ff";
}

function stopAudio() {
    // Pause all audio and set their time to 0 which will set the sliders back to 0.
    for (let i = 0; i < audioFiles.length; i++) {
        pauseAudio(i);
        audioControls[i].audio.currentTime = 0;
    }
}

function muteAudio(i) {
    audioControls[i].audio.muted = !audioControls[i].audio.muted;
}

function loopAudio() {
    for (let i = 0; i < audioFiles.length; i++) {
        audioControls[i].audio.loop = !audioControls[i].audio.loop;
    }
}