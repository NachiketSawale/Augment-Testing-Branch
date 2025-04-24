import { ConstructionSystemMainInstance2ObjectDataService } from './construction-system-main-instance2-object-data.service';
import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInstance2ObjectEntity, IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';
import { Instance2ObjectComplete } from '../model/entities/instance-2-object-complete.class';
import { get, isNull, isUndefined } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstance2ObjectParamDataService extends DataServiceFlatLeaf<IInstance2ObjectParamEntity, IInstance2ObjectEntity, Instance2ObjectComplete> {
	public constructor(private cosMainHeaderDataService: ConstructionSystemMainInstance2ObjectDataService) {
		const options: IDataServiceOptions<IInstance2ObjectParamEntity> = {
			apiUrl: 'constructionsystem/main/instance2objectparam',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<IInstance2ObjectParamEntity, IInstance2ObjectEntity, Instance2ObjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Instance2ObjectParam',
				parent: cosMainHeaderDataService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parentItem = this.cosMainHeaderDataService.getSelectedEntity();
		if (!isNull(parentItem) && !isUndefined(parentItem) && parentItem.InstanceFk && parentItem.ObjectFk) {
			return {
				InstanceId: parentItem.InstanceFk,
				ModelObjectId: parentItem.ObjectFk,
				Instance2ObjectId: parentItem.Id,
			};
		} else {
			return {
				InstanceId: -1,
				ModelObjectId: -1,
				Instance2ObjectId: -1,
			};
		}
	}

	protected override onLoadSucceeded(loaded: object): IInstance2ObjectParamEntity[] {
		if (loaded) {
			return get(loaded, 'Main', loaded as IInstance2ObjectParamEntity[]);
		}
		return [];
	}

	public override isParentFn(parentKey: IInstance2ObjectEntity, entity: IInstance2ObjectParamEntity): boolean {
		return parentKey.Id === entity.Instance2ObjectFk;
	}
}