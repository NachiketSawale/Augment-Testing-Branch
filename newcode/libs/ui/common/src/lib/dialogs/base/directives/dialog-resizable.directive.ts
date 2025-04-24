/*
 * Copyright(c) RIB Software GmbH
 */

import { fromEvent, Subscription, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directive, ElementRef, Inject, Optional } from '@angular/core';

import { IDialogData } from '../model/interfaces/dialog-data-interface';

/**
 * Directive implements the modal dialog resizing operation.
 */
@Directive({
	selector: '[uiCommonDialogResizable]',
})
export class DialogResizableDirective<TValue, TBody, TDetailsBody> {
	/**
	 * New dialog width.
	 */
	private newWidth: number = 0;

	/**
	 * New dialog height.
	 */
	private newHeight: number = 0;

	/**
	 * Dialog minimum width.
	 */
	private minWidth: number = 0;

	/**
	 * Maximum dialog width.
	 */
	private maxWidth: number = 0;

	/**
	 * Minimum dialog height.
	 */
	private minHeight: number = 0;

	/**
	 * Maximum dialog height.
	 */
	private maxHeight: number = 0;

	/**
	 * Is dialog resizable.
	 */
	private isResizable = false;

	/**
	 * Resize point element.
	 */
	private element: HTMLElement;

	/**
	 * Mouse event subscriptions.
	 */
	private subscription: Subscription[] = [];

	/**
	 * Resize element to be added to footer South-east corner.
	 */
	private resizeElement = `<div 
		class="ui-resizable-handle 
		ui-resizable-se 
		ui-icon 
		ui-icon-gripsmall-diagonal-se" 
		style="z-index: 90;">
	</div>`;

	public constructor(element: ElementRef, @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData<TValue, TBody, TDetailsBody>) {
		this.element = element.nativeElement;
	}

	public ngAfterViewInit() {
		this.initResize();
	}

	/**
	 * This function gets the limits for dimensions after which resizing is restricted.
	 */
	private initResize() {
		this.minWidth = parseFloat(<string>this.data.dialog.modalOptions.minWidth);
		this.maxWidth = <number>this.dialogMaxWidth();
		this.minHeight = parseFloat(this.dialogMinHeight());
		this.maxHeight = <number>this.dialogMaxHeight();
		this.isResizable = <boolean>this.data.dialog.modalOptions.resizeable;
		if (this.isResizable) {
			const element = document.getElementsByTagName('footer');
			element[0].insertAdjacentHTML('beforeend', this.resizeElement);
			const resizeHandle = <HTMLElement>this.element.querySelector('.ui-resizable-handle');

			const mouseDown = fromEvent<MouseEvent>(resizeHandle, 'mousedown');
			const mouseDownSub = mouseDown.subscribe((event: MouseEvent) => {
				this.onMousedown(event);
			});

			this.subscription.push(mouseDownSub);
		}
	}

	/**
	 * This Function gets executed when mouse clickevent occurs which then initialize the resize variables
	 * and subscribes to the mouseup and mousemove events for resize operations.
	 *
	 * @param { MouseEvent } event Mouse down event.
	 */
	private onMousedown(event: MouseEvent) {
		const width = this.element.clientWidth;
		const height = this.element.clientHeight;
		this.newWidth = this.element.clientWidth;
		this.newHeight = this.element.clientHeight;

		const mouseup = fromEvent<MouseEvent>(document, 'mouseup');

		const mouseMoveSub = fromEvent<MouseEvent>(document, 'mousemove')
			.pipe(takeUntil(mouseup))
			.subscribe({
				next: (e) => {
					this.move(e as MouseEvent, width, height, event.screenX, event.screenY);
				},
			});

		this.subscription.push(mouseMoveSub);
	}

	/**
	 * This function gets called when mouse is down and moved which calculates the movement in x and y
	 * directions and resizes the width and height accordingly.
	 *
	 * @param { MouseEvent}  event Mouse event.
	 * @param { number } width Dialog width.
	 * @param { number } height Dialog height.
	 * @param { number } screenX
	 * @param { number } screenY
	 */
	private move(event: MouseEvent, width: number, height: number, screenX: number, screenY: number) {
		const movementX = event.screenX - screenX;
		const movementY = event.screenY - screenY;
		this.newWidth = width + movementX;
		this.newHeight = height + movementY;
		this.resizeWidth();
		this.resizeHeight();
	}

	/**
	 * This function resizes the width of dialog.
	 *
	 */
	private resizeWidth() {
		const overMinWidth = this.newWidth >= this.minWidth;
		const underMaxWidth = this.newWidth <= this.maxWidth;
		if (overMinWidth && underMaxWidth) {
			const element = <HTMLElement>document.getElementsByClassName('cdk-overlay-pane')[0];
			element.style.width = `${this.newWidth}px`;
		}
	}

	/**
	 * This function resizes the height of dialog.
	 *
	 */
	private resizeHeight() {
		const overMinHeight = this.newHeight >= this.minHeight;
		const underMaxHeight = this.newHeight <= this.maxHeight;
		if (overMinHeight && underMaxHeight) {
			this.calcBodyHeight();
		}
	}

	/**
	 * This function is called when dialog is resized in vertical direction to adjust only body height.
	 */
	private calcBodyHeight() {
        const diffHeight = (this.element.querySelector('.modal-header') as HTMLElement).offsetHeight + (this.element.querySelector('.modal-footer') as HTMLElement).offsetHeight;
        const contentHeight = this.newHeight - diffHeight;
        (this.element.querySelector('.modal-body') as HTMLElement).style.minHeight = contentHeight + 'px';
    }

	/**
	 * This function unsubscribes the subscriptions done to avoid leaks.
	 */
	private destroySubscription() {
		this.subscription.forEach((s) => s.unsubscribe());
	}

	/**
	 * This function returns max height to resize.
	 *
	 * @returns { number} max-height.
	 */
	private dialogMaxHeight(): number {
		return window.innerHeight * 0.9;
	}

	/**
	 * This function returns max width to resize.
	 *
	 * @returns { number} max-width
	 */
	private dialogMaxWidth(): number {
		return window.innerWidth * 0.9;
	}

	/**
	 * This function returns min height to resize.
	 *
	 * @returns {string} min-height.
	 */
	private dialogMinHeight(): string {
		if (this.data.dialog.modalOptions.minHeight) {
			return this.data.dialog.modalOptions.minHeight;
		} else {
			return '400px';
		}
	}

	public ngOnDestroy() {
		this.destroySubscription();
	}
}