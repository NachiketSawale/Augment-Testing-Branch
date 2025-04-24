/*
 * Copyright(c) RIB Software GmbH
 */
import { IDragDropAction  } from './drag-drop-action.interface';
import { IDraggedDataInfo } from './dragged-data-info.interface';
import { IDragDropTarget } from './drag-drop-target.interface';
import { DragDropActionType } from '../utils/model/drag-drop-action-type.enum';

/**
 * Represents the state of a drag-and-drop operation.
 * This interface holds all relevant information about the current
 * drag-and-drop process, including details about the dragged data, the
 * target area, and the actions available etc.
 * @template S - The type of the data being dragged.
 * @template T - The type of the data involved in the drop target.
 */
export interface IDragDropState<S extends object, T extends object> {
	/**
	 * The current drag drop target, if any.
	 */
	currentTarget: IDragDropTarget<T> | null;

	/**
	 * Information about the currently dragged data.
	 */
	currentDragInfo: IDraggedDataInfo<S> | null;

	/**
	 * A boolean flag indicating whether the current drag operation can be dropped.
	 */
	canDrop: boolean;

	/**
	 * The current action associated with the drag-and-drop operation, such as
	 * 'copy', 'move', or other actions
	 */
	currentAction: IDragDropAction | null;

	/**
	 * The current text shown in drag indicator
	 */
	currentText: string | null;

	/**
	 * Preferred actions for the drag-and-drop operation.
	 */
	preferredActions: { [key in DragDropActionType]: boolean };

	/**
	 * A boolean flag indicating whether a drag operation is currently in progress.
	 */
	isDragging: boolean;

	/**
	 * Identifier for the source of the drag, typically used to distinguish between
	 * different drag sources.
	 */
	sourceId: string | undefined;
}