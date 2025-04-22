/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';

export const MISSING_IDENT_TOKEN = new InjectionToken<string>('missing-identifier');

/**
 * This component represents a missing domain control.
 */
@Component({
	selector: 'ui-common-missing',
	templateUrl: './missing.component.html',
	styleUrls: ['./missing.component.css'],
})
export class MissingComponent {

	public readonly missingIdentifier = inject(MISSING_IDENT_TOKEN);
}
