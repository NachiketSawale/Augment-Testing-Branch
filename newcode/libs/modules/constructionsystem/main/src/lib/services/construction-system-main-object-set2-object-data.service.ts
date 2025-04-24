/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { IObjectSet2ObjectEntity } from '../model/entities/object-set-2-object-entity.interface';
import { ICosMainObjectSetEntity } from '../model/entities/cos-main-object-set-entity.interface';
import { ConstructionSystemMainObjectSetDataService } from './construction-system-main-object-set-data.service';
import { IObjectSetComplete } from '../model/entities/object-set-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectSet2ObjectDataService extends DataServiceFlatLeaf<IObjectSet2ObjectEntity, ICosMainObjectSetEntity, IObjectSetComplete> {
	private readonly instanceService = inject(ConstructionSystemMainInstanceDataService);

	public constructor(private parentService: ConstructionSystemMainObjectSetDataService) {
		const options: IDataServiceOptions<IObjectSet2ObjectEntity> = {
			apiUrl: 'model/main/objectset2object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyobjectset',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IObjectSet2ObjectEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'ObjectSet2Object',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
	}

	private getParentSelected() {
		return this.parentService.getSelectedEntity();
	}

	protected override provideLoadPayload(): object {
		const parentSelected = this.getParentSelected();
		return {
			projectId: parentSelected?.ProjectFk,
			objectSetId: parentSelected?.Id,
			modelId: this.instanceService?.getCurrentSelectedModelId(),
		};
	}
}
