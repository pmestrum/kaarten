import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgoraButtonsComponent } from 'src/app/agora-video-chat/agora-buttons/agora-buttons.component';

describe('AgoraButtonsComponent', () => {
  let component: AgoraButtonsComponent;
  let fixture: ComponentFixture<AgoraButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgoraButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgoraButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
