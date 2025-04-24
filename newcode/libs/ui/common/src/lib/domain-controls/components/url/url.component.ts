/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

import { IStringControlContext } from '../../model/string-control-context.interface';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { UrlScheme } from '../../model/enums/url-scheme.enum';
import { UiCommonHotkeyService } from '../../../services/menu-list/hotkey.service';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * An url input box for go to the url in next tab.
 */
@Component({
	selector: 'ui-common-url',
	templateUrl: './url.component.html',
	styleUrls: ['./url.component.scss'],
})
export class UrlComponent extends DomainControlBaseComponent<string, IStringControlContext<string>> implements OnInit {
	/**
	 * Form control
	 */
	public urlString!: FormControl;

	/**
	 * Provides tooltip with title
	 */
	public hotkeyService = inject(UiCommonHotkeyService);

	/**
	 * Provide Translat service
	 */
	private translateService = inject(PlatformTranslateService);

	/**
	 * The Error Message
	 */
	public errorMessage = { key: 'ui.common.invalidUrlPlaceholder' };

	/**
	 * Example Url
	 */
	public urlExample = 'https://www.example.com';

	/**
	 * The default protocol which is comming from parent or Database
	 */
	@Input() public defaultScheme?: UrlScheme;

	/**
	 * Url Scheme.
	 */
	public Schemes = [UrlScheme.Http, UrlScheme.Https, UrlScheme.Ftp, UrlScheme.Ftps, UrlScheme.File];

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.translateService.load(['ui.common']);
		this.urlString = new FormControl('', [Validators.required, this.urlValidator.bind(this)]);
	}

	/**
	 * Validation method to get correct input url
	 * @param {AbstractControl} control
	 * @returns { Null | { urlInvalid : boolean } } The function return the null value or object which has the boolean value to display error on input box.
	 */

	public urlValidator(control: AbstractControl): null | { urlInvalid: boolean } {
		const value = control?.value?.toLowerCase();

		if (this.isStartingWithProtocol(value)) {
			return null;
		} else if (this.defaultScheme) {
			return null;
		}
		return { urlInvalid: true };
	}

	/**
	 * Used for open updated Url.
	 */
	public openUrl(event: Event): void {
		event.preventDefault();
		const url = this.controlContext.value;

		if (url) {
			let win: Window | null;
			if (this.Schemes.some((word) => url?.startsWith(word))) {
				win = window.open(url, '_blank');
			} else {
				win = window.open('https://' + url, '_blank');
			}

			if (win) {
				win.opener = null;
			}
		}
	}

	/**
	 * To Check the url is starting with required protocol or not
	 * @param {string | undefined} input This is a input value to check the starting protocol in the url
	 * @returns { boolean } return the boolean value
	 */
	public isStartingWithProtocol(input: string | undefined) {
		let reg;
		if (input) {
			if (this.Schemes.some((word) => input?.startsWith(word))) {
				if (input?.startsWith('www.')) {
					reg = new RegExp('(^|s)((https?://)?[w-]+(.[w-]+)+.?(:d+)?(/S*)?)');
				} else {
					reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/)?\\/?((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$', 'i');
				}
			} else if (input?.startsWith('\\')) {
				reg = new RegExp('((w+)*)([w]+[^#?s]+)(.*)?(#[w]+)?');
			} else if (input?.length < 50) {
				reg = new RegExp('^[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
			}
		}
		if (reg && input && reg.test(input)) {
			return true;
		}

		return false;
	}

	/**
	 * To Check the click button disable or not
	 * @returns { boolean } return boolean value
	 */
	public isNavigationDisabled(): boolean {
		if (this.controlContext.readonly) {
			return true;
		} else if (this.hasError()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Check the input url is valid or not
	 * @returns { boolean } return boolean value
	 */
	public hasError(): boolean {
		if (((this.urlString.touched || this.urlString.dirty) && this.urlString.hasError('urlInvalid')) || ((this.urlString.touched || this.urlString.dirty) && this.urlString.hasError('required'))) {
			return true;
		} else {
			return false;
		}
	}
}
