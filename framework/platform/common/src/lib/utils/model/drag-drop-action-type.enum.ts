/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum representing the types of actions that can be performed in a drag-and-drop operation.
 */
export enum DragDropActionType {
	/** Move the object from one location to another.*/
	Move = 1,
	/** Copy the object to a new location.*/
	Copy = 2,
	/** Create a reference or shortcut to the object in another container, without moving or copying the original object.*/
	Link = 3
}
