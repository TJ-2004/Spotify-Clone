console.log("Lets Write Some Javascript");
let currentSong = new Audio();

function totalSecondsToMMSS(totalSeconds) {
  // Calculate the number of minutes without the decimal part
  var minutes = Math.floor(totalSeconds / 60);

  // Calculate the remaining seconds without the decimal part
  var seconds = Math.floor(totalSeconds % 60);

  // Use padStart to ensure two digits for minutes and seconds
  var minutesString = minutes.toString().padStart(2, "0");
  var secondsString = seconds.toString().padStart(2, "0");

  // Combine minutes and seconds in "mm:ss" format
  var formattedTime = minutesString + ":" + secondsString;

  return formattedTime;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);
  console.log(songs);
  //Show All The Song In The Playlists

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="music svg">
                <div class="info">
                  <div class="songInfo">${song.replaceAll("%20", " ")}</div>
                  <div class="songName">Harry</div>
                </div>
                <div class="playNow">
                  <span>PlayNow</span>
                  <img class= "invert" src="play.svg" alt="">

                </div>
            </li>`;
  }

  //Attach AN Event Listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //Attach an event listener to play and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //Getting info of song

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${totalSecondsToMMSS(
      currentSong.currentTime
    )} / ${totalSecondsToMMSS(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add Event Listener to prev and next
}

main();
