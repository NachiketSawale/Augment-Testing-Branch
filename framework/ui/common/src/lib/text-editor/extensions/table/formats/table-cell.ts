/*
 * Copyright(c) RIB Software GmbH
 */
import Quill from 'quill';
import type TypeBlock from 'quill/blots/block';

import { tableId } from './utils';
import { TableRow } from './table-row';

/**
 * Quill Block
 */
const Block = Quill.import('blots/block') as typeof TypeBlock;

/**
 * Genrate text editor Table Cell Block
 */
export class TableCell extends Block {
	/**
	 * Bolt Name
	 */
	public static override blotName = 'table';

	/**
	 * Tag Name
	 */
	public static override tagName = 'TD';

	/**
	 * This function to create the html element and set the id ans width
	 *
	 * @param value
	 * @returns {HTMLElement} return HTMLElement
	 */
	public static override create(value: { id: string; width: number }): HTMLElement {
		const node = super.create() as HTMLElement;
		if (value) {
			node.setAttribute('data-row', value.id);
		} else {
			node.setAttribute('data-row', tableId());
		}
		node.style.width = value.width + 'px';

		return node;
	}

	/**
	 * This function check the attribute and return the attribute value
	 *
	 * @param domNode HtmlElement Node
	 * @returns attribute value
	 */
	public static override formats(domNode: HTMLElement) {
		if (domNode.hasAttribute('data-row')) {
			return domNode.getAttribute('data-row');
		}
		return undefined;
	}

	/**
	 * Next of current cell
	 */
	public declare next: this | null;

	/**
	 * check the parent exist then get the childer index position
	 *
	 * @returns index position
	 */
	public cellOffset(): number {
		if (this.parent) {
			return this.parent.children.indexOf(this);
		}
		return -1;
	}

	/**
	 * This function is set the attribute and format the DOM node
	 *
	 * @param name bolt name
	 * @param value cell id
	 */
	public override format(name: string, value: string) {
		if (name === TableCell.blotName && value) {
			this.domNode.setAttribute('data-row', value);
		} else {
			super.format(name, value);
		}
	}

	/**
	 * Get the table Row
	 *
	 * @returns table row
	 */
	public row(): TableRow {
		return this.parent as TableRow;
	}

	/**
	 * get the row offset position
	 *
	 * @returns row offest position
	 */
	public rowOffset(): number {
		if (this.row()) {
			return this.row().rowOffset();
		}
		return -1;
	}

	/**
	 * get the parent node like table conatiner
	 * @returns Parent node
	 */
	public table() {
		return this.row() && this.row().table();
	}
}
