/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ActivePopup, ILookupViewResult } from '@libs/ui/common';

@Component({
	selector: 'basics-shared-emotion-popup',
	templateUrl: './emotion-popup.component.html',
	styleUrls: ['./emotion-popup.component.scss'],
})
export class BasicsSharedEmotionPopupComponent {
	private activePopup = inject(ActivePopup);

	/**
	 * on emotion selection click
	 * @param event
	 */
	public handleEmotionClick(event: MouseEvent) {
		let elementHTML = '';
		if (event.target instanceof HTMLElement) {
			if (event.target.nodeName === 'I') {
				elementHTML = event.target.outerHTML;
			} else if (event.target.nodeName === 'BUTTON') {
				// For FireFox
				elementHTML = event.target.children[0].outerHTML;
			}
		}

		this.activePopup.close({
			apply: true,
			result: elementHTML,
		} as ILookupViewResult<string>);
	}
}
