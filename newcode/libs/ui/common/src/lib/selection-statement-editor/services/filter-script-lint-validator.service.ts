/*
 * Copyright(c) RIB Software GmbH
 */

import { EditorView } from 'codemirror';
import { keyworkmap as wt } from '../models/filter-script-keyword-map';
import { IFilterScriptLintValidationError } from '../models/interfaces/filter-script-lint-validation-error.interface';
import { syntaxTree } from '@codemirror/language';
import { IFilterScriptToken } from '../models/interfaces/filter-script-token.interface';
import { FilterScriptDefOptions, FilterScriptDefOptionMethod, FilterScriptDefOptionMessage } from '../models/interfaces/filter-script-def-options.interface';

type FilterScriptMethodDescriptor = {
	[K : string] : FilterScriptDefOptionMethod
}

export class FilterScriptLintValidator {

	private errors: IFilterScriptLintValidationError[] = [];
	private warningCount = 0;
	private errorCount = 0;
	private msgTemplate ?: FilterScriptDefOptionMessage;
	private cm: EditorView;
	private tokenCount: number = 0;
	private allTokens: IFilterScriptToken[] = [];
	private s: string = '';
	private line = 0;
	private tempIndex = 0;
	private ct?: IFilterScriptToken;
	private character: number = 0;
	private tokenIndex: number = 0;
	private curTemp?: IFilterScriptToken;
	private curIndex: number = 0;
	private statement?: string;
	private cmethod ?: FilterScriptDefOptionMethod;
	private methods ?: FilterScriptMethodDescriptor;
	private objectProperties: string[] = [];// properties
	private variables: string[] = [];// variables

	public constructor(cm: EditorView, filterScriptOption: FilterScriptDefOptions) {
		this.cm = cm;
		this.initialize(filterScriptOption);
	}

	public checkFilterScript(): IFilterScriptLintValidationError[] {

		//this.initialize(filterScriptOption);

		this.clearWarningAndErrors();

		// --------------------------------- check logic --------------------------
		this.removeEmptyToken();
		this.checkSingleToken();
		this.checkFactorToken();
		this.checkRemainToken();

		return this.errors;
	}

	private clearWarningAndErrors(): void {
		this.errors = [];
		this.warningCount = 0;
		this.errorCount = 0;
	}

	private initialize(defs: FilterScriptDefOptions) {
		if (defs) {
			const filterDef = defs.filterDef;
			this.methods = filterDef.methods;
			if (defs.properties) {
				this.objectProperties = [];
				for (const prop of defs.properties) {
					this.objectProperties.push(prop.text);
				}

				if (defs.messages) {
					this.msgTemplate = defs.messages;
				}

				if (defs.selectionParameters) {
					for (const variableItem of defs.selectionParameters) {
						this.variables.push(variableItem.text);
					}
				}
			}
		}
	}

	// ------------------------- below is check method -----------------------------------

	private removeEmptyToken(): void {
		const nodeTree = syntaxTree(this.cm.state);
		const cursor = nodeTree.cursor();

		do {
			//console.log(`Node ${cursor.name} from ${cursor.from} to ${cursor.to}`);
			this.ct = {
				start: cursor.from,
				end: cursor.to,
				string: this.cm.state.doc.sliceString(cursor.from, cursor.to),
				type: cursor.name,
				line: this.cm.state.doc.lineAt(cursor.from).number,
				isChecked: false
			};

			if (cursor.name !== 'Document') {
				this.allTokens.push(this.ct);
			}
		} while (cursor.next());

		this.tokenCount = this.allTokens.length;
	}

	private checkSingleToken(): void {
		for (this.tokenIndex = 0; this.tokenIndex < this.tokenCount; this.tokenIndex++) {
			this.ct = this.allTokens[this.tokenIndex];
			if (this.ct?.type === wt.property) {
				this.parsePropertyWarning();
				this.parsePropertyNameError();
			}

			if (this.ct?.type === wt.variable) {
				this.parseVariableWarning();
				this.parseVariableError();
			}

			if (this.ct?.type === wt.string) {
				this.parseStringWarning();
				this.parseStringError();
			}
		}
	}

	private checkFactorToken(): void {
		for (this.tokenIndex = 0; this.tokenIndex < this.tokenCount; this.tokenIndex++) {
			this.ct = this.allTokens[this.tokenIndex];
			if (!this.ct?.isChecked && this.expectCurType(wt.method)) {
				const mr = this.parseMethod();
				if (mr) {
					continue;
				}
			}

			if (!this.ct?.isChecked && this.expectCurType(wt.property)) {
				this.parsePropertyError();
				// const p = this.parsePropertyError();
				// if (p) {
				// 	continue;
				// }
			}
		}
	}

