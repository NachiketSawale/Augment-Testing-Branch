/*
 * Copyright(c) RIB Software GmbH
 */

import Quill, { Parchment } from 'quill';
import Action from './Action';

/**
 * Image tag Delete Action
 */
export default class DeleteAction extends Action {
	/**
	 * on Create Delete Action
	 */
	public override onCreate() {
		document.addEventListener('keyup', this.onKeyUp, true);
		this.formatter.quill.root.addEventListener('input', this.onKeyUp, true);
	}

	/**
	 * on Destroy Action
	 */
	public override onDestroy() {
		document.removeEventListener('keyup', this.onKeyUp, true);
		this.formatter.quill.root.removeEventListener('input', this.onKeyUp, true);
	}

	/**
	 * Capture the Key up event
	 * @param e event
	 * @returns void
	 */
	public onKeyUp = (e: Event): void => {
		const modalOpen: boolean = !!document.querySelector('div[data-blot-formatter-modal]');
		if (!this.formatter.currentSpec || modalOpen) {
			return;
		}

		// delete or backspace
		if ((e as KeyboardEvent).code === 'Delete') {
			const targetElement = this.formatter.currentSpec.getTargetElement();
			if (targetElement) {
				const blot = Quill.find(targetElement);
				if (blot) {
					const index = this.formatter.quill.getIndex(blot as Parchment.Blot);
					this.formatter.quill.deleteText(index, 1, 'user'); // Deletes 1 character from index position
				}
			}
			this.formatter.hide();
		}
	};
}
