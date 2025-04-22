/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IScriptParameter } from '../model/interfaces/script-parameter.interface';

/**
 * Script parameter validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ScriptParameterValidationService {
	private makeScript(script: string, parameterList: IScriptParameter[]) {
		let code = '';

		// create variable enum
		code += 'var pe = {};';

		// create parameter variable
		parameterList.forEach(item => {
			if (item.name) {
				let value;

				if (item.value instanceof Date) {
					value = item.value.getTime();
				} else if (typeof item.value === 'string') {
					value = '"' + item.value + '"';
				} else {
					value = item.value;
				}

				code += 'var ' + item.name + '=' + value + ';\n';
				code += 'pe.' + item.name + '="' + item.name + '";\n';
			}
		});
		// validation script
		code += script;

		return code;
	}

	/**
	 * wrap eval code to an immediate function to protect external scope.
	 * @param code
	 * @returns {string}
	 */
	private wrap(code: string) {
		return '(function(validator){\n' + code + '\nreturn validator.results;\n})(validator)';
	}

	/**
	 * Validate parameter
	 * @param script
	 * @param parameters
	 */
	public validate(script: string, parameters: IScriptParameter[]) {
		let response = [];
		try {
			// TODO: Is this still required?
			//const validator = new ScriptParameterValidator();
			response = eval(this.wrap(this.makeScript(script, parameters)));
		} catch (e) {
			console.log(e);
		}
		return response;
	}

	/**
	 * Validate parameter async
	 * @param script
	 * @param parameters
	 */
	public validate$(script: string, parameters: IScriptParameter[]) {
		return new Observable(s => {
			s.next(this.validate(script, parameters));
		});
	}
}