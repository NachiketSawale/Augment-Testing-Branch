/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Toolbar data used to move entity item up/down.
 */
export interface IListSelectionDialogUtilityData {
	/**
	 * Total selected items.
	 */
	totalCount: number;

	/**
	 * Selected items index that needs to be moved.
	 */
	indexesToMove: number[];

	/**
	 * Function moves the item positions.
	 * @param fromIndex
	 * @param toIndex
	 */
	moveItemFunc: (fromIndex: number, toIndex: number) => void;

	/**
	 * Property to distinguish if movement is up or down.
	 */
	delta: number;
}
