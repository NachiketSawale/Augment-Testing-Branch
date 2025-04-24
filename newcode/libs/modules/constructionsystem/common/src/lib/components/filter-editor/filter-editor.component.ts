/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { lineNumbers } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { autocompletion, CompletionContext, CompletionSource } from '@codemirror/autocomplete';
import { linter, Diagnostic } from '@codemirror/lint';

@Component({
	selector: 'constructionsystem-common-filter-editor',
	templateUrl: './filter-editor.component.html',
	styleUrls: ['./filter-editor.component.scss']
})
export class FilterEditorComponent implements AfterViewInit {
	@ViewChild('container')
	private container!: ElementRef;
	public view?: EditorView;
	public state!: EditorState;
	public doccontent: string = '';

	public get value() {
		return this.doccontent;
	}

	public constructor() {
		this.state = EditorState.create({
			doc: this.doccontent,
			extensions: [
				basicSetup,
				autocompletion({
					override: [
						this.customHint
					]
				})
			]
		});
	}

	public onSaveAsSelectionStatement() {
		//todo: implement autocompletion of codemirror6 ?
		// if ($scope.searchOptions.active === true) {
		// 	let filterObj = {
		// 		filterType: $scope.searchOptions.searchType,
		// 		filterText: $scope.searchOptions.filterRequest.pattern
		// 	};
		//
		// 	filterDataService.setSelectedFilter($scope.parentServiceName, filterObj);
		// 	if (mainDataService.hasSelection()) {
		// 		let item = mainDataService.getSelected();
		// 		item.SelectStatement = estimateMainSelStatementFilterEditorTranslateService.getSelStatementToSave(filterObj.filterText);
		// 		mainDataService.markItemAsModified(item);
		// 	}
		// }
	}

	public ngAfterViewInit(): void {
		this.view = this.createView();
	}

	public createView() {
		return new EditorView({
			doc: this.doccontent,
			state: this.state,
			parent: this.container.nativeElement,
			extensions: [
				basicSetup,
				lineNumbers(),
				lintGutter(),
				javascript()
			]
		});
	}

	private customHint: CompletionSource = (context: CompletionContext) => {
		const word: { from: number, to: number, text: string } = context.matchBefore(/\w*/) || { from: 0, to: 0, text: '' };
		if (!word || word.from === word.to) {
			return null;
		}
		//todo import custom hint service
		const list = ['function', 'variable', 'class', 'module'].filter((word) =>
			word.startsWith(word)
		);

		return {
			from: word.from,
			options: list.map((name) => ({
				label: name,
				type: 'keyword'
			}))
		};
	};

	private customLinter = linter((view) => {
		const diagnostics: Diagnostic[] = [];
		const lines = view.state.doc.lines;

		for (let i = 0; i < lines; i++) {
			const line = view.state.doc.lineAt(i);
			const lineText = line.text.trim();
			//todo import custom linter service
			if (lineText && !lineText.startsWith('function')) {
				diagnostics.push({
					from: line.from,
					to: line.to,
					severity: 'error',
					message: 'Line must start with \'function'
				});
			}
		}

		return diagnostics;
	});

}
