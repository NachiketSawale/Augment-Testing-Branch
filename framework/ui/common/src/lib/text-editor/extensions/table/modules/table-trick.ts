/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import { Delta } from 'quill/core';

import { IEditorDialogResult, StandardDialogButtonId } from '../../../../dialogs';
import { ITextEditorSettings } from '../../../model/interfaces/text-editor-settings.interface';

import { TableBody } from '../formats/table-body';
import { TableCell } from '../formats/table-cell';
import { TableContainer } from '../formats/table-container';
import { TableRow } from '../formats/table-row';
import { tableId } from '../formats/utils';
import { ICellDialogOptions, IPosition } from '../model/text-editor-table.interface';
import { TableContains } from '../model/table-contains.enum';
import { ITableModuleOption } from '../model/table-module.interface';

/**
 * Handling the table operation
 */
export class TableTrick {
	/**
	 * Text editor Object
	 */
	public static textEditor: Quill;

	/**
	 * Table Option
	 */
	public static options: ITableModuleOption;

	/**
	 * custom settings
	 */
	public static customSettings: ITextEditorSettings;

	/**
	 * isTableToolClose
	 */
	public static isTableToolClose = true;

	/**
	 * this function is prepared the HTML DIV element
	 *
	 * @returns HTML DIV element
	 */
	public static getOverlay(): HTMLElement {
		const overlay = Object.assign(this.options.renderer.createElement('div'), {
			className: 'ql-table-toolbar toolbar',
			innerHTML:
				'<div class="dropdown">' +
				'<button type="button" id="add" class="dropdown-toggle tlb-icons ico-table-add"  title="' +
				this.options.addTableOptions +
				'"></button>' +
				'<div class="dropdown-content" id="dropdown-content-add">' +
				'<div id="addRowAbove">' +
				this.options.addRowAbove +
				'</div>' +
				'<div id="addRowBelow">' +
				this.options.addRowBelow +
				'</div>' +
				'<div id="addColBefore">' +
				this.options.addColumnBefore +
				'</div>' +
				'<div id="addColAfter">' +
				this.options.addColumnAfter +
				'</div></div>' +
				'<button type="button" id="delete" class="dropdown-toggle tlb-icons ico-table-delete"  title="' +
				this.options.deleteTableOptions +
				'"></button>' +
				'<div class="dropdown-content" id="dropdown-content-delete">' +
				'<div id="deleteRow">' +
				this.options.deleteRow +
				'</div>' +
				'<div id="deleteColumn">' +
				this.options.deleteColumn +
				'</div>' +
				'<div id="deleteTable">' +
				this.options.deleteTable +
				'</div></div>' +
				'<button type="button" id="border" class="dropdown-toggle tlb-icons ico-table-border"  title="' +
				this.options.tableBorderSetting +
				'"></button>' +
				'<div class="dropdown-content" id="dropdown-content-border">' +
				'<div id="showVBorder">' +
				this.options.showVBorder +
				'</div>' +
				'<div id="showHBorder">' +
				this.options.showHBorder +
				'</div>' +
				'<div id="showAllBorders">' +
				this.options.showAllBorders +
				'</div>' +
				'<div id="noBorder">' +
				this.options.noBorder +
				'</div>' +
				'</div>' +
				'<button type="button" id="cellEditor" class="tlb-icons ico-cell-editor" title="' +
				this.options.cellEditor +
				'"></button>',
		});

		overlay.addEventListener('click', (event: Event) => {
			const elementId = (event.target as Element).id;
			switch (elementId) {
				case 'add':
					this.toggelHandler(elementId);

					break;
				case 'delete':
					this.toggelHandler(elementId);

					break;
				case 'border':
					this.toggelHandler(elementId);

					break;
				case 'deleteRow':
					this.deleteRow();
					break;
				case 'deleteColumn':
					this.deleteColumn();
					break;
				case 'deleteTable':
					this.deleteTable();
					break;
				case 'addRowAbove':
					this.insertRowAbove();
					break;
				case 'addRowBelow':
					this.insertRowBelow();
					break;
				case 'addColBefore':
					this.insertColumnLeft();
					break;
				case 'addColAfter':
					this.insertColumnRight();
					break;
				case 'showVBorder':
					this.show_vertical_border(this.textEditor);
					break;
				case 'showHBorder':
					this.show_horizontal_border(this.textEditor);
					break;
				case 'showAllBorders':
					this.show_all_border(this.textEditor);
					break;
				case 'noBorder':
					this.show_no_border(this.textEditor);

					break;
				case 'cellEditor':
					this.toggelHandler(elementId);
					this.showCellPropertiesDialog();

					break;
				default:
					break;
			}
		});
		return overlay;
	}

