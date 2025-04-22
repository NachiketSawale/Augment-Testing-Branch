/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	inject
} from '@angular/core';
import { PlatformPermissionService } from '@libs/platform/common';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IModelAdministrationCompleteEntity,
	IModelAdministrationRootEntity,
	ModelAdministrationRootDataService
} from '../../root-info.model';
import {
	IModelImportProfileComplete,
	IModelImportProfileEntity
} from '../model/entities/entities';

export const GLOBAL_IMPORT_PROFILE_PERMISSION = 'ca493532bf0447788dafcb79a482cc6e';

/**
 * The data service for the model import profile entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationModelImportProfileDataService
	extends DataServiceFlatNode<IModelImportProfileEntity, IModelImportProfileComplete, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/importprf',
			readInfo: {
				endPoint: 'list',
				prepareParam: () => {
					return {};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelImportProfileEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'ModelImportProfiles',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	public override createUpdateEntity(modified: IModelImportProfileEntity | null): IModelImportProfileComplete {
		return {
			ModelImportProfiles: modified,
			MainItemId: modified?.Id,
			ImportPropertyKeyRulesToSave: null,
			ImportPropertyKeyRulesToDelete: null,
			ImportPropertyProcessorsToSave: null,
			ImportPropertyProcessorsToDelete: null
		};
	}

	public override canDelete(): boolean {
		const selProfile = this.getSelectedEntity();
		return !!selProfile && selProfile.Id > 0 && typeof selProfile.BasCompanyFk === 'number';
	}

	private readonly permissionSvc = inject(PlatformPermissionService);

	/**
	 * Indicates whether the current user is allowed to modify the global import profile.
	 */
	public get canModifyGlobal(): boolean {
		return this.permissionSvc.hasWrite(GLOBAL_IMPORT_PROFILE_PERMISSION);
	}

	/**
	 * Evaluates whether the current user is allowed to modify the selected import profile.
	 */
	public canChangeSelectedProfile(): boolean {
		const selProfile = this.getSelectedEntity();
		if (selProfile && selProfile.Id > 0) {
			return !!selProfile.BasCompanyFk ||this.canModifyGlobal;
		}
		return false;
	}

	/**
	 * Returns a creation info object for child entities.
	 */
	public getProfileParentCreationInfo(): {
		[param: string]: number
	} {
		const selProfile = this.getSelectedEntity();
		if (selProfile) {
			return {
				PKey1: selProfile.Id
			};
		} else {
			return {};
		}
	}
}
