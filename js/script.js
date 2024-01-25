let currentSong = new Audio();
let songs;
let currFolder;

function totalSecondsToMMSS(totalSeconds) {
  // Calculate the number of minutes without the decimal part
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
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

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
      //console.log(songs);
      // return 

    }
  }
    let songUL = document
      .querySelector(".songList")
      .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
      console.log(song);
      songUL.innerHTML =
        songUL.innerHTML +
        `<li><img class="invert" src="img/music.svg" alt="music svg">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div class="songName">Harry</div>
              </div>
              <div class="playNow">
                <span>PlayNow</span>
                <img class= "invert" src="img/play.svg" alt="">

              </div>
          </li>`;
    }

    //Attach AN Event Listener to each song
    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", (element) => {
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      });
    });
    return songs;

  }


const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")

  let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      //Get the metadata of each folder
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      //console.log(response);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
        <div class="play">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="injected-svg"
            data-src="/icons/play-stroke-sharp.svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            role="img"
            color="#000000"
          >
            <path
              d="M5 20V4L19 12L5 20Z"
              stroke="#000000"
              stroke-width="1.5"
              fill="#000"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
        <img
          src="/songs/${folder}/cover.jpg"
          alt=""
        />
        <h2>${response.title}</h2>
        <p>${response.description}</p>
      </div>`;
    }
  }
  //LOAD TE PLAYLIST WHEN THE CARD IS CLICKED
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    //console.log(e);
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}


async function main() {
  await getSongs("songs/ncs");
  playMusic(songs[0], true);
  //Show All The Song In The Playlists

  //Display all the albums
  displayAlbum();

  //Attach an event listener to play and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //Getting info of song

  currentSong.addEventListener("timeupdate", () => {
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
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous Clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) playMusic(songs[index - 1]);
  });
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next Clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) 
    playMusic(songs[index + 1]);
  });

  //Add event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      //console.log("Setting Volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });
    //event listener to mute
    document.querySelector(".volume > img").addEventListener("click",e=>{
      if(e.target.src.includes("img/volume.svg"))
      {
        e.target.src = e.target.src.replace("img/volume.svg" , "img/mute.svg") ;
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      }else{
        e.target.src = e.target.src.replace("img/mute.svg" , "img/volume.svg" ) ;
        currentSong.volume = .5;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 50

      }
    })

  
}

main();