	private checkRemainToken(): void {
		for (this.tokenIndex = 0; this.tokenIndex < this.tokenCount; this.tokenIndex++) {
			this.ct = this.allTokens[this.tokenIndex];

			// if current token is not checked, check it
			if (!this.ct?.isChecked && this.expectCurType(wt.keyword)) {
				const lk = this.parseKeyWordError();
				if (lk) {
					continue;
				}
			}

			if (!this.ct?.isChecked && (this.expectCurType(wt.string) || this.expectCurType(wt.number) ||
				this.expectCurType(wt.atom) || this.expectCurType(wt.variable))) {
				const lv = this.parseValueLastError();
				if (lv) {
					continue;
				}
			}

			if (!this.ct?.isChecked && this.expectCurType(wt.ov)) {
				const lov = this.parseOperatorValueLastError();
				if (lov) {
					continue;
				}
			}

			if (!this.ct?.isChecked && this.expectCurType(wt.operator)) {
				this.parseOperatorError();
				// const lo = this.parseOperatorError();
				// if (lo) {
				// 	continue;
				// }
			}
		}
	}

	// ------------------------- below is tools method -----------------------------------

	private getLine(n: number): string {
		return this.cm.state.doc.line(n).text;
	}

	private parsePropertyNameError(): void {
		if (!this.ct) {
			return;
		}

		this.line = this.ct.line;
		this.character = this.ct.start;
		this.s = this.getLine(this.ct.line);
		const strLen = this.ct.string.length;

		if (strLen > 0) {
			if (this.ct.string[0] !== '[') {
				this.errorAt(this.msgTemplate?.propertyNameError.description || '', this.ct, '[', this.ct.string);
			}

			if (this.ct.string[strLen - 1] !== ']') {
				this.errorAt(this.msgTemplate?.propertyNameError.description || '', this.ct, ']', this.ct.string);
			}
		}
	}

	private parsePropertyWarning(): void {
		if (!this.ct) {
			return;
		}

		if (!/[_%]/.test(this.ct.string) && this.objectProperties.indexOf(this.ct.string) === -1) {
			this.line = this.ct.line;
			this.character = this.ct.start;
			this.s = this.getLine(this.ct.line);
			this.warningAt(this.msgTemplate?.propertyNameUndefined.description || '', this.ct, this.ct.string, this.character + 1);
		}
	}

	private parseVariableError(): void {

		if (!this.ct) {
			return;
		}

		this.line = this.ct.line;
		this.character = this.ct.start;
		this.s = this.getLine(this.ct.line);
		const strLen = this.ct.string.length;

		if (strLen > 1) {
			if (this.ct?.string[1] !== '[') {
				this.errorAt(this.msgTemplate?.variableNameError.description || '', this.ct, '[', this.ct.string);
			}

			if (this.ct?.string[strLen - 1] !== ']') {
				this.errorAt(this.msgTemplate?.variableNameError.description || '', this.ct, ']', this.ct.string);
			}
		}
	}


	private parseVariableWarning(): void {
		if (!this.ct) {
			return;
		}
		if (this.variables.indexOf(this.ct.string) === -1) {
			this.line = this.ct.line;
			this.character = this.ct.start;
			this.s = this.getLine(this.ct.line);
			this.warningAt(this.msgTemplate?.variableNameUndefined.description || '', this.ct, this.ct.string, this.character + 1);
		}
	}

	private parseStringError(): void {
		if (!this.ct) {
			return;
		}
		this.line = this.ct.line;
		this.character = this.ct.start;
		this.s = this.getLine(this.ct.line);
		const strLen = this.ct.string.length;

		if (strLen > 0) {
			if (this.ct?.string[0] === '"') {
				this.errorAt(this.msgTemplate?.notSupport.description || '', this.ct, '"', '\'');
			}

			if (this.ct?.string[strLen - 1] === '"') {
				this.errorAt(this.msgTemplate?.notSupport.description || '', this.ct, '"', '\'');
			}
		}

		if (strLen < 2) {
			this.errorAt(this.msgTemplate?.syntaxError.description || '', this.ct, this.ct?.string, this.character + 1);
		} else {
			if (this.ct?.string[0] !== '\'' || this.ct?.string[strLen - 1] !== '\'') {
				this.errorAt(this.msgTemplate?.syntaxError.description || '', this.ct, this.ct?.string, this.character + 1);
			}
		}
	}

