/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { DrawingDisplayMode } from './enums';
import { IDrawingViewerStatus } from './interfaces/drawing-viewer-status.interface';

/**
 * Viewer status
 */
export class DrawingViewerStatus implements IDrawingViewerStatus {
	/**
	 * message history
	 */
	public history: string[] = [];

	/**
	 * Is viewer working
	 */
	public isWorking: boolean = false;

	/**
	 * Message
	 */
	public message: string = '';

	/**
	 * Drawing display mode
	 */
	public displayMode = DrawingDisplayMode.None;

	/**
	 * Display mode changed subject
	 */
	public displayModeChanged$ = new Subject<DrawingDisplayMode>();

	/**
	 * Is displaying document
	 */
	public get isDocument() {
		return this.displayMode === DrawingDisplayMode.Document;
	}

	/**
	 * Set work status
	 * @param message
	 */
	public work(message: string) {
		this.isWorking = true;
		this.pushMessage(message);
	}

	/**
	 * Set rest status
	 * @param message
	 */
	public rest(message: string = '') {
		this.isWorking = false;
		this.pushMessage(message);
	}

	/**
	 * Clear history
	 */
	public clear() {
		this.history.length = 0;
	}

	private pushMessage(message: string) {
		// empty string
		if (!message) {
			return;
		}

		this.message = this.format(message);
		this.history.push(this.message);
	}

	private format(message: string) {
		const t = new Date().toLocaleTimeString();
		return `${t}: ${message}`;
	}

	/**
	 * Initialize display mode
	 * @param value
	 */
	public initDisplayMode(value: DrawingDisplayMode) {
		this.displayMode = value;
	}

	/**
	 * Set display mode
	 * @param value
	 */
	public setDisplayMode(value: DrawingDisplayMode) {
		if (this.displayMode !== value) {
			this.displayMode = value;
			this.displayModeChanged$.next(value);
		}
	}
}
