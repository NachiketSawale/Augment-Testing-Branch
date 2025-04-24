/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { InsertPosition, ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { IModelEntity } from '../model/entities/model-entity.interface';
import { ModelProjectModelVersionDataService } from '../services/model-version-data.service';
import { ModelProjectRevitService } from '../services/model-project-revit.service';

/**
 * The common behavior for containers of the *Model* entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelVersionBehaviorService implements IEntityContainerBehavior<IEntityContainerLink<IModelEntity>, IModelEntity> {

	private readonly modelVersionDataSvc = inject(ModelProjectModelVersionDataService);

	private readonly msgBoxSvc = inject(UiCommonMessageBoxService);

	private readonly revitSvc = inject(ModelProjectRevitService);

	public onCreate(containerLink: IEntityContainerLink<IModelEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([{
			type: ItemType.Sublist,
			id: EntityContainerCommand.DeletionGroup,
			list: {
				items: [{
					id: EntityContainerCommand.DeleteRecord,
					caption: {key: 'cloud.common.toolbarDelete'},
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: () => !containerLink.entitySelection.hasSelection(),
					fn: async () => {
						const selModel = containerLink.entitySelection.getSelectedEntity();
						if (selModel) {
							if ((await this.msgBoxSvc.showYesNoDialog('model.project.deleteQuestion', 'model.project.deleteModelTitle'))?.closingButtonId === StandardDialogButtonId.Yes) {
								if (await this.modelVersionDataSvc.deleteModelVersion(selModel.Id)) {
									await this.msgBoxSvc.showInfoBox('model.project.deleteSuccess', 'model.version.delete-success', false);
								} else {
									await this.msgBoxSvc.showErrorDialog({
										key: 'model.project.deleteFailed'
									});
								}
							}
						}
					}
				}]
			}
		}], EntityContainerCommand.Grouping, InsertPosition.Before);

		containerLink.uiAddOns.toolbar.addItemsAtId([{
			id: 'revit',
			caption: {key: 'model.project.startRevit'},
			disabled: () => !containerLink.entitySelection.hasSelection(),
			fn: async () => {
				await this.revitSvc.activateRevit();
			}
		}], EntityContainerCommand.Settings, InsertPosition.Before);
	}
}
