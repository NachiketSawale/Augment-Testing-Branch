/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IDraggedDataInfo, DragDropBase, DragDropConnection } from '@libs/platform/common';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';
import { BasicsCostCodesConnection } from './basics-cost-codes-connection.class';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesDragDropService extends DragDropBase<ICostCodeEntity> {

	private readonly basicsCostCodesDataService = inject(BasicsCostCodesDataService);

	public constructor() {
		super('ceeb3a8d7f3e41aba9aa126c7a802f87');
	}

	public override get dragDropConnections(): DragDropConnection<ICostCodeEntity, ICostCodeEntity>[] {
		return [
			new BasicsCostCodesConnection(this.basicsCostCodesDataService),
		] as DragDropConnection<ICostCodeEntity, ICostCodeEntity>[];
	}

	public override canDrag(draggedDataInfo: IDraggedDataInfo<ICostCodeEntity> | null) {
		return true;
	}

}