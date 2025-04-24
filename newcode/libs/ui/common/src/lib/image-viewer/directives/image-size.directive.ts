/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { PlatformModuleManagerService } from '@libs/platform/common';

/**
 *  This is the directive responsible for handling the image size operation
 */
@Directive({
	selector: '[uiCommonImageSize]',
})
export class ImageSizeDirective implements OnInit, AfterViewInit {
	/**
	 * Represent Current Element Height
	 */

	public currentElementHeight!: number;

	/**
	 * Represent Current Element Width
	 */
	public currentElementWidth!: number;

	/**
	 * Represent Viewer Content Width
	 */
	public viewerContentWidth!: number;

	/**
	 * Represent Viewer Content Height
	 */
	public viewerContentHeight!: number;

	/**
	 * inject the Element reference object
	 */
	public elementRef = inject(ElementRef);

	/**
	 * inject the Renderer2 object
	 */
	public render = inject(Renderer2);

	/**
	 * inject the PlatformModuleManagerService
	 */
	public platformModuleManagerService = inject(PlatformModuleManagerService);

	/**
	 * initialize the component
	 */

	public ngOnInit(): void {
		this.platformModuleManagerService.isResize$.subscribe((isSplitterResize: boolean) => {
			if (isSplitterResize) {
				this.resize();
			}
		});
	}

	/**
	 * initialize the component after view init hook
	 */
	public ngAfterViewInit(): void {
		this.resize();
	}

	/**
	 * this function responsible resize the image tag
	 */

	public resize(): void {
		const currentElement = this.elementRef.nativeElement;

		this.currentElementHeight = currentElement.naturalHeight as number;
		this.currentElementWidth = currentElement.naturalWidth as number;

		const viewerContent = this.elementRef.nativeElement.closest('ui-common-image-view');
		this.viewerContentWidth = viewerContent.offsetWidth as number;
		this.viewerContentHeight = viewerContent.offsetHeight as number;
		let currentActualBase = this.currentElementWidth / this.currentElementHeight;
		currentActualBase = currentActualBase ? currentActualBase : 0;
		const viewActualBase = this.viewerContentWidth / this.viewerContentHeight;
		if (viewActualBase > currentActualBase) {
			// base on actual height
			this.setCss(this.viewerContentWidth, this.viewerContentHeight);
		} else {
			// base on actual width
			currentActualBase = currentActualBase ? currentActualBase : 1;
			this.setCss(this.viewerContentWidth, this.viewerContentHeight / currentActualBase);
		}
	}

	/**
	 * this function responsible set css style to image tag
	 *
	 * @param {number}width image width
	 * @param {number}height image height
	 */

	public setCss(width: number, height: number):void {
		
		const currentElement = this.elementRef.nativeElement;
		this.render.setStyle(currentElement, 'width', width + 'px');
		this.render.setStyle(currentElement, 'height', height + 'px');

		this.render.setStyle(currentElement, 'padding', '2%');

		this.render.setStyle(currentElement, 'marginTop', 'initial');
		this.render.setStyle(currentElement, 'marginBottom', 'initial');
	}
}
