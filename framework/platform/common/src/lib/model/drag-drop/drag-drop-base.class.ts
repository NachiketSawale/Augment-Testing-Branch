/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropDataBase } from '../../interfaces/drag-drop-data-base.interface';
import { DragDropConnection } from './drag-drop-connection.class';
import { IDragDropTarget } from '../../interfaces/drag-drop-target.interface';


/**
 * Base clas of all module drop service classes of module level. Provides basic functionality
 * @typeParam S - The generic type representing the source(dragged) data object, T - The generic type representing the target data object
 */

export abstract class DragDropBase<T extends object> {

	/**
	 * DragDropBase constructor
	 * @param type to identify container in platform drag drop service, normally use container uuid
	 * @protected
	 */
	protected constructor(public readonly type: string) {
	}


	/**
	 * The evaluation of the draggable object must be overridden by the module itself.
	 */
	public canDrag(draggedDataInfo: IDragDropDataBase<T> | null): boolean {
		throw new Error('This function must be overwritten to get canDrag information');
	}

	public get dragDropConnections(): DragDropConnection<object, T>[] {
		return [];
	}

	public canDrop(draggedDataInfo: IDragDropDataBase<object>, dropTarget: IDragDropTarget<T>): boolean {
		if (this.dragDropConnections.length > 0) {
			const sourceConnection = this.dragDropConnections.find(c => c.sourceType === draggedDataInfo.type);
			if (sourceConnection) {
				return sourceConnection.canDrop(draggedDataInfo, dropTarget);
			}
		}

		return false;
	}

	public drop(draggedDataInfo: IDragDropDataBase<object>, dropTarget: IDragDropTarget<T>): void {
		if (this.dragDropConnections.length > 0) {
			const sourceConnection = this.dragDropConnections.find(c => c.sourceType === draggedDataInfo.type);
			if (sourceConnection) {
				return sourceConnection.drop(draggedDataInfo, dropTarget);
			}
		}
	}

	/**
	 * Text info shown on drag indicator
	 * @param draggedData
	 */
	public dragDropTextInfo(draggedData: IDragDropDataBase<object>): string | number | { text: string; number?: number } {
		// Default text, can be overwritten
		return draggedData.data.length;
	}
}