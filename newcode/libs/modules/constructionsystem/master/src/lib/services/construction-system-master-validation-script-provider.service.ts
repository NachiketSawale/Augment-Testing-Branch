/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ScriptDefProvider } from '@libs/ui/common';

/**
 * ConstructionSystem Master Validation Script Provider
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterValidationScriptProviderService extends ScriptDefProvider {
	public constructor() {
		super('construction.system.master.script.validation');

		//TODO: missing => not clear, currently has the value, will call api.
		//this.apiId = 'construction.system.master';

		this.apiDefs.push({
			Validator: {
				'!type': 'fn()',
				prototype: {
					check: {
						'!type': 'fn(parameter: string, condition: ?, error: string) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?, error: string) -> +Validator',
					},
					hide: {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator',
					},
					show: {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator',
					},
					enable: {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator',
					},
					disable: {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator',
					},
				},
			},
			validator: '+Validator',
		});

		//TODO: missing => appendDef
		/*appendDef: function (defs) {
			 var paramDef = angular.copy(defs[2]);
			 delete paramDef['!name'];
			 defs.push({
				  '!name': 'peDef',
				  'pe': paramDef
			 });
			 defs.push({
				  '!name': 'translatorDef',
				  'translator': paramDef
			 });
		}*/
	}
}
