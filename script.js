
let songs = [];

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// const songFunction = async () => {
//   try {
//     let data = await fetch("./songs.json");
//     let response = await data.json();
//     songs = response.map((res) => {
//       return res.song;
//     });
//     console.log(songs);

//     const playMusic = (track, pause = false) => {
//       currentSong.src = "./AllSongs/animal/" + track;
//       if (!pause) {
//         currentSong.play();
//         play.src = "/images/pause.svg";
//       }
//       document.querySelector(".songInfo").innerHTML = decodeURI(track);
//       document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
//     };

//     playMusic(songs[0], true);

//     let songUL = document.querySelector(".songList ul");

//     for (const song of songs) {
//       const li = document.createElement("li");
//       li.innerHTML = `
//         <img class="invert" src="/images/music.svg" alt="">
//         <div class="info">
//             <div>${song.split("/AllSongs/animal")[1]}</div>
//             <div>Adarsh</div> <!-- You need to replace this with actual artist data -->
//         </div>
//         <div class="playNow">
//             <span>Play Now</span>
//             <img class="invert" src="/images/play.svg" alt="">
//         </div>
//     `;
//       songUL.appendChild(li);
//     }

//     Array.from(
//       document.querySelector(".songList").getElementsByTagName("li")
//     ).forEach((e) => {
//       e.addEventListener("click", (element) => {
//         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
//       });
//     });

//     play.addEventListener("click", () => {
//       if (currentSong.paused) {
//         currentSong.play();
//         play.src = "/images/pause.svg";
//       } else {
//         currentSong.pause();
//         play.src = "/images/play.svg";
//       }
//     });

//     //Add an event listener to previous button

//     previous.addEventListener("click", () => {
//       console.log("clicked prev");
//       currentSong.pause();
//       let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
//       if (index - 1 >= 0) {
//         playMusic(songs[index - 1].replace("./AllSongs/animal/", ""));
//       }
//     });

//     //Add an event listener to next button

//     next.addEventListener("click", () => {
//         currentSong.pause();
//         console.log("clicked next");
//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
//         if ((index + 1) < songs.length - 1) {
//             playMusic(songs[index + 1].replace('./AllSongs/animal/', ''));
//         }
//     });
// };

// songFunction();

let currentAudio = new Audio(); // To keep track of the currently playing audio

const playSong = (songFile) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio(songFile);
  audio.play();
  currentAudio = audio;

  //Listen from timeupdate event

  currentAudio.addEventListener("timeupdate", (a) => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentAudio.currentTime
    )}
       / ${secondsToMinutesSeconds(currentAudio.duration)}`;
    document.querySelector(".circle").style.left =
      (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
  });

  //Add an event listener to seekBar

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentAudio.currentTime = (currentAudio.duration * percent) / 100;
  });
};


const displayAlbumSongs = async (albumId) => {
  let albumsData = await fetch("./songs.json");
  let albums = await albumsData.json();

  let selectedAlbum = albums.find((album) => album.id === albumId);

  if (selectedAlbum) {
    let songs = selectedAlbum.song || [];
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    songs.forEach((song) => {
      let li = document.createElement("li");
      li.innerHTML = `
        <img class="invert" src="/images/music.svg" alt="">
        <div class="info">
          <div>${song.song_title}</div>
          <div>${selectedAlbum.title}</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="/images/play.svg" alt="">
        </div>
      `;

      let playNowButton = li.querySelector(".playNow");
      playNowButton.addEventListener("click", () => {
        playSong(song.song_file);
        play.src = "/images/pause.svg";
      });

      songUL.appendChild(li);
    });
  }
};

play.addEventListener("click", () => {
if (currentAudio.paused) {
currentAudio.play();
play.src = "/images/pause.svg";
} else {
currentAudio.pause();
play.src = "/images/play.svg";
}
});

let  currentSongIndex;

document.querySelector("#next").addEventListener("click", () => {
  console.log("clicked next")
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(songs[currentSongIndex].song_file);
  play.src = "/images/pause.svg";
});

document.querySelector("#previous").addEventListener("click", () => {
  console.log("clicked prev")
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(songs[currentSongIndex].song_file);
  play.src = "/images/pause.svg";
});



// Add an event listener to volume

document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    if (currentAudio) {
      currentAudio.volume = parseInt(e.target.value) / 100;
      if(currentAudio.volume > 0){
        document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace(
          "/images/mute.svg",
          "/images/volume.svg"
        );
      }
    }
  });

// Add event listener to mute the track

document.querySelector(".volume > img").addEventListener("click", (e) => {
  if (currentAudio) {
    if (e.target.src.includes("/images/volume.svg")) {
      e.target.src = e.target.src.replace(
        "/images/volume.svg",
        "/images/mute.svg"
      );
      currentAudio.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace(
        "/images/mute.svg",
        "/images/volume.svg"
      );
      currentAudio.volume = 0.1; // Set the default volume
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  }
});

// Set the initial volume
// if (currentAudio) {
//   currentAudio.volume = 0.1; // Set the default volume
// }

const displayCards = async () => {
  const albums = await fetch("./songs.json");
  const albumRes = await albums.json();
  console.log(albumRes);

  const cardContainer = document.querySelector(".cardContainer");

  albumRes.forEach((eachAlbum, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
          <div class="play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                      stroke-linejoin="round" />
              </svg>
          </div>
          <img src="${eachAlbum.image}" alt="">
          <h2 style="font-size: 20px">${eachAlbum.title}</h2>
          <p style="color: #909090">${eachAlbum.description}</p>
      `;
    card.addEventListener("click", () => {
      console.log(eachAlbum.id);
      displayAlbumSongs(eachAlbum.id);
    });
    cardContainer.appendChild(card);

    // Display songs of the first album by default
    if (index === 0) {
      displayAlbumSongs(eachAlbum.id);
    }
  });
};

displayCards();

//Add an event listener for hamburger

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

//Add an event listener for close button

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});
