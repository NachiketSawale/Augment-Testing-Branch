/*
 * Copyright(c) RIB Software GmbH
 */

import {
	inject,
	Injectable
} from '@angular/core';
import { InsertPosition } from '@libs/ui/common';
import {
	EntityContainerCommand,
	IEntityContainerBehavior,
	IEntityContainerLink
} from '@libs/ui/business-base';
import { IPropertyKeyEntity } from '../model/entities/property-key-entity.interface';
import { ModelAdministrationPropertyKeyTagDataService } from '../services/property-key-tag-data.service';
import { ModelAdministrationPropertyKeyCreationService } from '../services/property-key-creation.service';
import { ModelAdministrationPropertyKeyDataService } from '../services/property-key-data.service';

/**
 * The behavior for the model property key entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyBehaviorService
	implements IEntityContainerBehavior<IEntityContainerLink<IPropertyKeyEntity>, IPropertyKeyEntity> {

	private readonly propertyKeyTagDataSvc = inject(ModelAdministrationPropertyKeyTagDataService);

	private readonly propertyKeyDataSvc = inject(ModelAdministrationPropertyKeyDataService);

	private readonly propertyKeyCreationSvc = inject(ModelAdministrationPropertyKeyCreationService);

	public onCreate(containerLink: IEntityContainerLink<IPropertyKeyEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([{
			id: EntityContainerCommand.CreateRecord,
			caption: {key: 'cloud.common.taskBarNewRecord'},
			iconClass: 'tlb-icons ico-rec-new',
			fn: async () => {
				const selTags = this.propertyKeyTagDataSvc.getSelection();

				const pk = await this.propertyKeyCreationSvc.createPropertyKeyWithDialog({
					fromAdminModule: true,
					selectedTags: selTags.map(t => t.Id)
				});

				if (pk) {
					containerLink.entityList?.append(pk);
					// TODO: post-processing?
					containerLink.entitySelection.select(pk);
				}
			}
		}], EntityContainerCommand.CreateRecord, InsertPosition.Instead);

		containerLink.uiAddOns.toolbar.addItemsAtId([{
			id: EntityContainerCommand.DeleteRecord,
			caption: {key: 'cloud.common.taskBarDeleteRecord'},
			iconClass: 'tlb-icons ico-rec-delete',
			fn: async () => {
				const selPKs = this.propertyKeyTagDataSvc.getSelection();

				await this.propertyKeyDataSvc.removePropertyKeys(selPKs.map(pk => pk.Id));
			},
			disabled: () => !containerLink.entitySelection.hasSelection()
		}], EntityContainerCommand.DeleteRecord, InsertPosition.Instead);
	}
}
