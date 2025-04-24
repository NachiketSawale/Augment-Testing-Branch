/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IHsqChkListTemplateEntity, IHsqChkListTemplate2FormEntity, CheckListTemplateComplete } from '@libs/hsqe/interfaces';
import { CheckListTemplateHeaderDataService } from './checklist-template-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ChecklistTemplateFormDataService extends DataServiceFlatLeaf<IHsqChkListTemplate2FormEntity, IHsqChkListTemplateEntity, CheckListTemplateComplete> {
	public constructor(private parentService: CheckListTemplateHeaderDataService) {
		const options: IDataServiceOptions<IHsqChkListTemplate2FormEntity> = {
			apiUrl: 'hsqe/checklisttemplate/form',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IHsqChkListTemplate2FormEntity, IHsqChkListTemplateEntity, CheckListTemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'HsqChkListTemplate2Form',
				parent: parentService,
			},
		};

		super(options);
	}

	public updateTemporaryCheckListId = false;

	protected override provideLoadPayload() {
		const parent = this.getSelectedParent();
		if (parent) {
			return { mainItemId: parent.Id };
		} else {
			throw new Error('There should be a selected parent Material record to load the Certificates data');
		}
	}

	protected override onLoadSucceeded(loaded: IHsqChkListTemplate2FormEntity[]) {
		if (this.updateTemporaryCheckListId) {
			this.updateTemporaryCheckListId = false;
			const chkListTemplate2FormEntities = this.getList();
			for (let i = 0; i < loaded.length; i++) {
				const currentEntity = chkListTemplate2FormEntities.find((e) => {
					return e.Id === loaded[i].Id;
				});
				if (currentEntity) {
					loaded[i].TemporaryCheckListId = currentEntity.TemporaryCheckListId;
				}
			}
		}
		return loaded;
	}

	protected override onCreateSucceeded(created: IHsqChkListTemplate2FormEntity) {
		const selectedItem = this.parentService.getSelectedEntity();
		if (selectedItem) {
			created.HsqChklisttemplateFk = selectedItem.Id;
		}
		return created;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: CheckListTemplateComplete, modified: IHsqChkListTemplate2FormEntity[], deleted: IHsqChkListTemplate2FormEntity[]) {
		if (modified.length > 0) {
			parentUpdate.HsqChkListTemplate2FormToSave = modified;
			parentUpdate.MainItemId = modified[0].HsqChklisttemplateFk;
		}
		if (deleted.length > 0) {
			parentUpdate.HsqChkListTemplate2FormToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].HsqChklisttemplateFk;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: CheckListTemplateComplete) {
		return complete.HsqChkListTemplate2FormToSave ?? [];
	}

	public override isParentFn(parentKey: IHsqChkListTemplateEntity, entity: IHsqChkListTemplate2FormEntity) {
		return entity.HsqChklisttemplateFk === parentKey.Id;
	}
}
