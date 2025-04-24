/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, Inject, Input, Renderer2, ViewChild } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';

import { ResizableOverlayContentComponent } from '../resizable-overlay-content/resizable-overlay-content.component';

import { IResizableOverlayDir } from '../../model/resizable-overlay/resizable-overlay-dir.interface';

/**
 * Resizable overlay functionality.
 */
@Component({
	selector: 'ui-common-resizable-overlay',
	templateUrl: './resizable-overlay.component.html',
	styleUrls: ['./resizable-overlay.component.css'],
})
export class ResizableOverlayComponent implements AfterViewInit {
	/**
	 * Represent the resizeDiv Ref.
	 */
	@ViewChild('resizeDiv') public resizeDivRef!: ElementRef;

	/**
	 * Represent the resizeWrapperRef.
	 */
	@ViewChild('resizeWrapper') public resizeWrapperRef!: ElementRef;

	/**
	 * Drag direction.
	 */
	@Input() public dragDirection!: string;

	/**
	 * Active container.
	 */
	public activeContainer: ComponentType<unknown> = ResizableOverlayContentComponent;

	/**
	 * Div collapsed flag.
	 */
	public collapsed = false;

	/**
	 * Div minimum size.
	 */
	private minimumSize = 200;

	/**
	 * Div maximum size.
	 */
	private maximumSize = 800;

	/**
	 * Div offsetWidth.
	 */
	private originalX = 0;

	/**
	 * Div offsetHeight.
	 */
	private originalY = 0;

	/**
	 * Represent originalMouseX.
	 */
	private originalMouseX = 0;

	/**
	 * Represent originalMouseY.
	 */
	private originalMouseY = 0;

	/**
	 * Represent adjusted width.
	 */
	private adjustedWidth!: number;

	/**
	 * Represent adjusted height.
	 */
	private adjustedHeight!: number;

	/**
	 * Represent resizable overlay information.
	 */
	public resizableOverlayDir: IResizableOverlayDir = {
		resizingPoints: {
			topLeft: false,
			topRight: true,
			bottomLeft: false,
			bottomRight: false,
		},
		width: 202,
		height: 220,
	};

	public constructor(
		private renderer: Renderer2,
		@Inject(DOCUMENT) public _document: Document,
	) {}

	/**
	 * Sets resizable div style, add mouse events and update resizable overlay direction status.
	 */
	public ngAfterViewInit() {
		this.renderer.setStyle(this.resizeDivRef.nativeElement, 'width', this.resizableOverlayDir.width + 'px');
		this.renderer.setStyle(this.resizeDivRef.nativeElement, 'height', this.resizableOverlayDir.height + 'px');

		this.updateResizableDir();
	}

	/**
	 * Updates resizing direction of resizing overlay.
	 */
	public updateResizableDir() {
		for (const key in this.resizableOverlayDir.resizingPoints) {
			key === this.dragDirection ? (this.resizableOverlayDir.resizingPoints[key] = true) : (this.resizableOverlayDir.resizingPoints[key] = false);
		}
	}

	/**
	 * Update overlay collapse status.
	 */
	public collapseDiv() {
		this.collapsed = !this.collapsed;
	}

	/**
	 * Add mouse events to drag resizable overlay.
	 * @param $event {MouseEvent} mouse events.
	 */
	public startResize($event: MouseEvent) {
		$event.preventDefault();
		this.originalMouseX = $event.clientX;
		this.originalMouseY = $event.clientY;

		this.originalX = this.resizeWrapperRef.nativeElement.parentNode.offsetWidth;
		this.originalY = this.resizeWrapperRef.nativeElement.parentNode.offsetHeight;

		this._document.addEventListener('mousemove', this.duringResize);
		this._document.addEventListener('mouseup', this.stopResize);
	}

	/**
	 * Updates adjustable width and height after resizable overlay dragged.
	 * @param event {MouseEvent} mouse events.
	 */
	private duringResize = (event: MouseEvent) => {
		let dimensionWidth = this.originalX;
		let dimensionHeight = this.originalY;

		if (this.resizableOverlayDir.resizingPoints['topLeft']) {
			dimensionWidth += this.originalMouseX - event.clientX;
			dimensionHeight += this.originalMouseY - event.clientY;
			this.updateResizableSize(dimensionWidth, dimensionHeight);
		} else if (this.resizableOverlayDir.resizingPoints['topRight']) {
			dimensionHeight += this.originalMouseY - event.clientY;
			dimensionWidth -= this.originalMouseX - event.clientX;

			this.updateResizableSize(dimensionWidth, dimensionHeight);
		} else if (this.resizableOverlayDir.resizingPoints['bottomRight']) {
			dimensionHeight -= this.originalMouseY - event.clientY;
			dimensionWidth -= this.originalMouseX - event.clientX;

			this.updateResizableSize(dimensionWidth, dimensionHeight);
		} else if (this.resizableOverlayDir.resizingPoints['bottomLeft']) {
			dimensionHeight -= this.originalMouseY - event.clientY;
			dimensionWidth += this.originalMouseX - event.clientX;

			this.updateResizableSize(dimensionWidth, dimensionHeight);
		}

		this.updateStyle();
	};

	/**
	 * Updates adjustable width and height of resizable overlay.
	 * @param width {number} adjustable width.
	 * @param height {number} adjustable height.
	 */
	private updateResizableSize(width: number, height: number) {
		this.adjustedWidth = Math.max(width, this.resizableOverlayDir.width);
		this.adjustedHeight = Math.max(height, this.resizableOverlayDir.height);
	}

	/**
	 * Stops mouse propagation.
	 */
	private stopResize = () => {
		this._document.removeEventListener('mousemove', this.duringResize);
		this._document.removeEventListener('mouseup', this.stopResize);
	};

	/**
	 * Updates overlay style.
	 */
	private updateStyle() {
		if (this.maximumSize > this.adjustedWidth && this.maximumSize > this.adjustedHeight && this.minimumSize < this.adjustedWidth && this.minimumSize < this.adjustedHeight) {
			this.renderer.setStyle(this.resizeDivRef.nativeElement, 'width', this.adjustedWidth + 'px');
			this.renderer.setStyle(this.resizeDivRef.nativeElement, 'height', this.adjustedHeight + 'px');
		}
	}

	/**
	 * Save resizable direction information.
	 */
	private saveResizableDirData() {
		//TODO using mainView service and API call data will be save in future.
	}
}
