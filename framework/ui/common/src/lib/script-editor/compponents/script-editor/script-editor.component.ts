/*
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	OnDestroy,
	Component,
	ElementRef,
	Input,
	ViewChild,
	Output,
	EventEmitter,
	OnInit,
	inject
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript, esLint } from '@codemirror/lang-javascript';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { lineNumbers, keymap } from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { indentWithTab, indentSelection, undo, redo, toggleComment } from '@codemirror/commands';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import { openSearchPanel, gotoLine } from '@codemirror/search';

import { TernServer } from '../../model/tern-server';
import { IScriptHintProvider } from '../../model/interfaces/script-hint-provider.interface';
import { IScriptEditorConfig, IScriptEditorOptions } from '../../model/interfaces/script-editor-options.interface';
import { ScriptEditorConfigService } from '../../services/script-editor-config.service';
import { ScriptHintService } from '../../services/script-hint.service';

// use linter.mjs
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as eslint from 'eslint-linter-browserify';

/**
 * Script editor component
 */
@Component({
	selector: 'ui-common-script-editor',
	templateUrl: './script-editor.component.html',
	styleUrls: ['./script-editor.component.scss'],
})
export class UiCommonScriptEditorComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('container')
	private container!: ElementRef;

	/**
	 * Codemirror view
	 */
	public view?: EditorView;

	/**
	 * Tern server
	 */
	public ternServer: TernServer;

	private _value: string = '';

	public get value() {
		return this._value;
	}

	@Input()
	public set value(value) {
		if (this._value !== value) {
			this._value = value;

			if (this.view) {
				this.updateDocument(value);
			}
		}
	}

	@Output()
	public valueChange = new EventEmitter<string>();

	/**
	 * options
	 */
	@Input()
	public options?: IScriptEditorOptions;

	/**
	 * config
	 */
	public config!: IScriptEditorConfig;

	private readOnly = new Compartment();
	private _readonly = false;
	/**
	 * read only
	 */
	@Input()
	public set readonly(v: boolean) {
		this._readonly = v;
		if (this.view) {
			this.view.dispatch({
				effects: this.readOnly.reconfigure(EditorState.readOnly.of(v))
			});
		}
	}

	private readonly http = inject(HttpClient);
	private readonly defaultConfig = inject(ScriptEditorConfigService);
	private readonly hintService = inject(ScriptHintService);

	/**
	 * Constructor
	 */
	public constructor() {
		this.ternServer = new TernServer([]);
	}

	/**
	 * Component cycle hook
	 */
	public ngOnInit() {
		this.config = {
			...this.defaultConfig,
			...this.options
		};

		this.config.defProvider.getDefs().subscribe(defs => {
			this.ternServer = new TernServer(defs);
		});
	}

	/**
	 * Component cycle hook
	 */
	public ngAfterViewInit() {
		this.view = this.createView();
	}

	/**
	 * Component cycle hook
	 */
	public ngOnDestroy() {
		if (this.view) {
			this.view.destroy();
		}
	}

	private createView() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		const esLinter = new eslint.Linter();

		const config = {
			// eslint configuration
			parserOptions: {
				ecmaVersion: 6,
				sourceType: 'script',
				globalReturn: true,
				impliedStrict: true
			},
			env: {
				browser: true
			}
		};

		return new EditorView({
			doc: self._value,
			parent: this.container.nativeElement,
			extensions: [
				basicSetup,
				javascript(),
				autocompletion({
					override: [
						this.autoComplete()
					]
				}),
				keymap.of([indentWithTab]),
				lineNumbers(),
				lintGutter(),
				linter(esLint(esLinter, config)),
				EditorView.updateListener.of(v => {
					if (v.docChanged) {
						self._value = v.state.doc.toString();
						self.valueChange.emit(self._value);
					}
				}),
				self.readOnly.of(EditorState.readOnly.of(self._readonly))
			]
		});
	}

	private autoComplete() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		return (context: CompletionContext) => {
			const doc = context.state.doc.toString();
			const word = context.matchBefore(/\w*/);
			const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);

			if (['.', 'VariableName', 'MemberName', 'PropertyName'].indexOf(nodeBefore.type.name) !== -1) {
				return new Promise<CompletionResult>((resolve) => {
					self.ternServer.query(doc, {
						ch: context.pos,
						line: 0
					}, self.config.completeOptions).subscribe(options => {
						resolve({
							from: word!.from,
							options: options

							// options: [
							// 	{label: 'match', type: 'keyword'},
							// 	{label: 'hello', type: 'variable', info: '(World)'},
							// 	{label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro'}
							// ]

						});
					});
				});
			}

			if (nodeBefore.type.name === 'String' && nodeBefore.parent && nodeBefore.parent.type.name === 'ArgList') {
				let hintProvider: IScriptHintProvider = this.hintService;
				const args = self.resolveArgsBefore(nodeBefore, context);
				const functionName = self.resolveFunctionName(nodeBefore, context);

				if (self.options && self.options.hintProvider) {
					hintProvider = self.options.hintProvider;
				}

				return new Promise<CompletionResult>(resolve => {
					hintProvider.getArgHints(functionName, args.index, args.argsBefore).subscribe(list => {
						resolve({
							from: word!.from,
							options: list
						});
					});
				});
			}

			return null;
		};
	}

	private resolveArgsBefore(node: SyntaxNode, context: CompletionContext) {
		let index = 0;
		const argsBefore = [];

		while (node.prevSibling && node.prevSibling.type.name !== '(') {
			node = node.prevSibling;

			if (node.type.name === ',') {
				index++;
			} else {
				const argName = context.state.sliceDoc(node.from, node.to);
				argsBefore.push(argName);
			}
		}

		return {
			index: index,
			argsBefore: argsBefore
		};
	}

	private resolveFunctionName(node: SyntaxNode, context: CompletionContext) {
		const memberExp = node.parent!.prevSibling;
		const memberName = context.state.sliceDoc(memberExp!.from, memberExp!.to);
		return memberName.slice(memberName.indexOf('.') + 1);
	}

	private updateDocument(doc: string) {
		const currentValue = this.view!.state.doc.toString();
		const endPosition = currentValue.length;

		this.view!.dispatch({
			changes: {
				from: 0,
				to: endPosition,
				insert: doc
			}
		});
	}

	public test() {
		// this.ternService.createServer().request({
		// 	files: [
		// 		// @ts-ignore
		// 		{name: '[doc]', text: 'val ; function contract() {}', type: 'full'}
		// 	],
		// 	query: {
		// 		caseInsensitive: true,
		// 		docs: true,
		// 		end: {
		// 			ch: 2,
		// 			line: 0
		// 		},
		// 		file: '[doc]',
		// 		guess: false,
		// 		includeKeywords: true,
		// 		lineCharPositions: true,
		// 		type: 'completions',
		// 		types: true,
		// 		urls: true
		// 	}
		// }, (error, data) => {
		//
		// });
	}

	//------------------commands---------------------
	/**
	 * undo command
	 */
	public undo() {
		if (this.view) {
			undo({
				state: this.view.state,
				dispatch: t => {
					this.view!.dispatch(t);
				}
			});
		}
	}

	/**
	 * redo command
	 */
	public redo() {
		if (this.view) {
			redo({
				state: this.view.state,
				dispatch: t => {
					this.view!.dispatch(t);
				}
			});
		}
	}

	/**
	 * toggle comment command
	 */
	public toggleComment() {
		if (this.view) {
			toggleComment({
				state: this.view.state,
				dispatch: t => {
					this.view!.dispatch(t);
				}
			});
		}
	}

	/**
	 * indent command
	 */
	public indent() {
		if (this.view) {
			indentSelection({
				state: this.view.state,
				dispatch: t => {
					this.view!.dispatch(t);
				}
			});
		}
	}

	/**
	 * command
	 */
	public openSearchPanel() {
		if (this.view) {
			openSearchPanel(this.view);
		}
	}

	/**
	 * command
	 */
	public gotoLine() {
		if (this.view) {
			gotoLine(this.view);
		}
	}

	//------------------commands---------------------
}