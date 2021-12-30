import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-video-switch',
  templateUrl: './video-switch.component.html',
  styleUrls: ['./video-switch.component.scss']
})
export class VideoSwitchComponent implements OnInit {

  @Input() selected?: string;
  @Output() selectOff = new EventEmitter<void>();
  @Output() selectJitsi = new EventEmitter<void>();
  @Output() selectAgora = new EventEmitter<void>();
  @Output() gotoOldSite = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
