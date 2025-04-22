/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IInvHeaderEntity } from '../model/entities';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { CorrectInvoiceType } from '../model';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IInvHeaderEntity>, IInvHeaderEntity> {
	private readonly dataService = inject(ProcurementInvoiceHeaderDataService);
	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IInvHeaderEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Method to customize toolbar
	 * @param containerLink
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IInvHeaderEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.CreateRecord);
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: { key: 'cloud.common.toolbarInsert' },
				iconClass: 'tlb-icons ico-rec-new',
				type: ItemType.Item,
				disabled: () => {
					return !this.dataService.canCreate();
				},
				fn: () => {
					this.dataService.createBlankItem();
				},
				sort: 0,
			},
			{
				caption: { key: 'cloud.common.taskBarNewRecordByCopy' },
				iconClass: 'tlb-icons ico-rec-new-copy',
				type: ItemType.Item,
				disabled: () => {
					return !this.dataService.canCreate();
				},
				fn: () => {
					this.dataService.create();
				},
				sort: 1,
			},
			{
				id: 'correctInvoice',
				caption: {
					key: 'procurement.invoice.toolbarCorrect',
				},
				hideItem: false,
				sort: 100,
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-correct',
				isSet: true,
				list: {
					showImages: true,
					showTitles: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'correctInvoiceProcess',
							caption: {
								key: 'procurement.invoice.toolbarCorrectInvoiceCorrect',
							},
							type: ItemType.Item,
							iconClass: 'tlb-icons ico-correct',
							fn: () => {
								this.dataService.correctInvoice(CorrectInvoiceType.Correct);
							},
							disabled: false,
						},
						{
							id: 'cancelInvoiceProcess',
							caption: {
								key: 'procurement.invoice.toolbarCorrectInvoiceCancel',
							},
							type: ItemType.Item,
							iconClass: 'tlb-icons ico-cancel',
							fn: () => {
								this.dataService.correctInvoice(CorrectInvoiceType.Cancel);
							},
							disabled: false,
						},
					],
				},
				disabled: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					if (!selectedItem || selectedItem.Version === 0) {
						return true;
					}
					return false;
				},
			},

			{
				caption: { key: 'cloud.translation.exportdlg.buttons.export' },
				hideItem: false,
				iconClass: 'tlb-icons ico-export',
				id: 't12',
				sort: 4,
				fn: () => {
					this.dataService.exportRecord();
				},
				type: ItemType.Item
			}
		];

		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}

	public onDestroy(containerLink: IGridContainerLink<IInvHeaderEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
