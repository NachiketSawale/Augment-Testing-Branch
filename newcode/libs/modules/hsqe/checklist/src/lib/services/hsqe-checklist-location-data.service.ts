/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { HsqeChecklistDataService } from './hsqe-checklist-data.service';
import { CheckListComplete, IHsqCheckList2LocationEntity, IHsqCheckListEntity } from '@libs/hsqe/interfaces';

export const HSQE_CHECKLIST_LOCATION_DATA_TOKEN = new InjectionToken<HsqeChecklistLocationDataService>('hsqeChecklistLocationGridDataToken');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLocationDataService extends DataServiceFlatLeaf<IHsqCheckList2LocationEntity, IHsqCheckListEntity, CheckListComplete> {
	public constructor(private hsqeChecklistDataService: HsqeChecklistDataService) {
		const options: IDataServiceOptions<IHsqCheckList2LocationEntity> = {
			apiUrl: 'hsqe/checklist/location',
			roleInfo: <IDataServiceChildRoleOptions<IHsqCheckList2LocationEntity, IHsqCheckListEntity, CheckListComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Location',
				parent: hsqeChecklistDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
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
		this.processor.addProcessor(this.readOnlyProcessor());
	}

	private readOnlyProcessor() {
		return {
			process: (item: IHsqCheckList2LocationEntity) => {
				this.setEntityReadOnly(item, this.hsqeChecklistDataService.isItemReadOnly());
			},
			revertProcess() {},
		};
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.hsqeChecklistDataService.isItemReadOnly();
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.hsqeChecklistDataService.isItemReadOnly();
	}

	public override isParentFn(parentKey: IHsqCheckListEntity, entity: IHsqCheckList2LocationEntity): boolean {
		return entity.HsqCheckListFk === parentKey.Id;
	}
}