	/**
	 * this function handle the toggle dropdown function
	 *
	 * @param elementId selected element id
	 */
	public static toggelHandler(elementId: string) {
		const ids = ['add', 'delete', 'border'];
		ids.forEach((id) => {
			if (this.options.elementRef.nativeElement.querySelector('#dropdown-content-' + id) as HTMLElement) {
				if (elementId === id) {
					(this.options.elementRef.nativeElement.querySelector('#dropdown-content-' + id) as HTMLElement).classList.toggle('show');
				} else {
					(this.options.elementRef.nativeElement.querySelector('#dropdown-content-' + id) as HTMLElement).classList.remove('show');
				}
			}
		});
	}

	/**
	 * This function insert table in text editor
	 *
	 * @param rows max row count
	 * @param columns max column count
	 * @returns void
	 */
	public static insertTable(rows: number, columns: number) {
		const range = this.textEditor.getSelection();
		if (range == null) {
			return;
		}
		//TODO: The commented unit  will be used in the future when the WysiwygEditorSettingsService is developed.
		const data = this.customSettings;
		//let unit='';
		let tableWidthValue: number = 0;
		if (data.user.useSettings) {
			//unit = data.user.unitOfMeasurement;
			tableWidthValue = data.user.documentWidth;
		} else {
			//unit = data.system.unitOfMeasurement;
			tableWidthValue = data.system.documentWidth;
		}

		const tableWidth = tableWidthValue;
		//TODO:table width calculate from WysiwygEditorSettingsService
		const td_width = tableWidth / columns;
		const indexVal = range.index === 0 ? range.index : range.index + 1;
		let delta = new Delta().retain(indexVal).insert('\n');
		delta = new Array(rows).fill(0).reduce((memo) => {
			const text = new Array(columns).fill('\n').join('');
			return memo.insert(text, { table: { id: tableId(), width: td_width } });
		}, new Delta().retain(indexVal));

		this.textEditor.updateContents(delta, Quill.sources.USER);
		this.textEditor.setSelection(indexVal, Quill.sources.SILENT);

		this.balanceTables();

		const [table] = this.getTable();
		TableTrick.show_overlay(this.textEditor.container, this.table_position(table?.domNode as HTMLElement));
		this.textEditor.insertText(indexVal, '');
	}

	/**
	 * Table balance cells
	 */
	public static balanceTables() {
		this.textEditor.scroll.descendants(TableContainer).forEach((table) => {
			table.balanceCells();
		});
	}

	/**
	 * The table toolbar show function
	 * @param container table conatienr
	 * @param position
	 */
	public static show_overlay(container: HTMLElement, position: IPosition) {
		if (!this.isTableToolClose) {
			this.hide_overlay(container);
		}

		const [table] = this.getTable();
		if (table) {
			const width = Math.round((table.domNode as HTMLElement).clientWidth * 0.264583);
			this.setToolbarBtnVisibility(false);
			const dropdown = this.getOverlay();
			container.appendChild(dropdown);
			const toolbar = document.getElementsByClassName('ql-table-toolbar');
			if (toolbar && toolbar.length) {
				(toolbar[0] as HTMLElement).style.top = (position.top as number) + container.scrollTop - 35 + 'px';
				(toolbar[0] as HTMLElement).style.left = position.left + 'px';
				(toolbar[0] as HTMLElement).style.marginLeft = position.marginLeft + 'px';
				const scrollMargin = container.scrollHeight > container.clientHeight ? 18 : 0;
				(toolbar[0] as HTMLElement).style.width = width + 'mm';
				(toolbar[0] as HTMLElement).style.marginRight = (position.marginRight as number) + scrollMargin + 'px';
			}
			this.isTableToolClose = false;
		}
	}

