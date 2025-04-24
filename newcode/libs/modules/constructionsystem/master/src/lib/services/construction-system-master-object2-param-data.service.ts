import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ICosModelObjectEntity } from '../model/entities/cos-model-object-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';
import { Injectable } from '@angular/core';

export class CosModelObjectEntityComplete extends CompleteIdentification<IInstance2ObjectParamEntity> {}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObject2ParamDataService extends DataServiceFlatLeaf<IInstance2ObjectParamEntity, ICosModelObjectEntity, CosModelObjectEntityComplete> {
	public constructor() {
		const optins: IDataServiceOptions<IInstance2ObjectParamEntity> = {
			apiUrl: 'constructionsystem/main/instance2objectparam',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createtemporaryobjectparam',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInstance2ObjectParamEntity, ICosModelObjectEntity, CosModelObjectEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ObjectParameters',
				// parent: ModelMainObjectDataService todo: ModelMainObjectDataService need to be public?
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(optins);
	}

	public override isParentFn(parentKey: ICosModelObjectEntity, entity: IInstance2ObjectParamEntity): boolean {
		//todo: use IModelObjectEntity in Model.Main, return entity.Instance2ObjectFk === parentKey.Id;
		return true;
	}
}