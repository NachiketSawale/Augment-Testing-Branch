/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ICosControllingGroupEntity } from '../model/entities/cos-controlling-group-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterControllingGroupDataService extends DataServiceFlatLeaf<ICosControllingGroupEntity, ICosHeaderEntity, CosMasterComplete> {
	public constructor(private cosMasterHeaderDataService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosControllingGroupEntity> = {
			apiUrl: 'constructionsystem/master/controllinggroup',
			roleInfo: <IDataServiceChildRoleOptions<ICosControllingGroupEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosControllingGroup',
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

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosControllingGroupEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}
}
