import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() message: string; // @ Input added to make it setable from outside - set from the auth componenet.html using [message]="error"
  @Output() close = new EventEmitter<void>(); // event can be listened to from outside - emitting the modal closed event --> simply saying that an event has occured on clos press
  // we bind to close in the auth .html (close)="event()", making event() call from the auth.ts file when a close event is triggered!
  onClose() {
    this.close.emit();
  }
}
