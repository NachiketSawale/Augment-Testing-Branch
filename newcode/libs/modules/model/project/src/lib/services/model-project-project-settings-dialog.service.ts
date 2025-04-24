/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IModelProjectSettingsEntity } from '../model/entities/model-project-settings-entity.interface';
import {
	FieldType,
	IFormDialogConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Provides a dialog box with model-related settings for the project.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectProjectSettingsDialogService {

	private readonly httpSvc = inject(PlatformHttpService);

	private readonly formDlgSvc = inject(UiCommonFormDialogService);

	/**
	 * Displays a dialog box to edit the saved settings.
	 *
	 * @param projectId The project ID for which to edit settings.
	 *
	 * @returns A promise that resolves to a boolean value to indicate whether the settings were changed.
	 */
	public async showDialog(projectId: number): Promise<boolean> {
		const settings = await this.httpSvc.get<IModelProjectSettingsEntity>('model/project/projectsettings/getsettings', {
			params: {
				projectId: projectId
			}
		});

		const dlgConfig: IFormDialogConfig<IModelProjectSettingsEntity> = {
			headerText: {key: 'model.project.projectsettings'},
			entity: settings,
			formConfiguration: {
				showGrouping: true,
				groups: [{
					groupId: 'defaults',
					header: {key: 'model.project.defaultsGroup'},
					open: true
				}, {
					groupId: 'versionNames',
					header: {key: 'model.project.versionNamesGroup'},
					open: true
				}, {
					groupId: 'expiry',
					header: {key: 'model.project.expiryGroup'},
					open: true,
				}],
				rows: [{
					...BasicsSharedCustomizeLookupOverloadProvider.provideModelTypeLookupOverload(true),
					groupId: 'defaults',
					id: 'type',
					label: {key: 'cloud.common.entityType'},
					model: 'TypeFk'
				}, {
					...BasicsSharedCustomizeLookupOverloadProvider.provideModelLevelOfDevelopmentLookupOverload(true),
					groupId: 'defaults',
					id: 'lod',
					label: {key: 'model.project.entityLod'},
					model: 'LodFk'
				}, {
					groupId: 'versionNames',
					id: 'versioncode',
					label: {key: 'model.project.versionCodePattern'},
					type: FieldType.Comment,
					model: 'VersionCodePattern',
					// TODO: placeholder option DEV-7255
					//placeholder: response.data.DefaultVersionCodePattern
				}, {
					groupId: 'versionNames',
					id: 'versiondesc',
					label: {key: 'model.project.versionDescPattern'},
					type: FieldType.Remark,
					model: 'VersionDescriptionPattern',
					// TODO: placeholder option DEV-7255
					//placeholder: response.data.DefaultVersionDescriptionPattern
				}, {
					groupId: 'expiry',
					id: 'active',
					label: {key: 'model.project.active'},
					type: FieldType.Boolean,
					model: 'Active'
				}, {
					groupId: 'expiry',
					id: 'expirydate',
					label: {key: 'model.project.defaultExpiryDate'},
					type: FieldType.DateUtc,
					model: 'ExpiryDate',
					//showClearButton: true // TODO: clear button for date time input
				}, {
					groupId: 'expiry',
					id: 'expirydays',
					label: {key: 'model.project.defaultExpiryDays'},
					type: FieldType.Integer,
					model: 'ExpiryDays'
				}]
			}
		};

		const dlgResult = await this.formDlgSvc.showDialog(dlgConfig);
		if (dlgResult && (dlgResult.closingButtonId === StandardDialogButtonId.Ok)) {
			await this.httpSvc.post('model/project/projectsettings/setsettings', dlgResult.value);

			return true;
		} else {
			return false;
		}
	}
}
