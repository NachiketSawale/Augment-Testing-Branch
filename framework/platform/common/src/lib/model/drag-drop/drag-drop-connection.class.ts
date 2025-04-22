/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropDataBase } from '../../interfaces/drag-drop-data-base.interface';
import { IDragDropTarget } from '../../interfaces/drag-drop-target.interface';
import { DragDropActionType } from '../../utils/model/drag-drop-action-type.enum';

export abstract class DragDropConnection<S extends object, T extends object> {
	protected constructor(public readonly sourceType: string, public readonly targetType: string) {
	}

	// TODO: Switch case for different actions
	public abstract canDrop(draggedData: IDragDropDataBase<S>, dropTarget: IDragDropTarget<T>): boolean;
	public abstract drop(draggedData: IDragDropDataBase<S>, dropTarget: IDragDropTarget<T>): void;
	public abstract allowedActionTypes(draggedDataInfo: IDragDropDataBase<S> | null): DragDropActionType[];
}