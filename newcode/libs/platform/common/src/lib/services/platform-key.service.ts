/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

/**
 * Provides access to global key events PlatformKeyService
 */
@Injectable({
	providedIn: 'root'
})

export class PlatformKeyService {

	private ctrlIsPressed = false;
	private shiftIsPressed = false;

	public registerKeyEvents = () => {
		window.addEventListener('keydown', this.keyDownListener, false);
		window.addEventListener('keyup', this.keyUpListener, false);
	};

	private keyDownListener = (event: KeyboardEvent) => {
		if (event.ctrlKey) {
			this.ctrlIsPressed = true;
		}
		if (event.shiftKey) {
			this.shiftIsPressed = true;
		}
	};
	private keyUpListener = (event: KeyboardEvent) => {
		this.ctrlIsPressed = event.ctrlKey;
		this.shiftIsPressed = event.shiftKey;
	};

	/**
	 * indicates whether ctrl is pressed or not
	 */
	public isCtrlPressed(): boolean {
		return this.ctrlIsPressed;
	}

	/**
	 * indicates whether shift is pressed or not
	 */
	public isShiftPressed(): boolean {
		return this.shiftIsPressed;
	}
}
