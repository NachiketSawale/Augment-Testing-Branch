/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import type { Parchment as TypeParchment } from 'quill';

import { TableBody } from './table-body';
import { TableRow } from './table-row';
import { TableCell } from './table-cell';
import { tableId } from './utils';
import { TableTrick } from '../modules/table-trick';

/**
 * Container blot
 */
const Container = Quill.import('blots/container') as typeof TypeParchment.ContainerBlot;

/**
 * Genrate text editor Table Container
 */
export class TableContainer extends Container {
	/**
	 * Bolt Name
	 */
	public static override blotName = 'table-container';

	/**
	 * Tag Name
	 */
	public static override tagName = 'TABLE';

	/**
	 * List of table childer
	 */
	public declare children: TypeParchment.LinkedList<TableBody>;

	/**
	 * Create Table bolt
	 *
	 * @param value table custom value
	 * @returns HTMLElement table bolt
	 */
	public static override create(value: string): HTMLElement {
		const node = super.create() as HTMLElement;
		node.addEventListener('click', function (e) {
			const table = e.currentTarget as HTMLElement;
			if (table) {
				const position = TableTrick.table_position(table);

				TableTrick.show_overlay((table.parentElement as HTMLElement).parentNode as HTMLElement, position);
			}
		});

		return node;
	}

	/**
	 * check the table balance Cells and append child bolt
	 */
	public balanceCells() {
		const rows = this.descendants(TableRow);
		const maxColumns = rows.reduce((max, row) => {
			return Math.max(row.children.length, max);
		}, 0);
		rows.forEach((row) => {
			new Array(maxColumns - row.children.length).fill(0).forEach(() => {
				let value;
				if (row.children.head != null) {
					value = TableCell.formats(row.children.head.domNode);
				}
				const blot = this.scroll.create(TableCell.blotName, value);
				row.appendChild(blot);

				blot.optimize({});
			});
		});
	}

	/**
	 * Get the table cells
	 *
	 * @param column poistion
	 * @returns table cells
	 */
	public cells(column: number): TableCell[] {
		return this.rows().map((row) => row.children.at(column)) as TableCell[];
	}

	/**
	 * this function delete the column
	 *
	 * @param index currnet position column
	 */
	public deleteColumn(index: number) {
		const [body] = this.descendant(TableBody, 0) as TableBody[];
		if (body == null || body.children.head == null) {
			return;
		}
		body.children.forEach((row) => {
			const cell = row.children.at(index);
			if (cell != null) {
				cell.remove();
			}
		});
	}

	/**
	 * This functiono is used for Insert Column in table
	 *
	 * @param index current position
	 */
	public insertColumn(index: number) {
		const [body] = this.descendant(TableBody, 0) as TableBody[];
		if (body == null || body.children.head == null) {
			return;
		}
		body.children.forEach((row) => {
			const ref = row.children.at(index);

			const id = TableCell.formats((ref as TableCell).domNode);
			const value = { id: id ?? tableId(), width: 40 };
			const cell = this.scroll.create(TableCell.blotName, value);
			row.insertBefore(cell, ref);
		});
	}

	/**
	 * This funcion is used for insert row in the table
	 *
	 * @param index current position
	 */
	public insertRow(index: number) {
		const [body] = this.descendant(TableBody, 0) as TableBody[];
		if (body == null || body.children.head == null) {
			return;
		}
		const id = tableId();
		const row = this.scroll.create(TableRow.blotName) as TableRow;
		body.children.head.children.forEach(() => {
			const cell = this.scroll.create(TableCell.blotName, { id: id, width: 40 });
			row.appendChild(cell);
		});
		const ref = body.children.at(index);
		body.insertBefore(row, ref);
	}

	/**
	 * The function is return rable row's
	 *
	 * @returns Table Row array
	 */
	public rows(): TableRow[] {
		const body = this.children.head;
		if (body == null) {
			return [];
		}
		return body.children.map((row) => row);
	}
}
