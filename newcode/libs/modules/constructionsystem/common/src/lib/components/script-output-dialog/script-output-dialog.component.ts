/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';
import { LookupContext, LookupViewBase } from '@libs/ui/common';
import { IScriptError } from '@libs/basics/common';

export const COS_SCRIPT_OUTPUT_OPTION_TOKEN = new InjectionToken<IScriptError>('cos-script-output-option-token');

@Component({
	selector: 'constructionsystem-common-script-output-dialog',
	template: '<div>{{ scriptErrorEntity.Description ?? scriptErrorEntity.CallStack }}</div>',
	styleUrls: ['./script-output-dialog.component.scss'],
	imports: [],
	standalone: true,
})
export class CosCommonOutputDialogComponent extends LookupViewBase<object, object> {
	public readonly scriptErrorEntity = inject(COS_SCRIPT_OUTPUT_OPTION_TOKEN);

	protected override lookupContext = inject(LookupContext<object, object>);

	public constructor() {
		super();
	}

	protected override scrollIntoView(dataItem: object): void {}

	protected override select(dataItem: object): void {}
}
