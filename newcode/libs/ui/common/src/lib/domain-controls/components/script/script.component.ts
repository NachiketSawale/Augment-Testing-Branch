/*
 * Copyright(c) RIB Software GmbH
 */

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { PropertyType } from '@libs/platform/common';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { IScriptControlContext } from '../../model/script-control-context.interface';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor, lineNumbers } from '@codemirror/view';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldKeymap, LanguageSupport, StreamLanguage } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { CodemirrorLanguageModes } from '../../../model/script/codemirror-language-modes.enum';
import { StyleSpec } from 'style-mod';

/**
 * Represents an input control for scripts.
 */
@Component({
	selector: 'ui-common-script',
	templateUrl: './script.component.html',
	styleUrls: ['./script.component.scss'],
})
export class ScriptComponent extends DomainControlBaseComponent<PropertyType, IScriptControlContext> implements AfterViewInit, OnDestroy {

	@ViewChild('editorField', { static: false })
	private editorField: ElementRef<HTMLInputElement> = {} as ElementRef;
	private view!: EditorView;
	private languageModeMap: Map<number, (LanguageSupport | StreamLanguage<unknown>)> = new Map([
		[CodemirrorLanguageModes.JavaScript, javascript()],
		[CodemirrorLanguageModes.Json, json()],
		[CodemirrorLanguageModes.Xml, xml()]
	]);

	/**
	 * Initializes component with control context
	 */
	public constructor() {
		super();
	}

	/**
	 * This method is invoked once the view has been initialized.
	 */
	public ngAfterViewInit(): void {
		this.initializeEditorView();
	}

	/**
	 * This method is invoked once the component is destroyed.
	 */
	public ngOnDestroy(): void {
		this.view?.destroy();
	}

	private initializeEditorView(): void {
		const editorFieldElement = this.editorField.nativeElement;

		// Listener that emits the updated value
		const updateListenerExtension = EditorView.updateListener.of((update: ViewUpdate) => {
			if (update.docChanged) {
				this.controlContext.value = update.state.doc.toString();
			}
		});

		// Get language mode based on passed input
		const languageMode = this.languageModeMap.get(this.controlContext.editorOptions.languageMode)!;

		const editorOptions: { [selector: string]: StyleSpec } = {
			'&': { height: 'auto' },
			'.cm-scroller': { overflow: 'auto' },
			'.cm-activeLine, .cm-line': {
				height: 'auto',
				whiteSpace: 'pre-wrap',
				wordWrap: 'break-word',
				overflowY: 'auto'
			}
		};
		this.controlContext.editorOptions.isInputOutput ? (editorOptions['.cm-scroller'])['minHeight'] = '150px' : null;

		// editor theme
		const fixedHeightEditor = this.controlContext.editorOptions.multiline ? EditorView.theme(
			editorOptions
		) : [];

		const textBorder: Extension = this.controlContext.editorOptions.enableBorder ? EditorView.theme({
			'&': {
				border: '1px solid #c0c0c0'
			}
		}) : [];

		// basicSetup
		const myExt: Extension = [
			this.controlContext.editorOptions.enableLineNumbers ? lineNumbers() : [],
			textBorder,
			EditorState.readOnly.of(this.controlContext.editorOptions.readOnly),
			EditorState.transactionFilter.of(tr => tr.newDoc.lines > 1 && !this.controlContext.editorOptions.multiline ? [] : tr),
			languageMode,
			fixedHeightEditor,
			highlightSpecialChars(),
			history(),
			drawSelection(),
			dropCursor(),
			indentOnInput(),
			syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			bracketMatching(),
			closeBrackets(),
			autocompletion(),
			rectangularSelection(),
			crosshairCursor(),
			this.controlContext.editorOptions.enableLineNumbers ? highlightActiveLine() : [],//blue background issue
			highlightSelectionMatches(),
			keymap.of([
				...closeBracketsKeymap,
				...defaultKeymap,
				...searchKeymap,
				...historyKeymap,
				...foldKeymap,
				...completionKeymap,
				...lintKeymap
			]),
			syntaxHighlighting(defaultHighlightStyle),
			updateListenerExtension];

		let state!: EditorState;
		const docItems = this.controlContext.value?.toString();

		try {
			state = EditorState.create({
				doc: docItems,
				extensions: myExt
			});
		} catch (e) {
			// TODO: replace with code to handle errors.
			console.error(e);
		}

		this.view = new EditorView({
			state,
			parent: editorFieldElement
		});
	}
}
