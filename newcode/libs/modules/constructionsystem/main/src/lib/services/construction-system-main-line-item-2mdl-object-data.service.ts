/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IEstLineItem2MdlObjectEntity, IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMainLineItemDataService } from './construction-system-main-line-item-data.service';
import { CosLineItemComplete } from '@libs/constructionsystem/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItem2MdlObjectDataService extends DataServiceFlatLeaf<IEstLineItem2MdlObjectEntity, IEstLineItemEntity, CosLineItemComplete> {
	public constructor(private parentService: ConstructionSystemMainLineItemDataService) {
		const options: IDataServiceOptions<IEstLineItem2MdlObjectEntity> = {
			apiUrl: 'estimate/main/lineitem2mdlobject',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyselection',
				usePost: true,
				prepareParam: () => {
					const parentSelected = parentService.getSelectedEntity();
					return {
						EstHeaderFk: parentSelected?.EstHeaderFk,
						EstLineItemFk: parentSelected?.Id,
					};
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createlineitemobject',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				apiUrl: 'estimate/main/lineitem',
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstLineItem2MdlObjectEntity, IEstLineItemEntity, CosLineItemComplete>>({
				role: ServiceRole.Leaf,
				itemName: 'EstLineItem2MdlObject',
				parent: parentService,
			}),
		};

		super(options);
	}

	private getParentSelected() {
		return this.parentService.getSelectedEntity();
	}

	protected override provideCreatePayload(): object {
		const parentSelected = this.getParentSelected();
		// TODO: get selected model
		//const selectedModel = modelViewerModelSelectionService.getSelectedModel();
		return {
			EstHeaderFk: parentSelected?.EstHeaderFk,
			EstLineItemFk: parentSelected?.Id,
			// TODO: add MdlModelFk
			//MdlModelFk: selectedModel?.modelId,
		};
	}

	// TODO: showModelViewer
	// public showModelViewer(){
	// 	modelViewerStandardFilterService.updateMainEntityFilter();
	// }
}
