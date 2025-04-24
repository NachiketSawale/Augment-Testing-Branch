/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { CosLineItemComplete } from '@libs/constructionsystem/interfaces';
import { CosMainComplete } from '../model/entities/cos-main-complete.class';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import {ICosEstLineItemEntity} from '../model/entities/cos-est-lineitem-entity.interface';
export const CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_DATA_TOKEN = new InjectionToken<ConstructionSystemMainLineItemDataService>('constructionsystemMainLineItemDataToken');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItemDataService extends DataServiceFlatNode<ICosEstLineItemEntity, CosLineItemComplete, ICosInstanceEntity, CosMainComplete> {
	public constructor(private parentService: ConstructionSystemMainInstanceDataService) {
		const options: IDataServiceOptions<ICosEstLineItemEntity> = {
			apiUrl: 'constructionsystem/main/lineitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosEstLineItemEntity, ICosInstanceEntity, CosMainComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstLineItems',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: true },
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const selectedObjs = this.parentService.getSelection();
		if(selectedObjs.length === 0) {
			throw new Error('There should be a selected parent instance to load the line item data');
		}
			const firstObj = selectedObjs[0];
			const payload: { InsHeaderId: number; InstanceId: number; InstanceIds?: number[] } = {
				InsHeaderId: firstObj.InstanceHeaderFk,
				InstanceId: firstObj.Id,
			};
			if (selectedObjs.length > 1) {
				payload.InstanceIds = selectedObjs.map((obj) => obj.Id);
			}
		return payload;
	}

	protected override onLoadSucceeded(loaded: CosLineItemComplete): ICosEstLineItemEntity[] {
		/// todo basicsCostGroupAssignmentService is not ready
		// $injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
		// 	basicsCostGroupAssignmentService.process(readData, service, {
		// 		mainDataName: 'dtos',
		// 		attachDataName: 'LineItem2CostGroups',
		// 		dataLookupType: 'LineItem2CostGroups',
		// 		identityGetter: function identityGetter(entity) {
		// 			return {
		// 				EstHeaderFk: entity.RootItemId,
		// 				Id: entity.MainItemId
		// 			};
		// 		}
		// 	});
		// }]);
		return loaded.LineItems ?? [];
	}

	private isParentReadOnly() {
		const parentEntity = this.parentService.getSelectedEntity();
		return !parentEntity || !!parentEntity.IsUserModified;
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.isParentReadOnly();
	}
}
///todo dynamic column related dev-30398
