/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { IPropertyKeyComparisonExclusionEntity } from '../model/entities/property-key-comparison-exclusion-entity.interface';
import { ModelAdministrationPropertyKeyTagSelectorDialogService } from '../services/property-key-tag-selector-dialog.service';
import { ModelAdministrationPropertyKeyComparisonExclusionDataService } from '../services/property-key-comparison-exclusion-data.service';

/**
 * The behavior for the model property key comparison exclusion (blacklist) entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyComparisonExclusionBehaviorService
	implements IEntityContainerBehavior<IEntityContainerLink<IPropertyKeyComparisonExclusionEntity>, IPropertyKeyComparisonExclusionEntity> {

	private readonly tagSelectorDialogSvc = inject(ModelAdministrationPropertyKeyTagSelectorDialogService);

	private readonly dataSvc = inject(ModelAdministrationPropertyKeyComparisonExclusionDataService);

	private readonly msgBoxSvc = inject(UiCommonMessageBoxService);

	public onCreate(containerLink: IEntityContainerLink<IPropertyKeyComparisonExclusionEntity>) {
		containerLink.uiAddOns.toolbar.addItems([{
			id: 'addByTag',
			caption: {key: 'model.administration.propertyKeys.addByTag'},
			iconClass: 'control-icons ico-ctrl-label',
			fn: async () => {
				const tagIds = await this.tagSelectorDialogSvc.showDialog({
					acceptEmptySelection: false
				});

				if (!tagIds) {
					return;
				}

				// TODO: cover by-project case
				const newEntriesCount = await this.dataSvc.addByTags(tagIds);

				await this.msgBoxSvc.showMsgBox({
					bodyText: {
						key: 'model.administration.propertyKeys.pksAddedToBlacklistSummary',
						params: {
							count: newEntriesCount
						}
					},
					headerText: {key: 'model.administration.propertyKeys.pksAddedToBlacklist'},
					buttons: [{id: StandardDialogButtonId.Ok}],
					iconClass: 'info'
				});
			}
		}]);
	}
}