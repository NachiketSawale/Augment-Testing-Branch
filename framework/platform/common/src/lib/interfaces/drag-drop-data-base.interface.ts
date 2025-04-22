/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropAction } from './drag-drop-action.interface';

export interface IDragDropDataBase<T extends object>{

	/**
	 * A string representing the type of the data. This is useful for distinguishing
	 * between different types (containers) of data being dragged and dropped.
	 */
	type: string;

	/**
	 * An array of data items of type T that are involved in the drag-and-drop operation.
	 */
	data: T[];

	/**
	 * The action associated with this drag-and-drop operation.
	 * This could represent actions like 'copy', 'move', etc., represented as enum `DragDropActionType`.
	 */
	actions: IDragDropAction[];

	// itemService: //  not sure whether it's needed
}