/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { DragDropActionType } from '../utils/model/drag-drop-action-type.enum';

/**
 * Interface representing a drag-and-drop action.
 */
export interface IDragDropAction {
	/**
	 * The unique identifier for the action. It has been already defined by enum 'DragDropActionType'
	 */
	type: DragDropActionType;

	/**
	 * The priority of the action.
	 * Lower numbers indicate higher priority. Actions are sorted based on this value.
	 * Example: 1 for the highest priority action.
	 */
	priority: number;

	/**
	 * The CSS class used to display an icon representing the action.
	 * Example: 'ico-drag-move', 'ico-drag-copy', etc.
	 */
	iconClass: string;
}
