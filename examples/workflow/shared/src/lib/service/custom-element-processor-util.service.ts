/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})

/**
 * A common class for sanitizing the custom elements
 */
export class CustomElementProcessorUtilService {

	private constructor(private sanitizer: DomSanitizer) {

	}

	private contextMap: { [key: string]: SecurityContext } = {
		'html': SecurityContext.HTML,
		'script': SecurityContext.SCRIPT,
		'resourceurl': SecurityContext.RESOURCE_URL,
		'style': SecurityContext.STYLE,
		'url': SecurityContext.URL
	};

	/**
	 * A common function to provide sanitized content to avoid malcious data insertion.
	 * @param value : The element to be returned.
	 * @param type : The type of data to be processed
	 * @returns :Sanitized custom  content.
	 */
	public processCustomElement(value: string, type: string): string {
		const context = this.contextMap[type.toLocaleLowerCase()] || SecurityContext.NONE;
		return this.sanitizer.sanitize(context, value)!;
	}
}
