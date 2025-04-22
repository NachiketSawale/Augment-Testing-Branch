/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';

import { TableCell } from '../formats/table-cell';
import { TableRow } from '../formats/table-row';
import { TableBody } from '../formats/table-body';
import { TableContainer } from '../formats/table-container';

import Toolbar from 'quill/modules/toolbar';
import { TableTrick } from './table-trick';
import { ITableModuleOption } from '../model/table-module.interface';

/**
 * Text editor Table Module
 */
export default class TextEditorTableModule {
	/**
	 * Table Toolbar element Id list
	 */
	public tableToolbarIdList = ['addRowAbove', 'addRowBelow', 'addColBefore', 'addColBefore'];

	/**
	 * Register the table related things
	 */
	public register() {
		TableContainer.allowedChildren = [TableBody];
		TableBody.requiredContainer = TableContainer;

		TableBody.allowedChildren = [TableRow];
		TableRow.requiredContainer = TableBody;

		TableRow.allowedChildren = [TableCell];
		TableCell.requiredContainer = TableRow;

		Quill.register(TableCell);
		Quill.register(TableRow);
		Quill.register(TableBody);
		Quill.register(TableContainer);
	}

	public constructor(
		public textEditor: Quill,
		options: ITableModuleOption,
	) {
		this.register();

		const toolbar = this.textEditor.getModule('toolbar') as Toolbar;
		TableTrick.textEditor = this.textEditor;
		TableTrick.options = options;
		TableTrick.customSettings = options.customSettings;

		if (toolbar) {
			toolbar.addHandler('table', (value) => {
				if (value.includes('newtable_')) {
					const sizes = value.split('_');
					const row_count = Number.parseInt(sizes[1]);
					const col_count = Number.parseInt(sizes[2]);
					TableTrick.insertTable(row_count, col_count);
				}
			});
		}

		textEditor.root.addEventListener('click', (e) => {
			const range = textEditor.getSelection();

			TableTrick.closeAllDropdowns();
			if (range && range?.length === 0) {
				const element = document.elementFromPoint(e.clientX, e.clientY);
				if (!(element as Element).closest('table') && !(element as Element).classList.contains('ql-table-toolbar') && !this.tableToolbarIdList.includes((element as Element).id)) {
					if (!TableTrick.isTableToolClose) {
						TableTrick.hide_overlay(textEditor.container);
					}
				}
				if ((element as Element).closest('table') || (element as Element).closest('tr') || (element as Element).closest('td')) {
					const [table] = TableTrick.getTable();
					TableTrick.show_overlay(this.textEditor.container, TableTrick.table_position(table?.domNode as HTMLElement));
				}
			}
		});
	}
}
