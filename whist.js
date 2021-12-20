
let resizeTimeout;

const activateSplit = () => {
  Split(['#jitsi', '#whisthub'], {
    gutterSize: 5,
    sizes: [23,77]
  });

  $('.gutter').mousemove(event => {
    if (event.buttons) {// button down
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(resized, 500);
    }
  });
}

const resized = () => {
  // not needed
}

let jitsiApi;
const setJitsi = (roomName) => {
  jitsiRoom = roomName;
  if (jitsiApi) {
    jitsiApi.dispose();
  }
  jitsiApi = new JitsiMeetExternalAPI('meet.jit.si', {
    roomName: roomName,
//    width: '300px',
    parentNode: document.getElementById('jitsi'),
    configOverwrite: {
      maxFullResolutionParticipants: -1,
      disableTileEnlargement: true,
      disableResponsiveTiles: true,
      filmStripOnly: true,
      enableWelcomePage: false,
      defaultLanguage: 'nl',
      prejoinConfig: {
        enabled: false,
      }
/*
      constraints: {
            video: {
                height: {
                    ideal: 400,
                    max: 400,
                    min: 240
                }
            }
        },
*/
    },
    interfaceConfigOverwrite: {
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_JITSI_WATERMARK: false,
      DISABLE_TRANSCRIPTION_SUBTITLES: true,
      DISABLE_PRESENCE_STATUS: true,
      VERTICAL_FILMSTRIP: false,
      TILE_VIEW_MAX_COLUMNS: 2,
      VIDEO_LAYOUT_FIT: 'width',
      // TOOLBAR_BUTTONS: []
    },
  });

  let startTime = new Date().getTime();
  jitsiApi.addEventListener('tileViewChanged', ({enabled}) => {
    if (new Date().getTime() - startTime < 5000) { // is het minder dan 5 seconden na opstarten, blijf proberen om de tileView aan te zetten.
      if (!enabled) {
        jitsiApi.executeCommand('toggleTileView');
      }
    }
    console.error(`************** tile view: ${enabled}`);
  });

  jitsiApi.executeCommand('toggleTileView');
}

const setBody = (url) => {
  if (!url.startsWith('http')){
    url = 'https://' + url;
    setHeaderValues(jitsiRoom, url);
  }
  bodyUrl = url;
  $('#whisthub').empty();
  $('#whisthub').append(`<iframe src="${url}" width="100%" height="100%"></iframe>`);
}

function setHeaderValues(room, url) {
  $('#jitsiRoom').val(room);
  $('#bodyUrl').val(url);
}

let db;
const initFirestore = () => {
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCnsvr5_pPhC_a5GExojaX-RgrgJhggPVw",
    authDomain: "whiteboard-30d51.firebaseapp.com",
    databaseURL: "https://whiteboard-30d51.firebaseio.com",
    projectId: "whiteboard-30d51",
    storageBucket: "whiteboard-30d51.appspot.com",
    messagingSenderId: "1042613440610",
    appId: "1:1042613440610:web:174ae683d48a6ccdd8813b"
  };
// Initialize Firebase
  const project = firebase.initializeApp(firebaseConfig);
  db = project.firestore();

  // load settings
  const whistSettings = db.collection("settings").doc('whist');

  db.collection("settings")
    .doc("whist")
    .onSnapshot(function(doc) {
      const data = doc.data();
      if (jitsiRoom !== data.jitsiRoom) {
        jitsiRoom = data.jitsiRoom;
        setJitsi(jitsiRoom);
      }
      if (bodyUrl !== data.url) {
        bodyUrl = data.url;
        setBody(bodyUrl);
      }
      setHeaderValues(jitsiRoom, bodyUrl);
    });
}

const saveSettings = () => {
  db.collection("settings")
    .doc("whist")
    .set({
      jitsiRoom,
      url: bodyUrl,
    })
}

let jitsiRoom;
let bodyUrl;
activateSplit();
// setJitsi(jitsiRoom);
// setBody(bodyUrl);
initFirestore();
