/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemsSharedGlobalParameterGroupDataService, ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';

/**
 * Global Parameter Group entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterGroupDataService extends ConstructionSystemsSharedGlobalParameterGroupDataService<ICosGlobalParamGroupEntity, CosMasterComplete> {
	public constructor() {
		const options = {
			apiUrl: 'constructionsystem/master/globalparametergroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createdto',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletedto',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatedto',
			},
			roleInfo: <IDataServiceRoleOptions<ICosGlobalParamGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'CosParameterGroupDto',
			},
		};
		super(options);
	}

	public override createUpdateEntity(modified: ICosGlobalParamGroupEntity | null): CosMasterComplete {
		const complete = new CosMasterComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosGlobalParamGroupToSave = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CosMasterComplete): ICosGlobalParamGroupEntity[] {
		if (!complete.CosGlobalParamGroupToSave) {
			return [];
		}

		return [complete.CosGlobalParamGroupToSave];
	}
}
