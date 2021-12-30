import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-video-chat',
  templateUrl: './jitsi-video-chat.component.html',
  styleUrls: ['./jitsi-video-chat.component.scss']
})
export class JitsiVideoChatComponent implements AfterViewInit, OnDestroy {

  @ViewChild('jitsiContainer') jitsiContainer!: ElementRef;

  private jitsiApi?: any;

  ngAfterViewInit() {
    this.initJitsi();
  }

  ngOnDestroy() {
    try {
      this.jitsiApi.dispose();
    } catch (e) {
      console.error(e);
    }
  }

  initJitsi() {
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
    }
    this.jitsiApi = new JitsiMeetExternalAPI('meet.jit.si', {
      roomName: 'kaartenmetonsvierkes',
//    width: '300px',
      //height: '100%',
      parentNode: this.jitsiContainer.nativeElement,
      configOverwrite: {
        // maxFullResolutionParticipants: -1,
        disableTileEnlargement: true, // zorgt voor geen grote video in tile
        disableResponsiveTiles: false,
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
        VERTICAL_FILMSTRIP: true,
        TILE_VIEW_MAX_COLUMNS: 1,
        VIDEO_LAYOUT_FIT: 'width',
        TOOLBAR_BUTTONS: ['tileview', 'microphone', 'hangup']
      },
    });

    let startTime = new Date().getTime();
    this.jitsiApi.addEventListener('tileViewChanged', ({ enabled }: {enabled: boolean}) => {
      if (new Date().getTime() - startTime < 5000) { // is het minder dan 5 seconden na opstarten, blijf proberen om de tileView aan te zetten.
        if (!enabled) {
          this.jitsiApi.executeCommand('toggleTileView');
        }
      }
      console.error(`************** tile view: ${enabled}`);
    });

    this.jitsiApi.executeCommand('toggleTileView');
  }
}
