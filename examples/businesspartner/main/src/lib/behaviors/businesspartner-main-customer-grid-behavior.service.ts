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
import { isEmpty } from 'lodash';
import {ServiceLocator} from '@libs/platform/common';
import {
	BusinesspartnerSharedSubEntityDialogService,
	ISubEntityGridDialog,
	ISubEntityGridDialogOptions, SUB_ENTITY_DATA_SERVICE_TOKEN
} from '@libs/businesspartner/shared';
import {BusinesspartnerMainCustomerDataService} from '../services/customer-data.service';
import {CUSTOMER_TO_COMPANY_COLUMNS} from '../model/entity-info/customer-to-company-columns.model';
import {BusinesspartnerMainCustomer2CompanyDataService} from '../services/customer-to-company-data.service';
import { ICustomerCompanyEntity, ICustomerEntity } from '@libs/businesspartner/interfaces';

/**
 * Customer behavior
 */
@Injectable({
	providedIn: 'root'
})
export class CustomerGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ICustomerEntity>, ICustomerEntity> {
	private  dataService = inject(BusinesspartnerMainCustomerDataService);
	public onCreate(containerLink: IGridContainerLink<ICustomerEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't-newCustomerCompany',
				caption: {key: 'businesspartner.main.toolbarDefineCompanyRestriction'},
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-add-customer-company',
				disabled: () => {
					if (!isEmpty(this.dataService.getSelection())) {
						if (this.dataService.isReadOnly() || !this.dataService.getSelectedEntity()) {
							return true;
						}
						return this.dataService.currentSubledgerContextFk !== this.dataService.getSelectedEntity()?.SubledgerContextFk;
					}
					return true;
				},
				fn: async () => {

					const dialogService = ServiceLocator.injector.get(BusinesspartnerSharedSubEntityDialogService);
					const gridDialogOptions: ISubEntityGridDialogOptions<ICustomerCompanyEntity> = {
						width: '50%',
						headerText: {key: 'businesspartner.main.screenCustomerCompanyDailogTitle'},
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
							uuid: 'e02c701b3fb148faaa4a98b894b95f75',
							columns: CUSTOMER_TO_COMPANY_COLUMNS
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

					const customer2CompanyService = ServiceLocator.injector.get(BusinesspartnerMainCustomer2CompanyDataService);
					const bodyProviders: StaticProvider[] = [
						{
							provide: SUB_ENTITY_DATA_SERVICE_TOKEN,
							useValue: customer2CompanyService
						}
					];

					const result = await dialogService.show(gridDialogOptions, bodyProviders);
					if (result) {
						if (result.closingButtonId === StandardDialogButtonId.Cancel) {
							customer2CompanyService.resetLocal();
						}
					}
				},
			}
		],
		EntityContainerCommand.CreateRecord,
		InsertPosition.Before);
	}
}