/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { SecurityContext } from '@angular/core';
import { UiCommonSafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl, SafeValue } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
	it('create an instance', () => {
		const sanitizer: DomSanitizer = {
			bypassSecurityTrustHtml: jest.fn(),
			sanitize: function (context: SecurityContext, value: string | SafeValue | null): string | null {
				throw new Error('Function not implemented.');
			},
			bypassSecurityTrustStyle: function (value: string): SafeStyle {
				throw new Error('Function not implemented.');
			},
			bypassSecurityTrustScript: function (value: string): SafeScript {
				throw new Error('Function not implemented.');
			},
			bypassSecurityTrustUrl: function (value: string): SafeUrl {
				throw new Error('Function not implemented.');
			},
			bypassSecurityTrustResourceUrl: function (value: string): SafeResourceUrl {
				throw new Error('Function not implemented.');
			},
		};
		const pipe = new UiCommonSafeHtmlPipe(sanitizer);
		const spyOn = jest.spyOn(sanitizer, 'bypassSecurityTrustHtml').mockReturnValue('<span>Hello!!</span>');
		expect(pipe).toBeTruthy();
		expect(pipe.transform('<span>Hello!!</span>')).toEqual('<span>Hello!!</span>');
		expect(spyOn).toHaveBeenCalled();
		expect(spyOn).toBeCalledWith('<span>Hello!!</span>');
	});
});
