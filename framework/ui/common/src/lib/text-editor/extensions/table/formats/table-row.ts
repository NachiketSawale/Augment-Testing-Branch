/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import type { Parchment as TypeParchment } from 'quill';

import { TableCell } from './table-cell';

/**
 *  Container blot
 */
const Container = Quill.import('blots/container') as typeof TypeParchment.ContainerBlot;

/**
 * Genrate text editor Table Row
 */
export class TableRow extends Container {
	/**
	 * Bolt Name
	 */
	public static override blotName = 'table-row';

	/**
	 * Tag Name
	 */
	public static override tagName = 'TR';

	/**
	 * Currnet Bolt Childern's
	 */
	public declare children: TypeParchment.LinkedList<TableCell>;

	/**
	 * current next bolt
	 */
	public declare next: this | null;

	/**
	 * Genrate the current table row bolt
	 *
	 * @param value table row attribute
	 * @returns HTMLElement of current table row
	 */
	public static override create(value: string) {
		const node = super.create() as HTMLElement;
		return node;
	}

	/**
	 *  This function used for check merge bolt
	 *
	 * @returns check table merge or not
	 */
	public override checkMerge() {
		if (super.checkMerge() && this.next?.children.head != null) {
			const thisHead = this.children.head?.formats() ?? { table: {} };

			const thisTail = this.children.tail?.formats() ?? { table: {} };

			const nextHead = this.next.children.head.formats() ?? { table: {} };

			const nextTail = this.next.children.tail?.formats() ?? { table: {} };

			return thisHead['table'] === thisTail['table'] && thisHead['table'] === nextHead['table'] && thisHead['table'] === nextTail['table'];
		}
		return false;
	}

	/**
	 * optimize current bolt
	 */

	public override optimize() {
		super.optimize({});
		this.children.forEach((child) => {
			if (child.next == null) {
				return;
			}
			const childFormats = child.formats();
			const nextFormats = child.next.formats();
			if (childFormats['table'] !== nextFormats['table']) {
				const next = this.splitAfter(child);
				if (next) {
					next.optimize({});
				}

				if (this.prev) {
					this.prev.optimize({});
				}
			}
		});
	}

	/**
	 * get Row Offset value
	 *
	 * @returns row offset value
	 */
	public rowOffset(): number {
		if (this.parent) {
			return this.parent.children.indexOf(this);
		}
		return -1;
	}

	/**
	 * get current selected table bolt
	 *
	 * @returns table bolt
	 */
	public table(): TypeParchment.Parent {
		return this.parent && this.parent.parent;
	}
}
