import { StreamParser, StringStream } from '@codemirror/language';
import { IQueryEditorState } from '../../model/entities/quantity-query-editor/query-editor-state.interface';
import { QuantityQueryEditorService } from './quantity-query-editor.service';
import { Tag } from '@lezer/highlight';
import { RibFunctionTag } from '../../model/enums/quantity-query-editor/rib-function-tag.enum';
import { isRegExp } from 'lodash';
export function createQuantityQueryParser(
	service: QuantityQueryEditorService,
	ribTags: {
		[name: string]: Tag | readonly Tag[];
	},
): StreamParser<IQueryEditorState> {
	const wordRE = /[\w$\xa1-\uffff]/;
	const paramValueCache = new Map<string, Set<string>>();
	let lastCh: string | void | null = null;
	let currentFunctionName: string | null = null;
	let currentParameterNamesArray: string[] = [];
	let currentParameterName: string | null = null;
	let parameterNamesBefore: string[] = [];
	function checkOperator(word: string) {
		return service.operatorExtKeysArray.includes(word) ? RibFunctionTag.Operator : null;
	}

	function checkFunctionNames(word: string, functionNamesArray: string[]) {
		return functionNamesArray.includes(word) ? RibFunctionTag.FunctionName : null;
	}

	function checkWordOperator(word: string) {
		return service.targetWordOperatorArray.includes(word) ? RibFunctionTag.Operator : null;
	}

	const tokenBase = function (stream: StringStream, state: IQueryEditorState): string | null {
		const ch = stream.next();
		lastCh = ch; // Set lastCh once at the beginning since it's set in every branch

		// Handle quotes
		if (ch === '"') {
			if (lastCh === '\\') {
				state.tokenize = tokenString(ch);
				return state.tokenize(stream, state);
			}
			return lastCh === ':' ? RibFunctionTag.StartParameterValueQuoto : RibFunctionTag.EndParameterValueQuoto;
		}

		// Handle numbers
		if (ch && handleNumbers(stream, ch)) {
			return RibFunctionTag.Number;
		}

		// Handle parentheses
		if (ch && /[()]/.test(ch)) {
			return null;
		}

		// Handle operators
		if (ch === ':') {
			stream.eatWhile(/[:=]/);
			return stream.current() === ':=' ? RibFunctionTag.AssignOperator : null;
		}

		// Handle other special characters
		switch (ch) {
			case ';':
				return RibFunctionTag.ParameterValueSeperator;
			case ' ':
				return RibFunctionTag.BlankSpace;
		}

		// Handle operators from service
		if (isValidRegExp(service.targetOperatorRegExp) && ch && service.targetOperatorRegExp.test(ch)) {
			stream.eatWhile(service.targetOperatorRegExp);
			const result = checkOperator(stream.current());
			if (result != null) {
				return result;
			}
		}

		// Handle words (function names, parameters, etc.)
		if (ch && wordRE.test(ch)) {
			return handleWordTokens(stream, ch);
		}

		return null;
	};

	// Helper functions
	function handleNumbers(stream: StringStream, ch: string): boolean {
		// Handle decimal numbers
		if (ch === '.' && stream.match(/^\d+(?:[eE][+-]?\d+)?/)) {
			return true;
		}

		// Handle different number bases
		if (ch === '0') {
			if (stream.eat(/x/i)) {
				stream.eatWhile(/[\da-f]/i);
				return true;
			}
			if (stream.eat(/o/i)) {
				stream.eatWhile(/[0-7]/i);
				return true;
			}
			if (stream.eat(/b/i)) {
				stream.eatWhile(/[01]/i);
				return true;
			}
		}

		// Handle regular numbers
		if (/\d/.test(ch)) {
			stream.match(/^\d*(?:\.\d*)?(?:[eE][+-]?\d+)?/);
			return true;
		}

		return false;
	}

	function handleWordTokens(stream: StringStream, ch: string): string | null {
		stream.eatWhile(wordRE);
		const cur = stream.current();

		// Check for function names first
		const fnResult = checkFunctionNames(cur, service.functionNamesArray);
		if (fnResult != null) {
			currentFunctionName = cur;
			parameterNamesBefore = [];
			currentParameterNamesArray = getParameterNamesByFunctionName(currentFunctionName);
			return fnResult;
		}

		// Check for parameter names
		const paramResult = checkParameterNames(cur);
		if (paramResult != null) {
			currentParameterName = cur;
			parameterNamesBefore.push(cur);
			return paramResult;
		}

		// Check for parameter values
		const valueResult = checkParameterValues(cur);
		if (valueResult != null) {
			return valueResult;
		}

		// Check for word operators if preceded by space
		if (lastCh === ' ') {
			const opResult = checkWordOperator(cur);
			if (opResult != null) {
				return opResult;
			}
		}

		// Default to string
		return RibFunctionTag.String;
	}

	function isValidRegExp(re: string | RegExp): re is RegExp {
		return isRegExp(re) && typeof re.test === 'function';
	}

	function getParameterNamesByFunctionName(functionName: string) {
		const parameterNamesArray: string[] = [];
		if (functionName !== null && functionName !== undefined) {
			service.functionsArray.forEach((item) => {
				if (item.functionName === functionName) {
					const parametersArray = item.ParametersArray;
					parametersArray.forEach((pa) => {
						if (!parameterNamesArray.includes(pa.parameterName)) {
							parameterNamesArray.push(pa.parameterName);
						}
					});
				}
			});
		}
		return parameterNamesArray;
	}

	function getParameterValuesByFunctionNameAndParameterName(functionName: string | null, parameterName: string | null) {
		if (!functionName || !parameterName) {
			return [];
		}

		const functionObj = service.functionsArray.find((fn) => fn.functionName === functionName);
		if (!functionObj) {
			return [];
		}

		const parameterObj = functionObj.ParametersArray.find((param) => param.parameterName === parameterName);

		return parameterObj?.parameterValuesArray || [];
	}

	function checkParameterNames(word: string): string | null {
		if (!currentFunctionName) {
			return null;
		}
		// Initialize parameter names array if empty
		if (currentParameterNamesArray.length === 0) {
			currentParameterNamesArray = getParameterNamesByFunctionName(currentFunctionName);
		}
		// Check if word is a parameter name and hasn't been seen before
		if (currentParameterNamesArray.includes(word) && !parameterNamesBefore.includes(word)) {
			return RibFunctionTag.ParameterName;
		}

		return null;
	}

	function checkParameterValues(word: string): string | null {
		if (!currentFunctionName || !currentParameterName) {
			return null;
		}

		const cacheKey = `${currentFunctionName}|${currentParameterName}`;

		if (!paramValueCache.has(cacheKey)) {
			const paramValueObjects = getParameterValuesByFunctionNameAndParameterName(currentFunctionName, currentParameterName);
			paramValueCache.set(cacheKey, new Set(paramValueObjects.map((obj) => obj.parameterValueExtKey)));
		}

		return paramValueCache.get(cacheKey)?.has(word) ? RibFunctionTag.ParameterValue : null;
	}

	function tokenString(quote: string) {
		return function (stream: StringStream, state: IQueryEditorState) {
			let escaped = false,
				next;
			while ((next = stream.next())) {
				if (next === quote && !escaped) {
					break;
				}
				escaped = !escaped && next === '\\';
			}
			if (!escaped) {
				state.tokenize = tokenBase;
			}
			let word = stream.current();
			if (word.indexOf('"') === 0) {
				word = word.substr(1);
			}
			if (word.lastIndexOf('"') === word.length - 1) {
				word = word.substr(0, word.length - 1);
			}
			const result = checkParameterValues(word);
			if (result !== null && result !== undefined) {
				return result;
			} else {
				return RibFunctionTag.String;
			}
		};
	}

	return {
		token: tokenBase,
		startState(): IQueryEditorState {
			return {
				tokenize: tokenBase,
			};
		},
		copyState(state: IQueryEditorState): IQueryEditorState {
			return {
				tokenize: state.tokenize,
			};
		},
		tokenTable: ribTags,
	} as StreamParser<IQueryEditorState>;
}
