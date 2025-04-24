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
	IModelImportPropertyProcessorEntity
} from '../model/entities/entities';
import { ModelAdministrationModelImportProfileDataService } from './model-import-profile-data.service';

/**
 * The data service for the model import property processor entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationModelImportPropertyProcessorDataService
	extends DataServiceFlatLeaf<IModelImportPropertyProcessorEntity, IModelImportProfileEntity, IModelImportProfileComplete> {

	private readonly importProfileDataSvc = inject(ModelAdministrationModelImportProfileDataService);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const importProfileDataSvc = inject(ModelAdministrationModelImportProfileDataService);

		super({
			apiUrl: 'model/administration/importpropprocessor',
			readInfo: {
				endPoint: 'list'
			},
			createInfo: {
				prepareParam: () => importProfileDataSvc.getProfileParentCreationInfo()
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelImportPropertyProcessorEntity, IModelImportProfileEntity, IModelImportProfileComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ImportPropertyProcessors',
				parent: inject(ModelAdministrationModelImportProfileDataService)
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