	/**
	 * Hide the Table Toolbar overlay
	 *
	 * @param container selected Table HTML Element
	 */
	public static hide_overlay(container: HTMLElement) {
		this.setToolbarBtnVisibility(true);
		this.toggelHandler('');

		if (this.options.elementRef.nativeElement.querySelectorAll('.ql-table-toolbar')) {
			const overlay = this.options.elementRef.nativeElement.querySelectorAll('.ql-table-toolbar');
			if (overlay && (overlay[0] as HTMLElement).parentNode) {
				if ((overlay[0] as HTMLElement).parentNode === container) {
					container.removeChild(overlay[0]);
				}
			}
			this.isTableToolClose = true;
		}
	}

	/**
	 * set the button visibility
	 *
	 * @param isVisible button visiable
	 */
	public static setToolbarBtnVisibility(isVisible: boolean) {
		const tableEle = this.options.elementRef.nativeElement.querySelector('.ql-table');
		if (tableEle) {
			const toolbar = tableEle.parentElement;
			if (toolbar) {
				toolbar.style.display = isVisible ? 'inline-block' : 'none';
			}
		}
	}

	/**
	 * This function used for close all dropdown
	 */
	public static closeAllDropdowns() {
		this.toggelHandler('');
	}

	/**
	 * The delete the table column
	 *
	 */
	public static deleteColumn() {
		const [table, , cell] = this.getTable();
		if (cell == null) {
			return;
		}

		table.deleteColumn(cell.cellOffset());
		this.textEditor.update(Quill.sources.USER);
		TableTrick.hide_overlay(this.textEditor.container);
	}

	/**
	 * The table delete row
	 */
	public static deleteRow() {
		const [, row] = this.getTable();
		if (row == null) {
			return;
		}
		row.remove();
		this.textEditor.update(Quill.sources.USER);
		TableTrick.hide_overlay(this.textEditor.container);
	}

	/**
	 * Table delete
	 */

	public static deleteTable() {
		const [table] = this.getTable();
		if (table == null) {
			return;
		}

		const offset = table.offset();

		table.remove();

		this.textEditor.update(Quill.sources.USER);
		this.textEditor.setSelection(offset, Quill.sources.SILENT);
		TableTrick.hide_overlay(this.textEditor.container);
	}

	/**
	 * set the table border
	 *
	 * @param {Quill} editor text editor object
	 * @param option table option
	 */
	public static set_table_border(editor: Quill, option: string) {

		const [, , , table] = this.getTable();
		if (table) {
			table.domNode.childNodes.forEach((tr) => {
				tr.childNodes.forEach((td) => {
					(td as HTMLElement).style.borderStyle = 'solid';
					if (option === TableContains.border_all || option === TableContains.border_no) {
						(td as HTMLElement).style.borderWidth = option === TableContains.border_all ? '1px' : '0px';
					} else {
						(td as HTMLElement).style.borderWidth = option === TableContains.border_hr ? '1px 0px' : '0px 1px';
					}
				});
			});
			this.hide_overlay(editor.container);
		}
	}

	/**
	 * show all border
	 *
	 * @param {Quill} editor editor object
	 */
	public static show_all_border(editor: Quill) {
		this.set_table_border(editor, TableContains.border_all);
	}

	/**
	 * show horizontal border
	 *
	 * @param {Quill} editor editor Object
	 */
	public static show_horizontal_border(editor: Quill) {
		this.set_table_border(editor, TableContains.border_hr);
	}

