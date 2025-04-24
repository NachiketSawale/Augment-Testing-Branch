/*
 * Copyright(c) RIB Software GmbH
 */
import Quill, { Parchment } from 'quill';
import { AttributorStore } from 'parchment';
import type ListItems from 'quill/formats/list';

/**
 * Quill List Item
 */
const ListItem = Quill.import('formats/list') as typeof ListItems;

export const customFontFamilyAttributor = new Parchment.StyleAttributor('custom-family-attributor', 'font-family');
export const customSizeAttributor = new Parchment.StyleAttributor('custom-size-attributor', 'font-size');
export const customColorAttributor = new Parchment.StyleAttributor('custom-color-attributor', 'color');

/**
 * custom List extend the list item functionality
 */
export class customList extends ListItem {
	/**
	 * Optimize the bolt section
	 */
	public override optimize() {
		super.optimize({});

		if (this.children.length >= 1) {
			const child = this.children.head as unknown as HTMLDataListElement;
			if ((child.attributes as unknown as AttributorStore)?.values) {
				const attributes = (child.attributes as unknown as AttributorStore).values();

				if (attributes) {
					for (const key in attributes) {
						const name = key;
						const value = attributes[key];

						if (name === 'color') {
							super.format('custom-color-attributor', value);
						} else if (name === 'font-family' || name === 'font') {
							super.format('custom-family-attributor', value);
						} else if (name === 'font-size' || name === 'size') {
							super.format('custom-size-attributor', value);
						}
					}
				}
			}
		}
	}
}
