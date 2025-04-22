/*
 * Copyright(c) RIB Software GmbH
 */

import { Tooltip, showTooltip } from '@codemirror/view';
import { StateField, EditorState } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import { FilterScriptDefOptions } from '../models/interfaces/filter-script-def-options.interface';

function filterScriptHintTooltipField(filterScriptOptions: FilterScriptDefOptions){
	const options = filterScriptOptions;

	function getFilterScriptHintTooltips(state: EditorState): readonly (Tooltip | null)[] {
		return state.selection.ranges
			.filter(range => range.empty)
			.map(range => {
				// const line = state.doc.lineAt(range.head);
				let start = range.head;
				const end = range.head;
				const nodeTree = syntaxTree(state);
				let cursor = nodeTree.cursorAt(range.head);

				while (cursor && cursor.name === 'Document' && start > 0) {
					start -= 1;
					cursor = nodeTree.cursorAt(start);
				}
				if (!cursor || !cursor.node) {
					return null;
				}

				let currentNode: SyntaxNode | null = cursor.node;
				let found = false;
				let isKeyword = false;
				do {
					if (currentNode && (currentNode.name === 'method' || currentNode.name === 'propertyName')) {
						found = true;
						break;
					}
					if (currentNode && currentNode.name == 'keyword') {
						isKeyword = true;
						break;
					}
					if (currentNode.prevSibling) {
						currentNode = currentNode.prevSibling;
					} else {
						break;
					}
				} while (currentNode);

				if (!found || isKeyword) {
					return null;
				}

				let content : HTMLElement;
				const tokenString = state.sliceDoc(currentNode.from, currentNode.to);
				if (currentNode.name === 'method') {
					const method = options.filterDef.methods[tokenString];
					const cls = 'CodeMirror-Tern-';
					content = elt('span', null, elt('span', cls + 'fname', method.name), '(');
					for (let i = 0; i < method.params.length; ++i) {
						if (i) {
							content.appendChild(document.createTextNode(', '));
						}
						const arg = method.params[i];
						content.appendChild(elt('span', cls + 'farg', arg.name));
						content.appendChild(document.createTextNode(':\u00a0'));
						content.appendChild(elt('span', cls + 'type', arg.type));
					}

					content.appendChild(document.createTextNode(')'));

					return {
						pos: range.head,
						end,
						above: false,
						strictSide: false,
						arrow: true,
						create() {
							return { dom :content };
						}
					};
				} else if (currentNode.name === 'propertyName') {
					const props = options.properties;
					let propName = '', tips = '';
					for (const p in props) {
						if (props[p].text === tokenString) {
							propName = props[p].name;
							if (tips) {
								tips += ' or ';
							}
							tips += props[p].description;
						}
					}

					if (propName) {
						content = elt('span', '', elt('strong', null, propName), ' (' + tips + ')');
						return {
							pos: range.head,
							end,
							above: false,
							strictSide: true,
							arrow: true,
							create() {
								return {
									dom :content
									};
							}
						};
					}
				}

				return null;
			});
	}

	return StateField.define<readonly (Tooltip | null)[]>({
		create: getFilterScriptHintTooltips,

		update(tooltips, tr) {
			if (!tr.docChanged && !tr.selection) {
				return tooltips;
			}
			return getFilterScriptHintTooltips(tr.state);
		},

		provide: f => showTooltip.computeN([f], state => state.field(f))
	});
}

function elt(tagName: string, className?: string | null, ...args: (string | HTMLElement)[]):HTMLElement {
	const e = document.createElement(tagName);

	if (className) {
		e.className = className;
	}

	for (const elt of args) {
		if (typeof elt === 'string') {
			e.appendChild(document.createTextNode(elt));
		}else{
			e.appendChild(elt);
		}
	}
	return e;
}

export function filterScriptHintTooltip(filterScriptOptions: FilterScriptDefOptions) {
	return [filterScriptHintTooltipField(filterScriptOptions)];
}