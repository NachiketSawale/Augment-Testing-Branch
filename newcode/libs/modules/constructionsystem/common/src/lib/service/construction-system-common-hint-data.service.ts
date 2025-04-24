import { Injectable } from '@angular/core';
import {EditorState} from '@codemirror/state';
import {Tooltip} from '@codemirror/view';
import { IScriptEditorOptions, IScriptHintProvider } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { Completion } from '@codemirror/autocomplete';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonHintDataService implements IScriptHintProvider{

	public getCursorTooltips(state: EditorState): readonly Tooltip[] {
		return state.selection.ranges
			.filter(range => range.empty)
			.map(range => {
				const line = state.doc.lineAt(range.head);
				const text = line.number + ':' + (range.head - line.from);
				return {
					pos: range.head,
					above: true,
					strictSide: true,
					arrow: true,
					create: () => {
						const dom = document.createElement('div');
						dom.className = 'cm-tooltip-cursor';
						dom.textContent = text;
						return {dom};
					}
				};
			});
	}

	public getArgHints(funcName: string, index: number, argsBefore?: string[]): Observable<Completion[]> {
		return new Observable<Completion[]>(observer => {
			if (index === 0) {
				const pattern = /filterscriptHint/i;

				if (pattern.test(funcName)) {
					return;
				}
			}
			if(index === 1) {
				return;
			}

			observer.next();
			observer.complete();
		});
	}

	public filterscriptHint(editor: EditorState, options: IScriptEditorOptions) {
		//todo D:\RIB_DEV\application\frontend.ngjs\constructionsystem\common\services\filter-editor\addon\hint\filterscript-hint.js
	}

}