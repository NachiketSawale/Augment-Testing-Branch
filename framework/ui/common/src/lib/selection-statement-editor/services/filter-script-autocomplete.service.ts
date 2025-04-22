/*
 * Copyright(c) RIB Software GmbH
 */

import { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { IFilterScriptToken } from '../models/interfaces/filter-script-token.interface';
import { FilterScriptDefOptions, FilterScriptDefParameter,FilterScriptDefOptionProperty, FilterScriptDefOptionMethod } from '../models/interfaces/filter-script-def-options.interface';


/**
 * Function for filter script autoCompletion
 */
export function filterScriptAutoCompletion(filterScriptOption: FilterScriptDefOptions) {
	const option = filterScriptOption;

	return (context: CompletionContext) => {
		//let word = context.matchBefore(/\w*/);
		const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);

		let needComplete = false;
		if (['variableName', 'propertyName', 'memberName'].indexOf(nodeBefore.name) > -1) {
			needComplete = true;
		}

		if (!needComplete) {
			return null;
		} else {
			return new FilterScriptCompletion(option).autoCompletion(context);
		}
	};
}

type FoundResult = { label: string, detail: string, type: string };

type AddFunc = (obj :string | FilterScriptDefOptionProperty | FilterScriptDefParameter, className?: string) => void;

class FilterScriptCompletion {
	private readonly methods = {};
	private readonly javascriptKeywords: string[] = [];
	private readonly operators: string[] = [];
	private readonly ov: string[] = [];
	private readonly properties: FilterScriptDefOptionProperty[] = [];
	private readonly variables : FilterScriptDefParameter[] = [];
	private found: FoundResult[] = [];
	private start = '';
	private limitCountOfProps = 1000;

	public constructor(filterScriptOption: FilterScriptDefOptions) {
		const filterDef = filterScriptOption.filterDef;
		this.methods = filterDef.methods;
		this.javascriptKeywords = filterDef.keywords;
		this.operators = filterDef.operators;
		this.ov = filterDef.ov;
		this.properties = filterScriptOption.properties;
		if (filterScriptOption && filterScriptOption.selectionParameters) {
			this.variables = filterScriptOption.selectionParameters;
		}
	}

	private arrayContains(arr: FoundResult[], item: FoundResult): boolean {

		if (!Array.prototype.indexOf) {
			let i = arr.length;
			while (i--) {
				if (arr[i] === item) {
					return true;
				}
			}
			return false;
		}
		return arr.indexOf(item) !== -1;
	}

	private forEachArray(array: (string | FilterScriptDefOptionProperty | FilterScriptDefParameter)[], f: AddFunc, className?: string, limitCount?: number) {
		for (let i = 0, e = array.length; i < e; ++i) {
			f.call(this, array[i], className);
			if (limitCount && limitCount > 0) {
				if (this.found.length > limitCount) {
					break;
				}
			}
		}
	}

	private forEachObject(arr: { [k : string] : FilterScriptDefOptionMethod }, f: AddFunc, className?: string) {
		for (const p in arr) {
			if (Object.prototype.hasOwnProperty.call(arr, p)) {
				f.call(this, arr[p], className);
			}
		}
	}

	public autoCompletion(context: CompletionContext): CompletionResult {

		// Find the token at the cursor
		// const word = context.matchBefore(/\w*/);
		const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
		const token = {
			start: nodeBefore.from,
			end: nodeBefore.to,
			string: context.state.sliceDoc(nodeBefore.from, nodeBefore.to),
			type: nodeBefore.name,
			line: context.state.doc.lineAt(nodeBefore.from).number,
			isChecked: false
		} as IFilterScriptToken;

		let lastToken;

		if (nodeBefore.prevSibling) {
			lastToken = {
				start: nodeBefore.prevSibling.from,
				end: nodeBefore.prevSibling.to,
				string: context.state.sliceDoc(nodeBefore.prevSibling.from, nodeBefore.prevSibling.to),
				type: nodeBefore.prevSibling.name,
				line: context.state.doc.lineAt(nodeBefore.prevSibling.from).number,
				isChecked: false
			} as IFilterScriptToken;
		} else {
			lastToken = {
				start: 0,
				end: 0,
				string: '',
				type: nodeBefore.parent?.name,
				line: context.state.doc.lineAt(nodeBefore.from).number,
				isChecked: false
			} as IFilterScriptToken;
		}

		let end = context.pos;
		let start = context.pos;

		if (token.string && token.string !== '' && token.string !== ' ' && token.string !== '(' && token.string.length && token.string.length > 0) {
			start = token.start;
			end = start + token.string.length;
		}

		if (token.end > context.pos) {

			token.end = end > context.pos ? end : context.pos;
			token.string = token.string.slice(0, context.pos - token.start);

			if (token.type === 'string') {
				const vIndex = token.string.lastIndexOf('@');
				if (vIndex !== -1) {
					start = token.start + vIndex;
				}
			}
		}

		return {
			options: this.getCompletions(token, lastToken),
			from: start,
			to: end
		};
	}

