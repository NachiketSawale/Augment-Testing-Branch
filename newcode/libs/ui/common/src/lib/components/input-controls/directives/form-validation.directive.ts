// TODO: remove this file?

import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
//import { PlatformRuntimeDataService } from '@libs/platform/common';
@Directive({
	selector: '[uiCommonFormValidation]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FormValidationDirective,
			multi: true,
		},
	],
})
export class FormValidationDirective /*implements Validator*/ {
	/*
	@Input('data-entity') entity: any;
	@Input('data-config') config: any;
	@Input() value: any;
	constructor(private platformRuntimeDataService: PlatformRuntimeDataService) {}
	validate(control: any) {
		if (this.config) {
			return null;
		}
		let entity = !this.entity ? {} : this.entity;
		let field = 'code';
		if (entity && _.get(entity, field) !== control.value) {
			let valid = {
				valid: _.isNil(control.value) || _.isEmpty(control.value),
				error: 'cloud.common.emptyOrNullValueErrorMessage',
			};
			valid = this.platformRuntimeDataService.applyValidationResult(valid, entity, field);
			return valid;
		}
		return { valid: true };
	}*/
}

