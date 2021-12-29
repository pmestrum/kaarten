import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
  selector: 'app-agora-video-chat',
  templateUrl: './agora-video-chat.component.html',
  styleUrls: ['./agora-video-chat.component.scss']
})
export class AgoraVideoChatComponent implements OnInit, OnDestroy {

  localCallId = 'agora_local';
  remoteStreams: {[key: string]: Stream} = {};
  muteStates: {[key: string]: boolean} = {}
  localStream!: Stream;

  get remoteCalls() {
    return Object.keys(this.remoteStreams);
  }

  private client!: AgoraClient;
  private uid: number;

  constructor(private ngxAgoraService: NgxAgoraService, private cd: ChangeDetectorRef) {
    this.uid = Math.floor(Math.random() * 100);
  }

  ngOnInit(): void {
    this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();

    this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.assignLocalStreamHandlers();
    // Join and publish methods added in this step
    this.initLocalStream(() => this.join(uid => this.publish(), error => {
      debugger;
      console.error(error);
    }));
  }

  ngOnDestroy() {
    // unsubscribe from remote streams
    Object.values(this.remoteStreams).forEach(stream => {
      this.client.unsubscribe(stream, error => {
        console.error('Unable to unsubscribe from remote stream');
      });
    });

    // leave channel
    this.client?.leave(() => {
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null, 'kaarten', this.uid, onSuccess, onFailure);
    // this.client.join('006c90c804cfaf14c519fbf7f094808f7d6IABWv9f7O/dxB1LJlhK6N9+i8acTr04R1rjXE6r0iYlUj0U+aVMAAAAAEACu7KwLbZLMYQEAAQBtksxh', 'kaarten', this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, err => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      // @ts-ignore
      stream['callId'] = id;
      this.remoteStreams[id] = stream;
      setTimeout(() => stream.play(id), 1000);
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        const id = this.getRemoteId(stream);
        delete this.remoteStreams[id];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        const id = this.getRemoteId(stream);
        delete this.remoteStreams[id];
        console.log(`${evt.uid} left from this channel`);
      }
    });

    this.client.on(ClientEvent.RemoteAudioMuted, evt => {
      this.muteStates = {
        ...this.muteStates,
        [this.getRemoteId(evt.uid)]: true,
      };
      this.cd.markForCheck();
    });
    this.client.on(ClientEvent.RemoteAudioUnmuted, evt => {
      this.muteStates = {
        ...this.muteStates,
        [this.getRemoteId(evt.uid)]: false,
      };
      this.cd.markForCheck();
    });

    this.client.on(ClientEvent.RemoteAudioUnmuted, evt => {
      this.cd.markForCheck();
    });
   }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      err => console.error('getUserMedia failed', err)
    );
  }

  private getRemoteId(stream: Stream | number): string {
    if (typeof stream === 'number') {
      return `agora_remote-${stream}`;
    } else {
      return `agora_remote-${stream.getId()}`;
    }
  }

  mute(mute: boolean) {
    this.muteStates = {
      ...this.muteStates,
      local: mute,
    }
    this.cd.markForCheck();

    if (mute) {
      this.localStream.muteAudio();
    } else {
      this.localStream.unmuteAudio();
    }
  }
}
