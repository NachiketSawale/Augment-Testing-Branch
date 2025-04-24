/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICustomDialogOptions, InsertPosition, ItemType, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { IPpsProductTemplateEntityGenerated } from '@libs/productionplanning/shared';
import { ProductTemplateDialogComponent } from '../components/product-template-dialog/product-template-dialog.component';
import { EngineeringProductTemplateDataService } from '../services/engineering-product-template-data.service';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';

/**
 * The common behavior for containers of the *Model* entity.
 */
@Injectable({
	providedIn: 'root',
})
export class EngineeringProductTemplateBehaviorService implements IEntityContainerBehavior<IEntityContainerLink<IPpsProductTemplateEntityGenerated>, IPpsProductTemplateEntityGenerated> {
	public constructor(
		private readonly modalDialogService: UiCommonDialogService,
		private readonly parentService: EngineeringTaskDataService,
		private readonly dataService: EngineeringProductTemplateDataService,
	) {}

	public onCreate(containerLink: IEntityContainerLink<IPpsProductTemplateEntityGenerated>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					type: ItemType.Item,
					id: 'createReference',
					caption: { key: 'cloud.common.createReference' },
					iconClass: 'tlb-icons ico-reference-add',
					permission: '#c',
					disabled: () => !containerLink.entityCreate?.canCreate(),
					fn: async () => {
						const dialogOptions: ICustomDialogOptions<void, ProductTemplateDialogComponent> = {
							id: '3a19993132ef4f21add57ec58ac3ac5e',
							headerText: 'productionplanning.producttemplate.productDescriptionListTitle',
							resizeable: true,
							width: '50%',
							windowClass: 'grid-dialog',
							backdrop: false,
							showCloseButton: true,
							bodyComponent: ProductTemplateDialogComponent,
							buttons: [
								{
									id: 'refresh',
									caption: { key: 'basics.common.button.refresh' },
									isDisabled: (info) => {
										return info.dialog.body.loading;
									},
									fn: async (event, info) => {
										await info.dialog.body.refresh();
									},
								},
								{
									id: StandardDialogButtonId.Ok,
									caption: { key: 'cloud.common.ok' },
									isDisabled: (info) => {
										return info.dialog.body.loading || !info.dialog.body.selectedEntities.length;
									},
									fn: async (event, info) => {
										//const success = await info.dialog.body.ok();
										//TODO: get the updated entities for finally() below
										await info.dialog.body.ok();
										info.dialog.close(StandardDialogButtonId.Ok);
										// if (success) {
										// 	if (options.afterCharacteristicsApplied) {
										// 		options.afterCharacteristicsApplied();
										// 	}
										// }
									},
								},
								{
									id: StandardDialogButtonId.Cancel,
									caption: { key: 'ui.common.dialog.cancelBtn' },
								},
							],
						};

						this.modalDialogService.show(dialogOptions)?.finally(async () => {
							//option1
							await this.dataService.reload();
							//TODO: relaod or adding of the new entity here
						});
					},
				},
			],
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					type: ItemType.Item,
					id: 'deleteReference',
					caption: { key: 'cloud.common.deleteReference' },
					iconClass: 'tlb-icons ico-reference-delete',
					permission: '#c',
					disabled: () => !containerLink.entityDelete?.canDelete(),
					fn: async () => {
						const toDeletes = this.dataService.getSelection();
						toDeletes.forEach((item) => {
							item.EngTaskFk = null;
						});
						//All don't work now
						//this.dataService.setModified(toDeletes);
						// this.dataService.updateEntities(toDeletes);
						// await this.parentService.save();
						await this.dataService.reload();
						//await this.modelDataSvc.createComposite();
					},
				},
			],
			EntityContainerCommand.DeleteRecord,
			InsertPosition.Instead,
		);
	}
}
