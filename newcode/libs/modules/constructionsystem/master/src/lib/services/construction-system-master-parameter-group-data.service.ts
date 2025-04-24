/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterGroupDataService extends DataServiceFlatLeaf<ICosParameterGroupEntity, ICosHeaderEntity, CosMasterComplete> {
	public constructor(private cosMasterHeaderDataService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosParameterGroupEntity> = {
			apiUrl: 'constructionsystem/master/parametergroup',
			roleInfo: <IDataServiceChildRoleOptions<ICosParameterGroupEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosParameterGroup',
				parent: cosMasterHeaderDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
		};

		super(options);
	}

	protected override onCreateSucceeded(loaded: ICosParameterGroupEntity): ICosParameterGroupEntity {
		const totalList = this.getList();
		let maxSortingValue = 0;

		if (totalList.length > 0) {
			maxSortingValue = Math.max(...totalList.map((item) => item.Sorting));
		}

		loaded.Sorting = maxSortingValue + 1;
		return loaded;
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosParameterGroupEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}
}