	private checkLastToken(token: IFilterScriptToken, lastToken: IFilterScriptToken) {

		if (lastToken.type === 'keyword') {
			this.gatherCompletions('method');
			this.gatherCompletions('propertyName');
		} else if (lastToken.type === 'ov' || lastToken.type === 'string' || lastToken.type === 'number' || lastToken.type === 'atom') {
			this.gatherCompletions('keyword');
		} else if (lastToken.type === 'propertyName') {
			this.gatherCompletions('operator');
			this.gatherCompletions('ov');
		} else if (lastToken.type === 'operator') {
			this.gatherCompletions(null);
		} else if (lastToken.string === '') {
			this.gatherCompletions('method');
			this.gatherCompletions('propertyName');
		} else if (lastToken.string === '(') {
			this.gatherCompletions('propertyName');
		} else if (lastToken.string === ' ' || lastToken.string === ')') {
			this.gatherCompletions('keyword');
		} else if (lastToken.string === ',') {
			this.gatherCompletions(null);
		} else {
			this.gatherCompletions('all');
		}
	}

	private maybeAdd(obj: string | FilterScriptDefOptionProperty | FilterScriptDefParameter, className?: string) {
		const tempStart = this.start.toUpperCase().replace(/[[\]]/ig, '');
		let tempStr: string;

		const foundResult : FoundResult = {
			label : '',
			detail : '',
			type : ''
		};

		if (typeof obj === 'string') {
			tempStr = obj.toUpperCase().replace(/[[\]]/ig, '');
			foundResult.label = obj;
		} else {
			tempStr = obj.text.toUpperCase().replace(/[[\]]/ig, '');
			foundResult.label = obj.text;
			foundResult.detail = obj.description || '';
		}

		foundResult.type = className || '';
		
		if (tempStr.lastIndexOf(tempStart, 0) === 0 && !this.arrayContains(this.found, foundResult)) {
			this.found.push(foundResult);
		}
	}

	private maybeAddVariable(obj: string | FilterScriptDefOptionProperty | FilterScriptDefParameter, className?: string) {
		const tempStart = this.start;

		const foundResult : FoundResult = {
			label : '',
			detail : '',
			type : ''
		};

		let tempStr :string;

		if (typeof obj === 'string') {
			tempStr = obj.toUpperCase().replace(/[@[\]]/ig, '');
			foundResult.label = obj;
		} else {
			tempStr = obj.text.toUpperCase().replace(/[@[\]]/ig, '');
			foundResult.label = obj.text;
			foundResult.detail = obj.description || '';
		}

		foundResult.type = className || '';

		if (tempStr.lastIndexOf(tempStart, 0) === 0 && !this.arrayContains(this.found, foundResult)) {
			this.found.push(foundResult);
		}
	}


	private gatherCompletions(type?: string | null) {

		if (!type) {
			return;
		}

		if (type === 'all' || type === 'keyword') {
			this.forEachArray(this.javascriptKeywords, this.maybeAdd, this.getClassNameByType('keyword'));
		}

		if (type === 'all' || type === 'method') {
			this.forEachObject(this.methods, this.maybeAdd, this.getClassNameByType('method'));
		}

		if (type === 'all' || type === 'propertyName') {
			this.forEachArray(this.properties, this.maybeAdd, this.getClassNameByType('property'), this.limitCountOfProps);
		}

		if (type === 'operator') {
			this.forEachArray(this.operators, this.maybeAdd, this.getClassNameByType('operator'));
		}

		if (type === 'ov') {
			this.forEachArray(this.ov, this.maybeAdd, this.getClassNameByType('ov'));
		}

		if (type === '(') {
			this.forEachArray(['('], this.maybeAdd);
		}

		if (type === 'variableName') {
			this.start = this.start.toUpperCase().replace(/[@[\]]/ig, '');
			this.forEachArray(this.variables, this.maybeAddVariable, this.getClassNameByType('variable'));
		}

		if (type === 'string.variable') {
			let tempStart = '';
			const variableRegex = /@[[]{0,1}([a-zA-Z_]{1}[a-zA-Z0-9_]*)[\]]{0,1}/ig;
			const execResult = variableRegex.exec(this.start);
			if (execResult && execResult[1]) {
				tempStart = execResult[1];
			}

			this.start = tempStart.toUpperCase();
			this.forEachArray(this.variables, this.maybeAddVariable, this.getClassNameByType('variable'));
		}
	}

	private getClassNameByType(type: string): string {

		let tempType : string;
		if (type === 'method') {
			tempType = 'fn';
		} else if (type === 'propertyName') {
			tempType = 'object';
		} else {
			tempType = 'unknown';
		}

		return 'CodeMirror-Tern-completion CodeMirror-Tern-completion-' + tempType;
	}

	private getCompletions(token: IFilterScriptToken, lastToken: IFilterScriptToken) {
		this.start = token.string;
		if (token.string === '') {
			this.start = '';
			if (lastToken.type === 'method') {
				this.gatherCompletions('(');
			} else {
				this.checkLastToken(token, lastToken);
			}
		} else if (token.string === '(') {
			this.start = '';
			if (lastToken.type === 'keyword') {
				this.gatherCompletions('method');
				this.gatherCompletions('propertyName');
			} else if (lastToken.type === 'method') {
				this.gatherCompletions('propertyName');
			} else if (lastToken.type === 'propertyName') {
				this.gatherCompletions(null);
			} else {
				this.checkLastToken(token, lastToken);
			}
		} else if (token.string === ' ') {
			this.start = '';
			if (lastToken.type === 'method') {
				this.gatherCompletions('(');
			} else {
				this.checkLastToken(token, lastToken);
			}
		} else if (token.string === ',') {
			this.gatherCompletions(null);
		} else if (token.string.indexOf('@') !== -1) {
			if (token.type === 'variableName') {
				this.gatherCompletions('variableName');
			} else if (token.type === 'string') {
				this.gatherCompletions('string.variable');
			}
		} else {
			this.checkLastToken(token, lastToken);
		}

		return this.found;
	}
}
