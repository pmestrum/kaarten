import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedVideoChat: 'agora' | 'jitsi' = 'agora';

  constructor() {
  }

  ngOnInit() {
  }

  selectJitsi() {
    this.selectedVideoChat = 'jitsi';
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
}
