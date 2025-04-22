/*
 * Copyright(c) RIB Software GmbH
 */

import { StreamParser, StringStream } from '@codemirror/language';
import { IFilterScriptState } from '../models/interfaces/filter-script-state.interface';
import { FilterScriptDefOptions } from '../models/interfaces/filter-script-def-options.interface';

type keyword = {
	type : string;
	style : string;
}

type keywordDescriptor = {
	[k : string] : keyword
}

export function createFilterScriptParser(options: FilterScriptDefOptions): StreamParser<IFilterScriptState> {
		// let type: string | null | void = null;
		// let content: string | null | void = null;
		const operatorCharRegex = /[+\-*&%=<>!?|~^]/;
		// let objectProperties: string[] = [];
		const wordRE = /[\w$\xa1-\uffff]/;

		let keywords: keywordDescriptor;

		const kw = function (type: string) {
			return { type: type, style: type };
		};

		const initialize = function (defs: FilterScriptDefOptions): void {
			if (defs) {
				keywords = {};// clear
				// objectProperties = [];
				const A = kw('keyword'), B = kw('method');
				// eslint-disable-next-line prefer-const
				let operator = kw('operator'), ov = kw('ov'), atom = kw('atom');
				const filterDef = defs.filterDef;

				for (const method in filterDef.methods) {
					keywords[method] = B;
				}

				for (const k in filterDef.keywords) {
					keywords[filterDef.keywords[k]] = A;
				}

				for (const o in filterDef.operators) {
					keywords[filterDef.operators[o]] = operator;
				}

				for (const operatorValue in filterDef.ov) {
					keywords[filterDef.ov[operatorValue]] = ov;
				}

				for (const atomValue in filterDef.atom) {
					keywords[filterDef.atom[atomValue]] = atom;
				}

				// for (const prop of defs.properties) {
				// 	objectProperties.push(prop.text);
				// }
			}
		};

		initialize(options);

		const readRegexp = function (stream: StringStream):void {
			let escaped = false, next, inSet = false;
			while ((next = stream.next())) {
				if (!escaped) {
					if (next === '/' && !inSet) {
						return;
					}
					if (next === '[') {
						inSet = true;
					}else if (inSet && next === ']') {
						inSet = false;
					}
				}
				escaped = !escaped && next === '\\';
			}
		};

		const ret = function (tp: string, style?: string, cont?: string): string | null {
			// type = tp;
			// content = cont;
			return style || null;
		};

		const tokenBase = function (stream: StringStream, state: IFilterScriptState): string | null {
			const ch = stream.next();
			if (typeof ch !== 'string') {
				return '';
			}
			if (ch === '"' || ch === '\'') {
				state.tokenize = tokenString(ch);
				return state.tokenize(stream, state);
			} else if (ch === '.' && stream.match(/^\d+(?:[eE][+-]?\d+)?/)) {
				return ret('number', 'number');
			} else if (/[(),;:.]/.test(ch)) {
				return ret(ch);
			} else if (ch === '0' && stream.eat(/x/i)) {
				stream.eatWhile(/[\da-f]/i);
				return ret('number', 'number');
			} else if (ch === '0' && stream.eat(/o/i)) {
				stream.eatWhile(/[0-7]/i);
				return ret('number', 'number');
			} else if (ch === '0' && stream.eat(/b/i)) {
				stream.eatWhile(/[01]/i);
				return ret('number', 'number');
			} else if (/\d/.test(ch)) {
				stream.match(/^\d*(?:\.\d*)?(?:[eE][+-]?\d+)?/);
				return ret('number', 'number');
			} else if (ch === '/') {
				if (stream.eat('*')) {
					state.tokenize = tokenComment;
					return tokenComment(stream, state);
				} else if (stream.eat('/')) {
					stream.skipToEnd();
					return ret('comment', 'comment');
				} else if (/\/[\W\w]+\//.test(stream.string)) {
					readRegexp(stream);
					stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
					return ret('regexp', 'string-2');
				} else {
					stream.eatWhile(operatorCharRegex);
					return ret('operator', 'operator', stream.current());
				}
			} else if (operatorCharRegex.test(ch)) {
				stream.eatWhile(operatorCharRegex);
				const w = stream.current();
				// eslint-disable-next-line no-prototype-builtins
				const k = keywords.propertyIsEnumerable(w) && keywords[w];
				if (k) {
					return ret(k.type, k.style, w);
				}
				return ret(w, 'errorOperator');
			} else if (ch === '[') {
				state.tokenize = tokenLongProperty();
				return state.tokenize(stream, state);
			} else if (ch === '@') {
				state.tokenize = tokenVariable();
				return state.tokenize(stream, state);
			} else if (wordRE.test(ch)) {
				if (ch === 'i') {
					stream.eatWhile(wordRE);
					const res = checkIsNullExpression(stream);
					if (res) {
						return res;
					} else {
						return checkKeyWords(stream);
					}
				} else {
					return checkKeyWords(stream);
				}
			}
			return null;
		};

		const checkIsNullExpression = function (stream: StringStream): string | null {
			const word = stream.current();
			let known, newWord;
			if (/is/ig.test(word) && stream.eatSpace()) {
				stream.eatWhile(wordRE);
				newWord = stream.current();
				if (/is null/ig.test(newWord)) {
					newWord = newWord.toLowerCase();
					// eslint-disable-next-line no-prototype-builtins
					known = keywords.propertyIsEnumerable(newWord) && keywords[newWord];
					if (known) {
						return ret(known.type, known.style, newWord);
					}
				} else {
					if (/is not/ig.test(newWord) && stream.eatSpace()) {
						stream.eatWhile(wordRE);
						const res = checkIsNotNullExpression(stream);
						if (res) {
							return res;
						}
					}
				}
			}
			backUpTo(stream, 'is');
			return null;
		};

		const checkIsNotNullExpression = function (stream: StringStream) {
			let word = stream.current(), known;
			if (/is not null/ig.test(word)) {
				word = word.toLowerCase();
				// eslint-disable-next-line no-prototype-builtins
				known = keywords.propertyIsEnumerable(word) && keywords[word];
				if (known) {
					return ret(known.type, known.style, word);
				}
			}
			backUpTo(stream, 'is');
			return;
		};

		const backUpTo = function (stream: StringStream, backToWord: string) {
			const word = stream.current();
			const backLen = word.length - backToWord.length;
			stream.backUp(backLen);
		};

		const checkKeyWords = function (stream: StringStream) {
			stream.eatWhile(wordRE);
			// take long property like object.description
			while (stream.eat('.')) {
				stream.eatWhile(wordRE);
			}
			const word = stream.current();
			let known;
			if (word === 'not') {
				const isSpace = stream.eatSpace();
				if (isSpace) {
					stream.eatWhile(wordRE);
					let newWord = stream.current();
					if (/not like|not exists/ig.test(newWord)) {
						newWord = newWord.toLowerCase();
						// eslint-disable-next-line no-prototype-builtins
						known = keywords.propertyIsEnumerable(newWord) && keywords[newWord];
						if (known) {
							return ret(known.type, known.style, newWord);
						}
					}
				}
				backUpTo(stream, 'not');
			}

			// eslint-disable-next-line no-prototype-builtins
			known = keywords.propertyIsEnumerable(word) && keywords[word];
			if (known) {
				return ret(known.type, known.style, word);
			}

			return ret('property', 'property');
		};

		const tokenString = function (quote: string) {
			return function (stream: StringStream, state: IFilterScriptState) {
				let escaped = false, next;
				while ((next = stream.next())) {
					if (next === quote && !escaped) {
						break;
					}
					escaped = !escaped && next === '\\';
				}
				if (!escaped) {
					state.tokenize = tokenBase;
				}
				return ret('string', 'string');
			};
		};

		const tokenLongProperty = function () {
			return function (stream: StringStream, state: IFilterScriptState) {
				let next;
				while ((next = stream.next())) {
					if (next === ']' || next === '[') {
						break;
					}
				}
				state.tokenize = tokenBase;
				return ret('property', 'property');
			};
		};

		const tokenVariable = function () {
			return function (stream: StringStream, state: IFilterScriptState) {
				let next = stream.next();
				if (next === '[') {
					while ((next = stream.next())) {
						if (next === ']' || next === '[') {
							break;
						}
						if (next === ' ') {
							stream.backUp(1);
							break;
						}
					}
					state.tokenize = tokenBase;
					return ret('variable', 'variable');
				} else {
					if (next === ' ' || next === ']') {
						if (next === ' ') {
							stream.backUp(1);
						}
					} else {
						while ((next = stream.next())) {
							if (next === ']' || next === '[') {
								break;
							}
							if (next === ' ') {
								stream.backUp(1);
								break;
							}
						}
					}
					state.tokenize = tokenBase;
					return ret('variable', 'variable');
				}
			};
		};

		const tokenComment = function (stream: StringStream, state: IFilterScriptState) {
			let maybeEnd = false, ch;
			while ((ch = stream.next())) {
				if (ch === '/' && maybeEnd) {
					state.tokenize = tokenBase;
					break;
				}
				maybeEnd = (ch === '*');
			}
			return ret('comment', 'comment');
		};

		return {
			token: tokenBase,
			startState(indentUnit: number): IFilterScriptState {
				return {
					tokenize: tokenBase
				};
			},
			copyState(state: IFilterScriptState): IFilterScriptState {
				return {
					tokenize: state.tokenize
				};
			}
		} as StreamParser<IFilterScriptState>;
}
