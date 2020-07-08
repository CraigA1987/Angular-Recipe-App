import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
  })
  export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
      this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
      // IF the element which was clicked contains the event target (the element the user clicks), toggle to open otherwise false. Runs on any element this directive sits on
    }
    constructor(private elRef: ElementRef) {}
  }