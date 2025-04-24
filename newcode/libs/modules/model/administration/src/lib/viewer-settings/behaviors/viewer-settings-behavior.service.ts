/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { IViewerSettingsEntity } from '../model/entities/viewer-settings-entity.interface';
import { ModelAdministrationViewerSettingsDataService } from '../services/viewer-settings-data.service';

@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationViewerSettingsBehavior
	implements IEntityContainerBehavior<IEntityContainerLink<IViewerSettingsEntity>, IViewerSettingsEntity> {

	private readonly dataSvc = inject(ModelAdministrationViewerSettingsDataService);

	public onCreate(containerLink: IEntityContainerLink<IViewerSettingsEntity>) {
		this.dataSvc.modifyToolBar(containerLink.uiAddOns);
	}
}
