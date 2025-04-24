/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * This is responsible for rendering images with a carousel
 */
@Component({
	selector: 'ui-common-image-view',
	templateUrl: './image-view.component.html',
	styleUrls: ['./image-view.component.scss'],
	animations: [],
})
export class ImageViewComponent {
	/**
	 * Represent carousel indicators
	 */
	public showIndicators = true;

	/**
	 * Represent the selected index on carousel
	 */
	@Input() public selectedIndex = 0;

	/**
	 * Represent the next and previous button carousel control
	 */
	public showNavigationButtons = true;

	/**
	 * Represent the multiple image show or not
	 */
	@Input() public isMultiple!: boolean;

	/**
	 * Represent the image src base64 url array
	 */

	//TODO: the type of item will change in future

	@Input() public items!: string[];

	/**
	 * Represent the image src base64 url
	 */

	//TODO: the type of item will change in future
	@Input() public itemSrc!: string;

	/**
	 * Represent the current index observable
	 */

	@Output() public selectedIndexChanged = new EventEmitter<number>();

	/**
	 * This function used for select image on carousal
	 *
	 * @param {number} index image index
	 */
	public selectImage(index: number): void {
		this.selectedIndex = index;
		this.selectedIndexChanged.emit(index);
	}

	/**
	 * This function used for onPrevious event on carousal
	 */
	public onPrevious(): void {
		if (this.selectedIndex === 0) {
			this.selectedIndex = this.items.length - 1;
		} else {
			this.selectedIndex--;
		}
		this.selectedIndexChanged.emit(this.selectedIndex);
	}

	/**
	 * This function used for onNext event on carousal
	 */
	public onNext(): void {
		if (this.selectedIndex == this.items.length - 1) {
			this.selectedIndex = 0;
		} else {
			this.selectedIndex++;
		}
		this.selectedIndexChanged.emit(this.selectedIndex);
	}

	/**
	 *  This function is used for transfer blob data to image content.
	 *
	 * 	@returns {string} return image base64 url
	 */
	public toImage(blob: string): string {
		if (blob.length > 0 && blob.indexOf('base64') === -1) {
			return 'data:image/jpg;base64,' + blob;
		} else {
			return  blob;
		}
	}
}
