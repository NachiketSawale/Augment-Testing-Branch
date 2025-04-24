/*
 * Copyright(c) RIB Software GmbH
 */

import {
	inject,
	Injectable
} from '@angular/core';
import {
	InsertPosition,
	ItemType
} from '@libs/ui/common';
import {
	EntityContainerCommand,
	IEntityContainerBehavior,
	IEntityContainerLink
} from '@libs/ui/business-base';
import { IModelEntity } from '../model/entities/model-entity.interface';
import { ModelProjectModelDataService } from '../services/model-data.service';
import { ModelProjectRevitService } from '../services/model-project-revit.service';
import { ModelProjectProjectSettingsDialogService } from '../services/model-project-project-settings-dialog.service';

/**
 * The common behavior for containers of the *Model* entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelBehaviorService implements IEntityContainerBehavior<IEntityContainerLink<IModelEntity>, IModelEntity> {

	private readonly modelDataSvc = inject(ModelProjectModelDataService);

	private readonly revitSvc = inject(ModelProjectRevitService);

	private readonly pjSettingsDlgSvc = inject(ModelProjectProjectSettingsDialogService);

	public onCreate(containerLink: IEntityContainerLink<IModelEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([{
			type: ItemType.Item,
			id: EntityContainerCommand.CreateRecord,
			caption: {key: 'model.project.addModel'},
			iconClass: 'tlb-icons ico-add-single-model',
			permission: '#c',
			disabled: () => !containerLink.entityCreate?.canCreate(),
			fn: async () => {
				if (containerLink.entityCreate) {
					await containerLink.entityCreate.create();
				}
			}
		}, {
			type: ItemType.Item,
			id: 'createComposite',
			caption: {key: 'model.project.addCompositeModel'},
			iconClass: 'tlb-icons ico-add-composite-model',
			permission: '#c',
			disabled: () => !containerLink.entityCreate?.canCreate(),
			fn: async () => {
				await this.modelDataSvc.createComposite();
			}
		}], EntityContainerCommand.CreateRecord, InsertPosition.Instead);

		containerLink.uiAddOns.toolbar.addItemsAtId([{
			id: 'projectSettings',
			caption: {key: 'model.project.projectsettings'},
			iconClass: 'tlb-icons ico-administration',
			disabled: () => !this.modelDataSvc.getParentProjectId(),
			fn: async () => {
				const selProjectId = this.modelDataSvc.getParentProjectId();
				if (selProjectId) {
					await this.pjSettingsDlgSvc.showDialog(selProjectId);
				}
			}
		}, {
			id: 'revit',
			caption: {key: 'model.project.startRevit'},
			disabled: () => !containerLink.entitySelection.hasSelection(),
			fn: async () => {
				await this.revitSvc.activateRevit();
			}
		}], EntityContainerCommand.Settings, InsertPosition.Before);
	}
}
