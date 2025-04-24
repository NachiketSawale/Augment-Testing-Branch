import { Injectable } from '@angular/core';
import { DragDropBase, DragDropConnection, IDragDropDataBase } from '@libs/platform/common';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstanceConnectionClass } from './construction-system-main-instance-connection.class';


@Injectable({
	providedIn: 'root',
})
export class ConstrctionSystemMainInstanceDragDropService extends DragDropBase<ICosInstanceEntity> {
	public constructor() {
		super('90f746cdd8c64f819e89b7b6e9993536');
	}
	public override get dragDropConnections(): DragDropConnection<ICosInstanceEntity, ICosInstanceEntity>[] {
		return [new ConstructionSystemMainInstanceConnectionClass()] as DragDropConnection<ICosInstanceEntity, ICosInstanceEntity>[];
	}
	public override canDrag(draggedDataInfo: IDragDropDataBase<ICosInstanceEntity> | null): boolean {
		return true;
	}
}