	/**
	 * show no border
	 *
	 * @param {Quill} editor editor Object
	 */
	public static show_no_border(editor: Quill) {
		this.set_table_border(editor, TableContains.border_no);
	}

	/**
	 * show vertical border
	 *
	 * @param {Quill} editor editor Object
	 */
	public static show_vertical_border(editor: Quill) {
		this.set_table_border(editor, TableContains.border_vr);
	}

	/**
	 * Insert column in table
	 * @param offset number
	 */
	public static insertColumn(offset: number) {
		const range = this.textEditor.getSelection();
		if (!range) {
			return;
		}
		const [table, row, cell] = this.getTable(range);
		if (cell == null) {
			return;
		}
		const column = cell.cellOffset();
		table.insertColumn(column + offset);
		this.textEditor.update(Quill.sources.USER);
		let shift = row.rowOffset();
		if (offset === 0) {
			shift += 1;
		}
		this.textEditor.setSelection(range.index + shift, range.length, Quill.sources.SILENT);
		this.hide_overlay(this.textEditor.container);
		this.setStyleProperties();
	}

	/**
	 * Set style Properties
	 */
	public static setStyleProperties() {
		const range = this.textEditor.getSelection();
		const [, row, , tableBody] = this.getTable(range);
		const data = this.customSettings;
		let unit = '';
		let tableWidthValue: number = 0;
		if (data.user.useSettings) {
			unit = data.user.unitOfMeasurement;
			tableWidthValue = data.user.documentWidth;
		} else {
			unit = data.system.unitOfMeasurement;
			tableWidthValue = data.system.documentWidth;
		}
		console.log(unit);
		const tableWidth = tableWidthValue;
		//TODO table width calculate from
		const td_width = tableWidth / (row?.children.length as number);
		tableBody?.children.forEach((tr) => {
			tr.children.forEach((td) => {
				td.domNode.style.width = td_width + 'px';
			});
		});
	}

	/**
	 * Insert Column After
	 */
	public static insertColumnLeft() {
		this.insertColumn(0);
	}

	/**
	 * Insert Column Before
	 */
	public static insertColumnRight() {
		this.insertColumn(1);
	}

	/**
	 * Insert Row Table
	 *
	 * @param offset number
	 */
	public static insertRow(offset: number) {
		const range = this.textEditor.getSelection();
		if (!range) {
			return;
		}
		const [table, row, cell] = this.getTable(range);
		if (cell == null) {
			return;
		}
		const index = row.rowOffset();
		table.insertRow(index + offset);
		this.textEditor.update(Quill.sources.USER);
		if (offset > 0) {
			this.textEditor.setSelection(range, Quill.sources.SILENT);
		} else {
			this.textEditor.setSelection(range.index + row.children.length, range.length, Quill.sources.SILENT);
		}

		this.hide_overlay(this.textEditor.container);
		this.setStyleProperties();
	}

	/**
	 * Insert Row Above
	 */
	public static insertRowAbove() {
		this.insertRow(0);
	}

	/**
	 * Insert Row Below
	 */
	public static insertRowBelow() {
		this.insertRow(1);
	}

	/**
	 *  set tabele postition
	 *
	 * @param table table HTMLElement
	 * @returns table dom position
	 */
	public static table_position(table: HTMLElement): IPosition {
		const tableDimensions = table.getBoundingClientRect();

		let offsetParent=table.offsetParent;
		let parentOffsetTop=0;
		let parentOffsetLeft=0;

		while(offsetParent && offsetParent!==document.body){
			parentOffsetTop+=(offsetParent as HTMLElement).offsetTop;
			parentOffsetLeft+=(offsetParent as HTMLElement).offsetLeft;

			parentOffsetTop+=parseInt(window.getComputedStyle(offsetParent).borderTopWidth ||'0',10);
			parentOffsetLeft+=parseInt(window.getComputedStyle(offsetParent).borderLeftWidth ||'0',10);
			offsetParent=(offsetParent as HTMLElement).offsetParent;
		}

		const topPosition=(tableDimensions.top)-parentOffsetTop+window.scrollY;
		const leftPosition=(tableDimensions.left)-parentOffsetLeft+window.scrollX;

		const editorStyle = window.getComputedStyle(table.parentElement as HTMLElement);
		const editorMarginLeft = editorStyle.marginLeft ? parseFloat(editorStyle.marginLeft) : 0;
		const editorMarginRight = editorStyle.marginRight ? parseFloat(editorStyle.marginRight) : 0;
		const position = { top: topPosition, left: leftPosition, marginLeft: editorMarginLeft, marginRight: editorMarginRight };
		return position;
	}

