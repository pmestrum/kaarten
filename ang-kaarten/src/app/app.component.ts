import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedVideoChat: 'agora' | 'jitsi' | 'off' = 'agora';

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initHangUpTimeout();
  }

  selectJitsi() {
    this.selectedVideoChat = 'jitsi';
  }

  selectOff() {
    this.selectedVideoChat = 'off';
  }

  selectAgora() {
    this.selectedVideoChat = 'agora';
  }

  gotoOldSite() {
    debugger;
    const currentUrl = window.document.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    const oldSiteUrl = baseUrl + 'oldsite/index.html';
    window.document.location.href = oldSiteUrl;
  }

  private initHangUpTimeout() {
    setTimeout(() => {
      this.selectedVideoChat = 'off';
      alert('Videochat afgezet om kosten te besparen');
      this.cd.markForCheck();
    }, 5 * 60 * 60 * 1000); // 5 hours
  }

}
