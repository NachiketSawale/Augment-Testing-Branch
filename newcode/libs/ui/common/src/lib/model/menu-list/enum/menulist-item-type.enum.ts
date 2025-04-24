/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum defining all available menu list types
 *
 * @group Menu List
 */

export enum ItemType {
	/**
	 * Menulist item type 'item'
	 */
	Item = 'item',

	/**
	 * Menulist item type 'check'
	 */
	Check = 'check',

	/**
	 * Menulist item type 'sublist'
	 */
	Sublist = 'sublist',

	/**
	 * Menulist item type 'radio'
	 */
	Radio = 'radio',

	/**
	 * Menulist item type 'divider'
	 * Please double-check whether you are not actually defining a sublist of items (which will
	 * automatically be displayed with dividers).
	 */
	Divider = 'divider',

	/**
	 * Menulist item type 'overflow'
	 */
	OverflowBtn = 'overflow-btn',

	/**
	 * Menulist item type 'dropdown'
	 */
	DropdownBtn = 'dropdown-btn',

	/**
	 * Menulist item type 'file select'
	 */
	FileSelect = 'file-select',

	/**
	 * Menulist item type 'action-select-btn'
	 */
	ActionSelectBtn = 'action-select-btn'
}

/**
 * Checks whether a given menu list item type denotes a sub-list of some sort.
 * @param type The type to check.
 *
 * @group Menu List
 */
export function isGroupItemType(type: ItemType): type is ItemType.Sublist | ItemType.DropdownBtn {
	switch (type) {
		case ItemType.Sublist:
		case ItemType.DropdownBtn:
			return true;
		default:
			return false;
	}
}