/*
 * Copyright(c) RIB Software GmbH
 */

import {
	FilterScriptDefOptions, FilterScriptDef
} from './interfaces/filter-script-def-options.interface';
import { Observable } from 'rxjs';

export default abstract class FilterScriptKeywordModel{

	public language = null;
	public dataLanguageId = null;
	public isLoad = false;
	public filterDef : FilterScriptDef = new FilterScriptDef();
	public propertyDef = [];
	public msgTemplate = {
		propertyNameUndefined: {
			keyPath: 'constructionsystem.common.msgTemplate.propertyNameUndefined',
			description: 'The {a} property is undefined.'
		},
		propertyNameError: {
			keyPath: 'constructionsystem.common.msgTemplate.propertyNameError',
			description: 'Missing {a} near {b}, eg: [propertyName].'
		},
		variableNameUndefined: {
			keyPath: 'constructionsystem.common.msgTemplate.variableNameUndefined',
			description: 'The {a} variable is undefined.'
		},
		variableNameError: {
			keyPath: 'constructionsystem.common.msgTemplate.variableNameError',
			description: 'Missing {a} near variable {b}, eg: @[variableName].'
		},
		notSupport: {
			keyPath: 'constructionsystem.common.msgTemplate.notSupport',
			description: '{a} is not supported. please use {b}'
		},
		missingError: {
			keyPath: 'constructionsystem.common.msgTemplate.missingError',
			description: 'Missing {a} near {b}'
		},
		value: {
			keyPath: 'constructionsystem.common.msgTemplate.value',
			description: 'value'
		},
		operator: {
			keyPath: 'constructionsystem.common.msgTemplate.operator',
			description: 'operator'
		},
		syntaxError: {
			keyPath: 'constructionsystem.common.msgTemplate.syntaxError',
			description: 'Syntax error near {a}'
		}
	};

	protected constructor(public id : number | string) {
	}

	public clear(){
		this.propertyDef = [];
	}

	public abstract loadKeyWordsDef(): Observable<boolean>;

	public getKeyWordsDefs() : FilterScriptDefOptions{
		return {
			filterDef: this.filterDef,
			properties: this.propertyDef,
			messages: this.msgTemplate
		};
	}
}