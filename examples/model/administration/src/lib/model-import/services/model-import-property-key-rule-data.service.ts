/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	inject
} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IModelImportProfileComplete,
	IModelImportProfileEntity,
	IModelImportPropertyKeyRuleEntity
} from '../model/entities/entities';
import { ModelAdministrationModelImportProfileDataService } from './model-import-profile-data.service';

/**
 * The data service for the model improt property key rule entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationModelImportPropertyKeyRuleDataService
	extends DataServiceFlatLeaf<IModelImportPropertyKeyRuleEntity, IModelImportProfileEntity, IModelImportProfileComplete> {

	private readonly importProfileDataSvc = inject(ModelAdministrationModelImportProfileDataService);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const importProfileDataSvc = inject(ModelAdministrationModelImportProfileDataService);

		super({
			apiUrl: 'model/administration/importpkrule',
			readInfo: {
				endPoint: 'list',
				prepareParam: () => {
					const selProfile = this.getSelectedParent();
					return {
						profileId: selProfile?.Id ?? 0
					};
				}
			},
			createInfo: {
				prepareParam: () => importProfileDataSvc.getProfileParentCreationInfo()
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelImportPropertyKeyRuleEntity, IModelImportProfileEntity, IModelImportProfileComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ImportPropertyKeyRules',
				parent: importProfileDataSvc
			}
		});

		this.importProfileDataSvc = importProfileDataSvc;
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.importProfileDataSvc.canChangeSelectedProfile();
	}

	public override canDelete(): boolean {
		const selItems = this.getSelection();
		if (selItems.length > 0 && selItems.every(item => item.Id > 0)) {
			return super.canDelete() && this.importProfileDataSvc.canChangeSelectedProfile();
		}
		return false;
	}
}
