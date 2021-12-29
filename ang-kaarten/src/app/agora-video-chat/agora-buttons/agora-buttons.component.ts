import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-agora-buttons',
  templateUrl: './agora-buttons.component.html',
  styleUrls: ['./agora-buttons.component.scss']
})
export class AgoraButtonsComponent implements OnInit {

  volumeUp = faVolumeUp;
  volumeMute = faVolumeMute;

  @Input() isMuted = false;
  @Output() mute = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
