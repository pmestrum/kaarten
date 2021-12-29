import { Component, Input, OnInit } from '@angular/core';
import { Stream, StreamEvent } from 'ngx-agora';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {

  @Input() stream!: Stream;
  @Input() isMuted!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
