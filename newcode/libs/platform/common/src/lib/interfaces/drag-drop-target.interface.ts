/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Platform drag-drop target in a drag-and-drop operation.
 * @template T - The data type of the target object.
 */
export interface IDragDropTarget<T extends object> {

	/**
	 * A unique identifier for the drag-drop target.
	 */
	id: string;

	/**
	 * The area or region where the drop action is allowed. This can be a DOM element,
	 * a virtual area, or any object representing the drag/drop zone.
	 */
	area?: object;

	/**
	 * An array of data objects in the target that will be dropped on
	 */
	data?: T[];
}