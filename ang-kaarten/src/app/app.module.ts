import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { VideoSwitchComponent } from './video-switch/video-switch.component';
import { AgoraVideoChatComponent } from './agora-video-chat/agora-video-chat.component';
import { JitsiVideoChatComponent } from './jitsi-video-chat/jitsi-video-chat.component';
import { WhistHubComponent } from './whist-hub/whist-hub.component';
import { AgoraButtonsComponent } from './agora-video-chat/agora-buttons/agora-buttons.component';
import { ParticipantComponent } from './agora-video-chat/participant/participant.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    VideoSwitchComponent,
    AgoraVideoChatComponent,
    JitsiVideoChatComponent,
    WhistHubComponent,
    AgoraButtonsComponent,
    ParticipantComponent
  ],
  imports: [
    BrowserModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