	private parseStringWarning(): void {

		if (!this.ct) {
			return;
		}

		const result = /@\[([\w_][\w\d_]*)\]/.exec(this.ct.string);

		if (result && this.variables.indexOf(result[0]) === -1) {
			this.line = this.ct.line;
			this.character = this.ct.start + (this.ct.string.indexOf(result[0]));
			if(this.ct){
				this.s = this.getLine(this.ct.line);
				this.warningAt(this.msgTemplate?.variableNameUndefined.description || '', this.ct, result[0], this.character + 1);
			}
		}
	}

	private parseOperatorError(): boolean {
		this.tempIndex = 0;
		if (!this.expectLastType(wt.property)) {
			this.addError(this.curTemp);
			return false;
		}

		if (!(this.expectNextType(wt.string) || this.expectNextType(wt.number) ||
			this.expectNextType(wt.variable) || this.expectNextType(wt.atom))) {
			this.addError(this.curTemp);
			return false;
		}

		this.tokenIndex++;
		return true;
	}

	private addError(token?: IFilterScriptToken, errorMsgTemplate?: string, statement?: string): void {
		if (!token) {
			return;
		}
		this.line = token.line;
		this.character = token.end;
		this.s = this.getLine(token.line);
		
		const errorMessage = errorMsgTemplate ? errorMsgTemplate : (this.msgTemplate ? this.msgTemplate.syntaxError.description : '');
		
		if (statement) {
			this.errorAt(errorMessage, token, this.statement, token.string, this.character + 1);
		} else {
			this.errorAt(errorMessage, token, token.string, this.character + 1);
		}
	}

	private parseOperatorValueLastError(): boolean {

		this.tempIndex = 0;

		if (!this.expectLastType(wt.property)) {
			if (this.curTemp) {
				this.addError(this.curTemp);
			}
			return false;
		}

		this.tokenIndex++;
		return true;
	}

	private parseValueLastError(): boolean {

		this.tempIndex = 0;

		if (!this.expectLastType(wt.operator)) {
			if (this.curTemp) {
				this.addError(this.curTemp);
			}
			return false;
		}
		this.tokenIndex++;
		return true;
	}

	private parseKeyWordError(): boolean {

		this.tempIndex = 0;

		if (!this.expectLastChar(')') && !this.expectLastType(wt.ov) && !this.expectLastType(wt.string) && !this.expectLastType(wt.number) && !this.expectLastType(wt.atom) && !this.expectLastType(wt.variable)) {
			this.addError(this.curTemp);
			return false;
		}

		if (!this.expectNextType(wt.property) && !this.expectNextType(wt.method) && !this.expectNextChar('(')) {
			this.addError(this.curTemp);
			return false;
		}

		this.tokenIndex++;
		return true;
	}


	private parsePropertyError(): boolean {
		this.tempIndex = 0;

		if (this.expectNextType(wt.operator)) {
			this.tempIndex++;

			if (!(this.expectNextType(wt.string) || this.expectNextType(wt.number) || this.expectNextType(wt.variable) || this.expectNextType(wt.atom))) {
				this.addError(this.curTemp, this.msgTemplate?.missingError.description, this.statement);
				return false;
			}
		} else if (!this.expectNextType(wt.ov)) {
			this.addError(this.ct, this.msgTemplate?.missingError.description, this.statement);
			return false;
		}

		this.tempIndex++;
		this.tokenIndex += this.tempIndex + 1;
		return true;
	}


	private parseMethod(): boolean {

		if (!this.ct) {
			return true;
		}

		this.tempIndex = 0;
		if(this.methods && this.ct){
			this.cmethod = this.methods[this.ct.string as keyof typeof this.methods];
		}
		let lastCheckResult = true;

		lastCheckResult = lastCheckResult && this.expectNextChar('(');
		if (!lastCheckResult) {
			this.addError(this.ct, this.msgTemplate?.missingError.description, this.statement);
			return false;
		}

		this.tempIndex++;

		if (this.cmethod) {
			for (let j = 0, plen = this.cmethod.params.length; j < plen; j++) {
				lastCheckResult = lastCheckResult && (this.expectNextType(wt.property) || this.expectNextType(wt.string) || this.expectNextType(wt.number) || this.expectNextType(wt.variable) || this.expectNextType(wt.atom));
				if (!lastCheckResult) {
					this.addError(this.curTemp, this.msgTemplate?.missingError.description, this.statement);
					return false;
				}

				this.tempIndex++;

				if (j < plen - 1) {
					lastCheckResult = this.expectNextChar(',');
					if (!lastCheckResult) {
						this.addError(this.curTemp, this.msgTemplate?.missingError.description, this.statement);
						return false;
					}
					this.tempIndex++;
				}
			}
		}
		
		lastCheckResult = lastCheckResult && this.expectNextChar(')');

		if (!lastCheckResult) {
			this.addError(this.curTemp, this.msgTemplate?.missingError.description, this.statement);
			return false;
		}

		this.tempIndex++;
		this.tokenIndex += this.tempIndex + 1;
		return true;
	}


