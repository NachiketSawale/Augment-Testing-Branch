/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class StringHandleHelperService {
	protected readonly translate = inject(PlatformTranslateService);

	public validateInvalidFormulaChar(str: string) {

		const matches = str.match(/[`§@#$?:"\\]/gi);
		if (matches) {
			const invalidChars = matches.join(' ');
			return {
				valid: false,
				error: this.translate.instant('basics.common.error.invalidCharNAllInvalidChars', {invalidChar: invalidChars, invalidChars: '`§@#$?: \'\'\\'}).text
			};
		}

		return {
			valid: true,
			error: ''
		};
	}

	public validateInvalidChar(str: string, ignoreReg?: RegExp | undefined) {
		let errorInfo = '`~§!@#$&|=?;:\' \'\'<>{}[]\\￥【】《》？、。，‘“；';
		if(ignoreReg){
			str = str.replace(ignoreReg, '');
			errorInfo = errorInfo.replace(ignoreReg, '');
		}

		const matches = str.match(/[`~§!@#$&|=?;:'"<>{}[\]\\￥【】《》？、。，‘“；]/gi);
		if (matches) {
			const invalidChars = matches.join(' ');
			return {
				valid: false,
				error: this.translate.instant('basics.common.error.invalidCharNAllInvalidChars', {invalidChar: invalidChars, invalidChars: errorInfo}).text
			};
		}

		return {
			valid: true,
			error: ''
		};
	}

	public includeChineseChar(str: string) {
		if (str.match(/[\u4e00-\u9fa5]/gi)) {
			return {
				valid: false,
				error: this.translate.instant('basics.common.error.includeChineseChar').text
			};
		}

		return {
			valid: true,
			error: ''
		};
	}

	// check invalid parameter
	// e.g.  x.2 x1.2 2.x 2.2x 2x x.x x2.2x .x .2 x. 2.
	public validateInvalidParameter(param: string) {
		if (param.match(/(\d+\.*[a-zA-Z\u4e00-\u9fa5]+)|([a-zA-Z\u4e00-\u9fa5]+\d*\.[a-zA-Z0-9\u4e00-\u9fa5]*)|(^[.,].*)|(^.*[.,]$)/gi)) {
			return {
				valid: false,
				error: this.translate.instant('basics.common.error.invalidParam').text
			};
		}

		return {
			valid: true,
			error: ''
		};
	}

	/*
	* base on mouse section on formula string, use variables to replace it
	* */
	public appendVariables(formulaStr: string, variables: string, sectionStart: number, sectionEnd: number) {
		if(!formulaStr || formulaStr === ''){
			return variables;
		}

		const start = this.getLeftIndex(formulaStr,sectionStart);
		const end = this.getRightIndex(formulaStr,sectionEnd);

		formulaStr = formulaStr.slice(0, start) + variables + formulaStr.slice(end);


		return formulaStr;
	}

	public getSelectionVariables(formulaStr: string, sectionStart: number, sectionEnd: number) {
		if(!formulaStr || formulaStr === ''){
			return formulaStr;
		}
		return formulaStr.substring(this.getLeftIndex(formulaStr, sectionStart), this.getRightIndex(formulaStr, sectionEnd));
	}

	private pRegex = new RegExp('^[a-zA-Z0-9_]+$', 'g');
	private getLeftIndex(formulaStr: string,sectionStart: number) {
		const start = sectionStart;
		if (start === 0) {
			return start;
		}
		const formula = formulaStr;

		let left = start - 1;
		while (left >= 0) {
			const previous = formula.substring(left, start);
			this.pRegex.lastIndex = 0;
			if (!this.pRegex.test(previous)) {
				break;
			}
			left--;
		}
		return left + 1;
	}

	protected getRightIndex(formulaStr: string,sectionEnd: number) {
		const end = sectionEnd;
		const formula = formulaStr;
		if (end === formula.length) {
			return end;
		}

		let right = end + 1;
		while (right <= formula.length) {
			const next = formula.substring(end, right);
			this.pRegex.lastIndex = 0;
			if (!this.pRegex.test(next)) {
				break;
			}
			right++;
		}
		return right - 1;
	}

	// replace variables by its value
	public replaceVar2Value(formulaStr: string, variables: string, value: string) {
		if(!formulaStr || formulaStr === '' || !variables || variables === ''){
			return formulaStr;
		}

		const regex = new RegExp('\\b' + variables + '\\b', 'gi');
		formulaStr = formulaStr.replace(regex, value);

		return formulaStr;
	}
}