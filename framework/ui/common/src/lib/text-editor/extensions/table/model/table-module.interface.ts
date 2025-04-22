/*
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef, Renderer2 } from '@angular/core';
import { IEditorDialogResult } from '../../../../dialogs';
import { ITextEditorSettings } from '../../../model/interfaces/text-editor-settings.interface';
import { ICellDialogOptions } from './text-editor-table.interface';

/**
 * Tabel Module Option
 */
export interface ITableModuleOption {
	/**
	 * Add Row Above
	 */
	addRowAbove: string;
	/**
	 * Add Row Below
	 */
	addRowBelow: string;

	/**
	 * Add Column Before
	 */
	addColumnBefore: string;
	/**
	 * Add Column After
	 */
	addColumnAfter: string;

	/**
	 * Delete Row
	 */
	deleteRow: string;

	/**
	 * Delete Column
	 */
	deleteColumn: string;

	/**
	 * Delete Table
	 */
	deleteTable: string;

	/**
	 * Show Border
	 */
	showVBorder: string;

	/**
	 * Show Horizontal
	 */
	showHBorder: string;

	/**
	 * Show All Borders
	 */
	showAllBorders: string;

	/**
	 * No Border
	 */
	noBorder: string;

	/**
	 * Table Editor
	 */
	tableEditor: string;

	/**
	 * Cell Editor
	 */
	cellEditor: string;

	/**
	 * Table Option
	 */
	addTableOptions: string;

	/**
	 * Delete Table Option
	 */
	deleteTableOptions: string;

	/**
	 * Table Border Settings
	 */
	tableBorderSetting: string;

	/**
	 * Custom Setting of Table
	 */
	customSettings: ITextEditorSettings;

	/**
	 * Show Cell Properties Dialog function
	 */
	showCellPropertiesDialog: (data: ICellDialogOptions) => Promise<IEditorDialogResult<ICellDialogOptions>>;

	/**
	 * Element Refrence
	 */
	elementRef: ElementRef<Element>;

	/**
	 * Render
	 */
	renderer: Renderer2;
}
