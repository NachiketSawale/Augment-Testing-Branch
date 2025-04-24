/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {ControlContextInjectionToken} from '@libs/ui/common';
import {MatchCodeConverterDirective} from '../../directives/match-code-converter/match-code-converter.directive';

@Component({
	selector: 'businesspartner-main-match-code-text',
	templateUrl: './match-code-text.component.html',
	styleUrls: ['./match-code-text.component.scss'],
})
export class BusinesspartnerMainMatchCodeTextComponent implements AfterViewInit {
	@ViewChild('matchCodeConverter', {read: MatchCodeConverterDirective})
	public matchCodeConverterDirective!: MatchCodeConverterDirective;
	/**
	 * Initializes a new instance.
	 * @param controlContext The control context used to create the component.
	 */
	public constructor() {

	}

	public ngAfterViewInit() {
		this.matchCodeConverterDirective.registerOnChange(this.convert);
	}

	public readonly controlContext = inject(ControlContextInjectionToken);
	public readonly maxLength = 252; // todo chi: how to make it dynamic

	private convert(value: string) {
		const entity = this.controlContext.entityContext.entity;
		if (entity && 'MatchCode' in entity) {
			entity.MatchCode = this.matchCodeConverterDirective.convert(value);
		}
	}
}