	// eslint-disable-next-line no-unused-vars

	private expectCurChar(ch: string): boolean {
		const res = this.ct?.string === ch;
		if (res && this.ct) {
			this.ct.isChecked = res;
		}
		return res;
	}

	private expectCurType(type: string): boolean {
		const res = this.ct?.type === type;
		if (res && this.ct) {
			this.ct.isChecked = res;
		}
		return res;
	}
	
	private isFirstToken(): boolean {
		return this.tokenIndex === 0;
	}


	private expectLastType(type: string): boolean {
		this.setStatement(type);
		this.curIndex = this.tokenIndex - (this.tempIndex + 1);
		if (this.curIndex >= 0) {
			this.curTemp = this.allTokens[this.curIndex];
			if (this.curTemp?.type === type) {
				return true;
			}
		} else {
			this.curTemp = this.allTokens[this.curIndex + 1];
		}
		return false;
	}
	
	private expectLastChar(char: string): boolean {
		this.setStatement(char);
		this.curIndex = this.tokenIndex - (this.tempIndex + 1);
		if (this.curIndex >= 0) {
			this.curTemp = this.allTokens[this.curIndex];
			if (this.curTemp?.string === char) {
				return true;
			}
		} else {
			this.curTemp = this.allTokens[this.curIndex + 1];
		}
		return false;
	}

	private isLastToken(): boolean {
		return this.tokenIndex >= this.tokenCount;
	}
	
	private expectNextChar(ch: string): boolean {
		this.statement = ch;
		this.curIndex = this.tokenIndex + (this.tempIndex + 1);
		if (this.curIndex < this.tokenCount) {
			this.curTemp = this.allTokens[this.curIndex];
			if (this.curTemp?.string === ch) {
				this.curTemp.isChecked = true;
				return true;
			}
		} else {
			this.curTemp = this.allTokens[this.curIndex - 1];
		}
		return false;
	}
	
	private expectNextType(type: string): boolean {
		this.setStatement(type);
		this.curIndex = this.tokenIndex + (this.tempIndex + 1);
		if (this.curIndex < this.tokenCount) {
			this.curTemp = this.allTokens[this.curIndex];
			if (this.curTemp?.type === type) {
				this.curTemp.isChecked = true;
				return true;
			}
		} else {
			this.curTemp = this.allTokens[this.curIndex - 1];
		}
		return false;
	}

	private setStatement(expect: string): void {
		this.statement = (expect === wt.string || expect === wt.number || expect === wt.variable || expect === wt.atom) ? this.msgTemplate?.value.description : (expect === wt.ov) ? this.msgTemplate?.operator.description : expect;
	}

	private warning(message: string, token: IFilterScriptToken, a?: string, b?: string | number, c?: string | number, d?: string | number): IFilterScriptLintValidationError {

		const w: IFilterScriptLintValidationError = {
			id: '(error)',
			raw: message,
			evidence: this.s || '',
			line: token.line,
			from: token.start,
			to: token.end,
			character: token.start,
			severity: 'warning',
			a: a,
			b: b,
			c: c,
			d: d
		};

		w.reason = this.supplant(message, w);
		this.errors.push(w);
		return w;
	}

	private warningAt(message: string, token: IFilterScriptToken, a?: string, b?: string | number, c?: string | number, d?: string | number): IFilterScriptLintValidationError {
		this.warningCount++;
		return this.warning(message, token, a, b, c, d);
	}
	
	private error(message: string, token: IFilterScriptToken, a?: string, b?: string | number, c?: string | number, d?: string | number): IFilterScriptLintValidationError {
		const w: IFilterScriptLintValidationError = {
			id: '(error)',
			raw: message,
			evidence: this.s || '',
			line: token.line,
			from: token.start,
			to: token.end,
			character: token.start,
			severity: 'error',
			a: a,
			b: b,
			c: c,
			d: d
		};

		w.reason = this.supplant(message, w);
		this.errors.push(w);
		return w;
	}

	private errorAt(message: string, token: IFilterScriptToken, a?: string, b?: string | number, c?: string | number, d?: string | number): IFilterScriptLintValidationError {
		this.errorCount++;
		return this.error(message, token, a, b, c, d);
	}

	private supplant(m: string, o: IFilterScriptLintValidationError) : string {
		return m.replace(/\{([^{}]*)\}/g, function(a: string, b: keyof IFilterScriptLintValidationError) {
			const r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r.toString() : a;
		});
	}

}