/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {DrawingViewer} from '../../model/workers/drawing-viewer';
import {IDrawingViewerConfig} from '../../model/interfaces/drawing-viewer-config.interface';

/**
 * Drawing viewer component used to display 2D drawing and preview pdf document.
 * Drawing Engine: ige
 */
@Component({
	selector: 'model-shared-drawing-viewer',
	templateUrl: './drawing-viewer.component.html',
	styleUrls: ['./drawing-viewer.component.scss'],
})
export class ModelSharedDrawingViewerComponent extends DrawingViewer implements AfterViewInit, OnDestroy {
	/**
	 * Host element for ige engine
	 */
	@ViewChild('canvas')
	public canvasElement!: ElementRef;

	/**
	 * Viewer configuration
	 */
	@Input()
	public config!: IDrawingViewerConfig;

	/**
	 * Viewer initialization
	 */
	public ngAfterViewInit() {
		this.init();
	}

	/**
	 * On destroy
	 */
	public ngOnDestroy() {
		this.destroy();
	}
}