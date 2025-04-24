/*
 * Copyright(c) RIB Software GmbH
 */

import * as $ from 'jquery';
import { IUiGridEditorArg } from './grid-editor-arg.interface';
import { EditorControlContextService } from '../services/editor-control-context.service';
import { GridRowInfo } from '@libs/ui/common';
import { UiGridEditorHostComponent } from '../components/editor-host/editor-host.component';

export class UiGridEditorBase<T extends object> {

	public constructor(args: IUiGridEditorArg<T>, private editorControlContext: EditorControlContextService<T>) {
		this.init(args);
	}

	private init(args: IUiGridEditorArg<T>) {
		let gridRowInfo = this.editorControlContext.getGridRowInfo(args.gridId, args.item);
		if (!gridRowInfo) {
			gridRowInfo = new GridRowInfo<T>(args.grid, args.grid.columns, args.item, args.grid.configuration.entityRuntimeData);
			this.editorControlContext.addGridRowInfo(args.gridId, args.item, gridRowInfo);
		}

		const editor = $('<custom-ui-grid-editor-host columnid="' + args.column.id + '"></custom-ui-grid-editor-host>');
		(editor[0] as unknown as UiGridEditorHostComponent<T>).gridRowInfo = gridRowInfo;
		const container = $(args.container);
		editor.appendTo(container);
	}

	private loadValue(item: T): void {

	}

	private isValueChanged(): boolean {
		return false;
	}

	private serializeValue(): object | undefined {
		return undefined;
	}

	private applyValue(item: T, value: object): boolean {
		return true;
	}

	private destroy(): void {

	}

	private show(): void {

	}

	private focus(): void {

	}

	private validate(): object {
		return {valid: true, msg: null};
	}
}