	/**
	 * set the cursor postion
	 */
	public static goToInsertTextCursorPosition() {
		const range = this.textEditor.getSelection();
		if (range == null) {
			return;
		}
		const indexVal = range.index === 0 ? range.index : range.index + 1;
		this.textEditor.insertText(indexVal, '');
	}

	/**
	 * This functio is used for get the current table , body ,row and cell object
	 *
	 * @param range selected editor range
	 * @returns get the current table , body ,row and cell object
	 */
	public static getTable(range = this.textEditor.getSelection()): [null, null, null, null, -1] | [TableContainer, TableRow, TableCell, TableBody, number] {
		if (range == null) {
			return [null, null, null, null, -1];
		}
		const [cell, offset] = this.textEditor.getLine(range.index);
		if (cell == null || cell.statics.blotName !== TableCell.blotName) {
			return [null, null, null, null, -1];
		}
		const row = cell.parent;
		const table = row.parent.parent;
		const tableBody = row.parent;
		return [table as TableContainer, row as TableRow, cell as TableCell, tableBody as TableBody, offset];
	}

	/**
	 * Show Cell Properties Dialog
	 */
	public static showCellPropertiesDialog() {
		const [, row, cell] = this.getTable();
		const td = cell?.domNode as HTMLElement;
		const tr = row?.domNode as HTMLElement;
		const width = td.style.width ? td.style.width : td.clientWidth;
		// const oldValue = (width as string).slice(-2);
		//TODO depends on platformWysiwygEditorSettingsService
		//let oldUnit = quill.options.modules.table.platformWysiwygEditorSettingsService.getUnitValue(oldValue);
		const value = parseFloat(width as string);
		//TODO depends on platformWysiwygEditorSettingsService
		//let cellWidth = quill.options.modules.table.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, oldUnit ? oldUnit : 'px', value);
		const cellWidth = value;
		const borderWidth = td.style.borderWidth ? td.style.borderWidth : 1;
		const borderColor = td.style.borderColor ?? '';
		const horizontal = td.style.textAlign !== '' ? td.style.textAlign : tr.style.textAlign !== '' ? tr.style.textAlign : 'left';
		const cellProperties: ICellDialogOptions = {
			cellWidth: cellWidth,
			borderWidth: borderWidth,
			borderColor: borderColor,
			horizontal: horizontal,
		};
		const cellPropertiesfn = this.options.showCellPropertiesDialog(cellProperties) as Promise<IEditorDialogResult<ICellDialogOptions>>;
		cellPropertiesfn.then((response) => {
			if (response.closingButtonId === StandardDialogButtonId.Ok) {
				const [, , cell] = this.getTable();
				const td = cell?.domNode as HTMLElement;

				//TODO depends on platformWysiwygEditorSettingsService
				//TODo Below logic will be used in future
				// let unit='';
				// if (this.options.user.useSettings) {
				//   unit = this.options.user.unitOfMeasurement;
				// }else {
				//   unit = this.options.system.unitOfMeasurement;
				// }
				//let width = this.options.platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, response.value?.cellWidth);
				td.style.textAlign = (response.value as ICellDialogOptions).horizontal;
				td.style.borderWidth = (response.value as ICellDialogOptions).borderWidth + 'pt';
				//TODO Border color depend on Color domain control , this domain control not working proper way
			}
		});
	}
}
