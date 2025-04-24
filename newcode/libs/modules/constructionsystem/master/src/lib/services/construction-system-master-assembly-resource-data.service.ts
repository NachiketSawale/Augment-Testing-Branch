/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { MainDataDto } from '@libs/basics/shared';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { IEstLineItemEntity } from '@libs/estimate/assemblies';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyResourceDataService extends DataServiceFlatLeaf<IEstResourceEntity, IEstLineItemEntity, CosMasterComplete> {
	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<IEstResourceEntity> = {
			//todo: in angularJs, the Assembly Assignment container and Assembly Resource container are use the same API endpoint in dataService??? and parentService is Header?
			apiUrl: 'constructionsystem/master/assembly',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstResourceEntity, IEstLineItemEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosAssembly',
				parent: parentService,
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

	public override isParentFn(parentKey: IEstLineItemEntity, entity: IEstResourceEntity): boolean {
		return entity.EstLineItemFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the assembly resource data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IEstResourceEntity[] {
		const dto = new MainDataDto<IEstResourceEntity>(loaded);
		return dto.getValueAs('dtos') as IEstResourceEntity[];
	}
}
