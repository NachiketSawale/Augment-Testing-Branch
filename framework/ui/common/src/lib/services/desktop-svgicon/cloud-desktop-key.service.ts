/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { KeyCodes } from './key-codes';

@Injectable({
	providedIn: 'root',
})
export class CloudDesktopKeyService {
	private ctrl: boolean;
	private shift: boolean;
	private navButtonSelector: string;

	public constructor() {
		this.ctrl = false;
		this.shift = false;
		this.navButtonSelector = '.navigator-button.ico-goto';
	}

	private registerKeyListeners() {
		document.onkeydown
			? (event: KeyboardEvent): void => {
				const key = event.which || event.keyCode;
				if (key === KeyCodes.CTRL) {
					document.querySelector(this.navButtonSelector)?.setAttribute('cursor', 'cell');
					this.ctrl = true;
				} else if (key === KeyCodes.SHIFT) {
					document.querySelector(this.navButtonSelector)?.setAttribute('cursor', 'cell');
					this.shift = true;
				}
			}
			: document.onkeydown;

		document.onkeyup
			? (event: KeyboardEvent): void => {
				const key = event.which || event.keyCode;
				if (key === KeyCodes.CTRL) {
					document.querySelector(this.navButtonSelector)?.setAttribute('cursor', 'pointer');
					this.ctrl = false;
				} else if (key === KeyCodes.SHIFT) {
					document.querySelector(this.navButtonSelector)?.setAttribute('cursor', 'pointer');
					this.shift = false;
				}
			}
			: document.onkeyup;
	}

	public isCtrlDown(): boolean {
		return this.ctrl;
	}

	public isShiftDown(): boolean {
		return this.shift;
	}

	public resetCursorForNavBtn(): void {
		document.querySelectorAll(this.navButtonSelector);
	}

	public clearKeyListeners(): void {
		(document.querySelector(this.navButtonSelector) as HTMLElement)?.setAttribute('cursor', 'pointer');
		this.ctrl = false;
		this.shift = false;
	}
}
