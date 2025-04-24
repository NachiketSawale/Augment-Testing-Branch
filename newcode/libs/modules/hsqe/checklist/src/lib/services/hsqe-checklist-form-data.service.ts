/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { HsqeChecklistDataService } from './hsqe-checklist-data.service';
import { CheckListComplete, IHsqCheckListEntity, IHsqCheckList2FormEntity, IHsqChkListTemplate2FormEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistFormDataReadonlyProcessor } from '../model/processor/hsqe-checklist-form-data-readonly-processor.service';

export const HSQE_CHECKLIST_FORM_DATA_TOKEN = new InjectionToken<HsqeChecklistFormDataService>('hsqeCheckFormGridDataToken');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistFormDataService extends DataServiceFlatLeaf<IHsqCheckList2FormEntity, IHsqCheckListEntity, CheckListComplete> {
	public constructor(private hsqeChecklistDataService: HsqeChecklistDataService) {
		const options: IDataServiceOptions<IHsqCheckList2FormEntity> = {
			apiUrl: 'hsqe/checklist/form',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					return { HsqCheckListFk: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IHsqCheckList2FormEntity, IHsqCheckListEntity, CheckListComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'FormData',
				parent: hsqeChecklistDataService,
			},
		};

		super(options);
		this.processor.addProcessor(new HsqeChecklistFormDataReadonlyProcessor(this));
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: CheckListComplete, modified: IHsqCheckList2FormEntity[], deleted: IHsqCheckList2FormEntity[]) {
		if (modified.length > 0) {
			parentUpdate.FormDataToSave = modified;
			parentUpdate.MainItemId = modified[0].HsqCheckListFk;
		}
		if (deleted.length > 0) {
			parentUpdate.FormDataToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].HsqCheckListFk;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: CheckListComplete) {
		return complete.FormDataToSave ?? [];
	}

	public override isParentFn(parentKey: IHsqCheckListEntity, entity: IHsqCheckList2FormEntity) {
		return entity.HsqCheckListFk === parentKey.Id;
	}

	public override canDelete(): boolean {
		return super.canDelete() && this.getEntityEditable();
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.getEntityEditable();
	}

	private getEntityEditable() {
		return !this.hsqeChecklistDataService.isItemReadOnly();
	}

	// todo-allen: not sure whether the code is working properly.
	public addCheckListForm(entity: IHsqChkListTemplate2FormEntity, checkListEntity: IHsqCheckListEntity) {
		const item: IHsqCheckList2FormEntity = {
			Id: -entity.Id,
			Code: entity.Code,
			DescriptionInfo: entity.DescriptionInfo,
			HsqCheckListFk: checkListEntity.Id,
			FormFk: entity.BasFormFk,
			BasFormDataFk: entity.BasFormDataFk ?? 0,
			InsertedAt: entity.InsertedAt,
			InsertedBy: entity.InsertedBy
		};

		this.setModified(item);
		return item;
	}

	// todo-allen: not sure whether the code is working properly.
	public deleteCheckListForm(formList: IHsqCheckList2FormEntity[]) {
		this.clearModifications();
		this.setDeleted(formList);
	}
}
