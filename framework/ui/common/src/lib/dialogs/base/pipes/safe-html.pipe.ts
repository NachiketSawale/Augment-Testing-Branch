/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe bypasses security to render attributes of template displayed.
 */
@Pipe({
	name: 'uiCommonSafeHtml',
})
export class UiCommonSafeHtmlPipe implements PipeTransform {
	public constructor(private sanitizer: DomSanitizer) {}

	/**
	 * This function bypasses security to render attributes of template displayed.
	 *
	 * @param {string} value Template.
	 * @returns {SafeHtml}
	 */
	public transform(value: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(value);
	}
}
