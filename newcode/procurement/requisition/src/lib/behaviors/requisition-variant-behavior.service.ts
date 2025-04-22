/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IReqVariantEntity} from '../model/entities/req-variant-entity.interface';
import {ProcurementRequisitionRequisitionVariantDataService} from '../services/requisition-variant-data.service';
import {
	ICustomDialogOptions,
	InsertPosition,
	ItemType,
	StandardDialogButtonId, UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {ServiceLocator, Translatable} from '@libs/platform/common';
import {
	SelectBoqVariantDialogComponent
} from '../components/select-boq-variant-dialog/select-boq-variant-dialog.component';
import {SELECT_VARIANT_DATA_TOKEN} from '../model/select-variant/select-variant-data.interface';
import {
	SelectItemVariantDialogComponent
} from '../components/select-item-variant-dialog/select-item-variant-dialog.component';
import {RequisitionItemsDataService} from '../services/requisition-items-data.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionVariantBehavior implements IEntityContainerBehavior<IGridContainerLink<IReqVariantEntity>, IReqVariantEntity> {
	private readonly dataService = inject(ProcurementRequisitionRequisitionVariantDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(UiCommonDialogService);

	public onCreate(containerLink: IGridContainerLink<IReqVariantEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 'selectBoqVariant',
				caption: 'procurement.requisition.variant.selectBoqVariantTitle',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-select-boq-variant',
				disabled: () => {
					const headerContext = this.dataService.parentService.getHeaderContext();
					return headerContext.readonly;
				},
				fn: () => {
					const variantSelected = this.dataService.getSelectedEntity();
					const parentSelected = this.dataService.parentService.getSelectedEntity();
					const headerContext = this.dataService.parentService.getHeaderContext();
					if (parentSelected) {
						if (headerContext.readonly) {
							this.showWarningMessage('procurement.requisition.variant.statusError');
							return;
						} else if (!variantSelected) {
							this.showWarningMessage('procurement.requisition.variant.variantNoSelectMessage');
							return;
						}
						this.dataService.parentService.updateAndExecute(async () => {
							// todo chi: common service is not available
							const boqHeaderList: number[] = [];
							// let boqHeaderList = procurementCommonPrcBoqService.getService().getList();
							if (boqHeaderList.length > 0) {
								const modalOptions: ICustomDialogOptions<StandardDialogButtonId, SelectBoqVariantDialogComponent> = {
									headerText: 'procurement.requisition.variant.selectBoqVariant',
									buttons: [
										{
											id: 'createBoqVariant',
											caption: 'cloud.common.ok',
											fn(evt, info) {
												info.dialog.body.ok();
												info.dialog.close(StandardDialogButtonId.Ok);
											}
										},
										{
											id: StandardDialogButtonId.Cancel,
											caption: {key: 'ui.common.dialog.cancelBtn'},
										}
									],
									resizeable: true,
									showCloseButton: true,
									bodyComponent: SelectBoqVariantDialogComponent,
									bodyProviders: [
										{
											provide: SELECT_VARIANT_DATA_TOKEN,
											useValue: {
												variantId: variantSelected.Id,
												reqHeader: parentSelected
											}
										},
									]
								};

								await this.dialogService.show(modalOptions);
							} else {
								this.showWarningMessage('procurement.requisition.variant.noBoqDataMessage');
							}
						});

					}
				}
			},
			{
				id: 'selectItemVariant',
				caption: 'procurement.requisition.variant.selectItemVariantTitle',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-select-item-variant',
				disabled: () => {
					const headerContext = this.dataService.parentService.getHeaderContext();
					return headerContext.readonly;
				},
				fn: () => {
					const variantSelected = this.dataService.getSelectedEntity();
					const parentSelected = this.dataService.parentService.getSelectedEntity();
					const headerContext = this.dataService.parentService.getHeaderContext();
					if (parentSelected) {
						if (headerContext.readonly) {
							this.showWarningMessage('procurement.requisition.variant.statusError');
							return;
						} else if (!variantSelected) {
							this.showWarningMessage('procurement.requisition.variant.variantNoSelectMessage');
							return;
						}
						this.dataService.parentService.updateAndExecute(async () => {
							const itemList = ServiceLocator.injector.get(RequisitionItemsDataService).getList();
							if (itemList.length > 0) {
								const modalOptions: ICustomDialogOptions<StandardDialogButtonId, SelectItemVariantDialogComponent> = {
									headerText: 'procurement.requisition.variant.selectItemVariantTitle',
									buttons: [
										{
											id: 'createItemVariant',
											caption: 'cloud.common.ok',
											fn(evt, info) {
												info.dialog.body.ok();
												info.dialog.close(StandardDialogButtonId.Ok);
											}
										},
										{
											id: StandardDialogButtonId.Cancel,
											caption: {key: 'ui.common.dialog.cancelBtn'},
										}
									],
									resizeable: true,
									showCloseButton: true,
									bodyComponent: SelectItemVariantDialogComponent,
									bodyProviders: [
										{
											provide: SELECT_VARIANT_DATA_TOKEN,
											useValue: {
												variantId: variantSelected.Id
											}
										},
									]
								};

								await this.dialogService.show(modalOptions);
							} else {
								this.showWarningMessage('procurement.requisition.variant.noItemDataMessage');
							}
						});

					}
				}
			}
		],
		EntityContainerCommand.CreateRecord,
		InsertPosition.Before);
	}

	private showWarningMessage(bodyText: Translatable) {
		this.messageBoxService.showMsgBox({
			headerText: 'procurement.requisition.variant.errorMessage',
			bodyText: bodyText,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
				},
			],
			defaultButtonId: StandardDialogButtonId.Ok,
			iconClass: 'ico-warning',
		});
	}
}