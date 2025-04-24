/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropData } from '@libs/ui/business-base';
import { DragDropActionType, DragDropConnection, IDragDropTarget } from '@libs/platform/common';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';

export class BasicsCostCodesConnection extends DragDropConnection<ICostCodeEntity, ICostCodeEntity> {

	private readonly basicsCostCodesDataService: BasicsCostCodesDataService;

	public constructor(basicsCostCodesDataService: BasicsCostCodesDataService) {
		super('ceeb3a8d7f3e41aba9aa126c7a802f87', 'ceeb3a8d7f3e41aba9aa126c7a802f87');
		this.basicsCostCodesDataService = basicsCostCodesDataService;
	}

	public override canDrop(draggedDataInfo: IDragDropData<ICostCodeEntity>, dropTarget: IDragDropTarget<ICostCodeEntity>): boolean {
		if (draggedDataInfo.data.length > 0 && Array.isArray(dropTarget?.data) && dropTarget.data?.length > 0) {
			if (draggedDataInfo.data.some(item => dropTarget.data?.includes(item))) {
				return false;
			}
		}
		return true;
	}

	public override drop(draggedData: IDragDropData<ICostCodeEntity>, dropTarget: IDragDropTarget<ICostCodeEntity>) {

		this.basicsCostCodesDataService.dropCostCodeRecord(draggedData, dropTarget);
	}

	public override allowedActionTypes(draggedDataInfo: IDragDropData<ICostCodeEntity> | null): DragDropActionType[] {
		return [DragDropActionType.Copy];
	}

}