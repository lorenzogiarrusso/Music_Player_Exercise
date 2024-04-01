const cards = document.querySelectorAll(".card-flip");
const prog_foot = document.querySelector(".progress-footer");
const prog_play_btn = prog_foot.querySelector(".play-btn");
const currentTimeDisplay = document.getElementById('currentTime');
const totalDurationDisplay = document.getElementById('totalDuration');
const progressSlider = document.getElementById('progressSlider');
const play_btns = document.querySelectorAll(".card-footer .play-btn");
const card_titles = document.querySelectorAll(".card-title");
let song_titles = new Array(card_titles.length);
for (let c = 0; c < card_titles.length; c++) {
    song_titles[c] = card_titles[c].innerHTML;
}
const audio = document.getElementById('musicPlayer');

let playing = false; //true if a song is currently playing
let current_song = -1; //index of currently playing/paused song; if -1, progress-footer is also hidden
let flipped = new Array(cards.length);
flipped = flipped.fill(false);

let song_uris = ["res/5m_silence.mp3", "res/1m_silence.mp3", "res/2m30s_silence.mp3",
    "res/5m_silence.mp3", "res/1m_silence.mp3", "res/2m30s_silence.mp3",
    "res/5m_silence.mp3", "res/1m_silence.mp3", "res/2m30s_silence.mp3",
    "res/5m_silence.mp3", "res/1m_silence.mp3", "res/2m30s_silence.mp3"];

//Function to flip the i-th song card; if reset=true, flips it to the "frontal" position no matter what
function flip_card(i, reset = false) {
    const front = cards[i].querySelector(".card-front");
    const back = cards[i].querySelector(".card-back");
    if (!flipped[i] && !reset) {
        front.style.transform = "rotateY(-180deg)";
        back.style.transform = "rotateY(0deg)";
        flipped[i] = true;
    }
    else {
        front.style.transform = "rotateY(0deg)";
        back.style.transform = "rotateY(180deg)";
        flipped[i] = false;
    }
}

//Function to handle clicks on play buttons; changes play/pause icons accordingly and plays/pauses the audio player
function on_playbtn_click(i) {
    if (current_song === -1 || current_song !== i) {

        if (current_song !== -1) {
            //Reset current song's play button to Play, pause current song
            play_btns[current_song].innerHTML = "<i class=\"bi bi-play-fill\"></i> Play";
            audio.pause();
        }

        prog_foot.style.display = "block"
        play_btns[i].innerHTML = "<i class=\"bi bi-pause\"></i> Pause";
        prog_play_btn.innerHTML = "<i class=\"bi bi-pause\"></i>";
        prog_foot.querySelector(".playing-title").innerHTML = song_titles[i];
        audio.setAttribute("src", song_uris[i]);
        audio.play();
        playing = true;
    }
    else {
        //Either pause or unpause current song
        if (playing) {
            play_btns[i].innerHTML = "<i class=\"bi bi-play-fill\"></i> Play";
            prog_play_btn.innerHTML = "<i class=\"bi bi-play-fill\"></i>";
            audio.pause();
            playing = false;
        }
        else {
            play_btns[i].innerHTML = "<i class=\"bi bi-pause\"></i> Pause";
            prog_play_btn.innerHTML = "<i class=\"bi bi-pause\"></i>";
            audio.play();
            playing = true;
        }
    }
    current_song = i;
}

// Format time to display as minutes:seconds
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Display total duration once the audio metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.textContent = formatTime(audio.duration);
});

// Update current time and progress bar as the audio plays
audio.addEventListener('timeupdate', function () {
    const percentage = (this.currentTime / this.duration) * 100;
    progressSlider.value = percentage;
    currentTimeDisplay.textContent = formatTime(this.currentTime);
});

// Update the current time when the user seeks
progressSlider.addEventListener('input', function () {
    const seekTime = (audio.duration / 100) * progressSlider.value;
    audio.currentTime = seekTime;
});

// Handle audio ending
audio.onended = function () {
    play_btns[current_song].innerHTML = "<i class=\"bi bi-pause\"></i> Pause";
    prog_play_btn.innerHTML = "<i class=\"bi bi-pause\"></i>";
    progressSlider.value = 0;
    currentTimeDisplay.textContent = formatTime(0);
    playing = false;
};


for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => { flip_card(i) });
    cards[i].addEventListener("mouseleave", () => { flip_card(i, true) });
    play_btns[i].addEventListener("click", () => { on_playbtn_click(i); flip_card(i) });
}

prog_play_btn.addEventListener("click", () => { on_playbtn_click(current_song) });
