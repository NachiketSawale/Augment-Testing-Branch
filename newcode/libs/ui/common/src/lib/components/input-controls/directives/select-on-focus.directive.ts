/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Directive, ElementRef, HostListener } from '@angular/core';
/**
 * This component selects element when focused
 */
@Directive({
	selector: '[uiCommonSelectOnFocus]',
})
export class SelectOnFocusDirective {
	public constructor(private el: ElementRef) {}

	@HostListener('focus', ['$event'])
	/**
	 * This function calls focus and select function on native element  when focus event occurs
	 */
	private onFocus(): void {
		this.el.nativeElement.focus();
		this.el.nativeElement.select();
	}

	/**
	 * This lifecycle hook is called before component is destroyed
	 */
	public ngOnDestroy(): void {
		this.el.nativeElement.blur();
	}
}

