/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, StaticProvider} from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {
	IMenuItemEventInfo,
	InsertPosition,
	ItemType,
	StandardDialogButtonId
} from '@libs/ui/common';
import { SupplierDataService } from '../services/suppiler-data.service';
import { isEmpty } from 'lodash';
import {ServiceLocator} from '@libs/platform/common';
import {
	BusinesspartnerSharedSubEntityDialogService,
	ISubEntityGridDialog,
	ISubEntityGridDialogOptions, SUB_ENTITY_DATA_SERVICE_TOKEN
} from '@libs/businesspartner/shared';
import {ISupplierCompanyEntity, ISupplierEntity} from '@libs/businesspartner/interfaces';
import {BusinesspartnerMainSupplier2CompanyDataService} from '../services/supplier-to-company-data.service';
import {SUPPLIER_TO_COMPANY_COLUMNS} from '../model/entity-info/supplier-to-company-columns.model';
import { SupplierInitService } from '../services/init-service/businesspartner-data-provider.service';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class SupplierGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ISupplierEntity>, ISupplierEntity> {
	private  dataService = inject(SupplierDataService);
	private readonly supplierInitService = inject(SupplierInitService);
	public onCreate(containerLink: IGridContainerLink<ISupplierEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't-newSupplierCompany',
				caption: { key : 'businesspartner.main.toolbarDefineCompanyRestriction' },
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-add-customer-company',
				disabled: () => {
					if (!isEmpty(this.dataService.getSelection())) {
						if (this.dataService.isReadOnly() || !this.dataService.getSelectedEntity()) {
							return true;
						}
						return this.supplierInitService.currentSubledgerContextFk !== this.dataService.getSelectedEntity()?.SubledgerContextFk;
					}
					return true;
				},
				fn: async () => {

					const dialogService = ServiceLocator.injector.get(BusinesspartnerSharedSubEntityDialogService);
					const gridDialogOptions: ISubEntityGridDialogOptions<ISupplierCompanyEntity> = {
						width: '50%',
						headerText: {key: 'businesspartner.main.screenSupplierCompanyDailogTitle'},
						windowClass: 'grid-dialog',
						tools: {
							cssClass: 'tools',
							items: [
								{
									id: 'z1',
									sort: 10,
									type: ItemType.Item,
									caption: 'cloud.common.taskBarNewRecord',
									iconClass: 'tlb-icons ico-rec-new',
									disabled: (info) => {
										return !info.context.dataService.canCreate();
									},
									fn: (info: IMenuItemEventInfo<ISubEntityGridDialog>) => {
										info.context.dataService.create();
									},
								},
								{
									id: 'z2',
									sort: 20,
									caption: 'cloud.common.taskBarDeleteRecord',
									iconClass: 'tlb-icons ico-rec-delete',
									type: ItemType.Item,
									disabled: (info) => {
										return !info.context.dataService.canDelete();
									},
									fn: (info: IMenuItemEventInfo<ISubEntityGridDialog>) => {
										const selection = info.context.dataService.getSelection();
										info.context.dataService.delete(selection);
									},
								},
							]
						},
						gridConfig: {
							uuid: 'b0f91870d5804749be358015d372b8f3',
							columns: SUPPLIER_TO_COMPANY_COLUMNS
						},
						isReadOnly: false,
						allowMultiSelect: true,
						buttons: [
							{
								id: StandardDialogButtonId.Ok,
							},
							{
								id: StandardDialogButtonId.Cancel,
							}
						]
					};

					const supplier2CompanyService = ServiceLocator.injector.get(BusinesspartnerMainSupplier2CompanyDataService);
					const bodyProviders: StaticProvider[] = [
						{
							provide: SUB_ENTITY_DATA_SERVICE_TOKEN,
							useValue: supplier2CompanyService
						}
					];

					const result = await dialogService.show(gridDialogOptions, bodyProviders);
					if (result) {
						if (result.closingButtonId === StandardDialogButtonId.Cancel) {
							supplier2CompanyService.resetLocal();
						}
					}
				},
			}
		],
		EntityContainerCommand.CreateRecord,
		InsertPosition.Before);
	}
}