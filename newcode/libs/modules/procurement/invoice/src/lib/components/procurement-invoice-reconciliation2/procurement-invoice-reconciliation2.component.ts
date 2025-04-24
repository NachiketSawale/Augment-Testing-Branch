/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, ConcreteMenuItem, FieldType, ItemType } from '@libs/ui/common';
import { of } from 'rxjs';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity } from '../../model';
import { BasicsSharedReadOnlyGridComponent } from '@libs/basics/shared';
import { EntityContainerCommand } from '@libs/ui/business-base';
import { ProcurementInvoicePesDataService } from '../../services/procurement-invoice-pes-data.service';
import { ProcurementInvoiceContractItemDataService } from '../../contractitem/procurement-invoice-contract-item-data.service';
import { IInvoiceReconcilition2Entity } from '../../model/entities/prc-invoice-reconciliation2.interface';

/**
 * Component represents procurement invoice Reconciliation2 Component
 */
@Component({
	selector: 'procurement-invoice-invoice-reconciliation2',
	templateUrl: './procurement-invoice-reconciliation2.component.html',
	styleUrl: './procurement-invoice-reconciliation2.component.css',
})
export class ProcurementInvoiceReconciliation2Component extends BasicsSharedReadOnlyGridComponent<IInvoiceReconcilition2Entity, IInvHeaderEntity> {
	/**
	 * Inject Platform Translate Service
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Inject Procurement Invoice Header Data Service
	 */
	public invoiceHeaderService = inject(ProcurementInvoiceHeaderDataService);

	/**
	 * Inject  Procurement Invoice Contract Item Data service
	 */
	public prcInvoicecontractDataService = inject(ProcurementInvoiceContractItemDataService);

	/**
	 * Inject Procurement Invoice Pes Data Service
	 */
	public prcInvoicePesDataService = inject(ProcurementInvoicePesDataService);

	/**
	 * Procurement Invoice Reconciliation2 container uuid
	 */
	public gridId: string = '0e14d4c48df94e85b816119c2f95f20b';

	/**
	 * Invoice Reconciliation Columns defination
	 */
	public invoiceReconciliationColumns: ColumnDef<IInvoiceReconcilition2Entity>[] = [
		{
			id: 'ReconName',
			label: { text: 'Type', key: 'procurement.invoice.reconciliation2.type' },
			type: FieldType.Text,
			//Todo:need to implement formatter method
			model: 'Type',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconNet',
			label: { text: 'Net', key: 'procurement.invoice.entityNet' },
			type: FieldType.Money,
			model: 'Net',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconVat',
			label: { text: 'Vat', key: 'procurement.invoice.entityVAT' },
			type: FieldType.Money,
			model: 'Vat',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconGross',
			label: { text: 'Gross', key: 'procurement.invoice.entityGross' },
			type: FieldType.Money,
			model: 'Gross',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconNetOc',
			label: { text: 'Net(OC)', key: 'procurement.invoice.entityNetOc' },
			type: FieldType.Money,
			model: 'NetOc',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconVatOc',
			label: { text: 'Vat(OC)', key: 'procurement.invoice.entityVATOc' },
			type: FieldType.Money,
			model: 'VatOc',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'ReconGrossOc',
			label: { text: 'Gross(OC)', key: 'procurement.invoice.entityGrossOc' },
			type: FieldType.Money,
			model: 'GrossOc',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
	];

	public constructor() {
		super();
		this.uiAddOns.toolbar.addItems(this.menuItem);
	}

	/**
	 *
	 * @param selected of type IInvHeaderEntity
	 * @returns Reconcilition list data
	 */
	public getInvoiceReconciliationData = (selected: IInvHeaderEntity) => {
		const list: IInvoiceReconcilition2Entity[] = this.getList(selected);
		return of(list);
	};

	/**
	 *
	 * @param selected of type IInvHeaderEntity
	 * @returns Reconcilition list
	 */
	public getList(selected?: IInvHeaderEntity): IInvoiceReconcilition2Entity[] {
		if (!selected) {
			return [];
		}
		const amountNet = selected.AmountNet;
		const amountGross = selected.AmountGross;
		const amountNetOc = selected.AmountNetOc;
		const amountVat = selected.AmountVat;
		const amountVatOc = selected.AmountVatOc;
		const amountGrossOc = selected.AmountGrossOc;
		//Todo: need implementation of basicsLookupdataLookupDescriptorService,

		let index = 0;
		const list: IInvoiceReconcilition2Entity[] = [];

		list.push({
			Id: ++index,
			Type: this.translateService.instant('cloud.common.entityAmount'),
			Net: amountNet,
			Vat: amountVat,
			Gross: amountGross,
			NetOc: amountNetOc,
			VatOc: amountVatOc,
			GrossOc: amountGrossOc,
		});

		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.fromPES'),
			Net: selected.AmountNetPes,
			Vat: selected.AmountVatPes,
			Gross: selected.AmountGrossPes,
			NetOc: selected.AmountNetPesOc,
			VatOc: selected.AmountVatPesOc,
			GrossOc: selected.AmountGrossPesOc,
		});

		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.fromContract'),
			Net: selected.AmountNetContract,
			Vat: selected.AmountVatContract,
			Gross: selected.AmountGrossContract,
			NetOc: selected.AmountNetContractOc,
			VatOc: selected.AmountVatContractOc,
			GrossOc: selected.AmountGrossContractOc,
		});
		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.fromOther'),
			Net: selected.AmountNetOther,
			Vat: selected.AmountVatOther,
			Gross: selected.AmountGrossOther,
			NetOc: selected.AmountNetOtherOc,
			VatOc: selected.AmountVatOtherOc,
			GrossOc: selected.AmountGrossOtherOc,
		});
		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.fromBillingSchema'),
			Net: selected.FromBillingSchemaNet,
			Vat: selected.FromBillingSchemaVat,
			Gross: selected.FromBillingSchemaGross,
			NetOc: selected.FromBillingSchemaNetOc,
			VatOc: selected.FromBillingSchemaVatOc,
			GrossOc: selected.FromBillingSchemaGrossOc,
		});
		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.rejections'),
			Net: selected.AmountNetReject,
			Vat: selected.AmountVatReject,
			Gross: selected.AmountGrossReject,
			NetOc: selected.AmountNetRejectOc,
			VatOc: selected.AmountVatRejectOc,
			GrossOc: selected.AmountGrossRejectOc,
		});
		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.invoice.header.balance'),
			Net: selected.AmountNetBalance,
			Vat: selected.AmountVatBalance,
			Gross: selected.AmountGrossBalance,
			NetOc: selected.AmountNetBalanceOc,
			VatOc: selected.AmountVatBalanceOc,
			GrossOc: selected.AmountGrossBalanceOc,
		});
		return list;
	}

	/**
	 * represent Custom Menu Item list
	 */
	public menuItem: ConcreteMenuItem[] = [
		{
			type: ItemType.Check,
			caption: { key: 'cloud.common.taskBarGrouping' },
			iconClass: 'tlb-icons ico-group-columns',
			id: 'group',
			fn: () => {
				// todo toolbar button is not working well now
			},
			disabled: false,
		},
		{
			type: ItemType.Item,
			caption: { key: 'cloud.common.taskBarSearch', text: 'Search' },
			iconClass: 'tlb-icons ico-search-all',
			id: 'create',
		},
		{
			type: ItemType.Item,
			caption: { key: 'cloud.common.taskBarColumnFilter', text: 'Column Filter' },
			iconClass: 'tlb-icons ico-search-column',
			id: 'delete',
			disabled: () => {
				return false;
			},
		},
		{
			caption: { key: 'cloud.common.exportClipboard' },
			groupId: 'dropdown-btn-t199',
			iconClass: 'tlb-icons ico-clipboard',
			id: EntityContainerCommand.Clipboard,
			type: ItemType.DropdownBtn,
			list: {
				cssClass: 'dropdown-menu-right',
				showImages: false,
				showTitles: true,
				items: [
					{
						caption: { key: 'cloud.common.exportArea' },
						id: EntityContainerCommand.CopyCellArea,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						caption: { key: 'cloud.common.exportCopy' },
						id: EntityContainerCommand.Copy,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						id: EntityContainerCommand.ExportOptions,
						type: ItemType.Sublist,
						list: {
							items: [
								{
									caption: { key: 'cloud.common.exportWithHeader' },
									id: EntityContainerCommand.CopyWithHeader,
									type: ItemType.Item,
									fn: () => {
										throw new Error('This method is not implemented');
									},
								},
							],
						},
					},
				],
			},
		},
		{
			id: 't200',
			caption: 'gridSettings',
			type: ItemType.DropdownBtn,
			cssClass: 'tlb-icons ico-settings',
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [
					{
						id: 't111',
						caption: { key: 'cloud.common.gridlayout' },
						permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',
						type: ItemType.Item,
					},
					{
						id: 't155',
						caption: { key: 'cloud.common.showStatusbar' },
						type: ItemType.Check,
						value: true,
					},
					{
						id: 't255',
						caption: { key: 'cloud.common.markReadonlyCells' },
						type: ItemType.Check,
						value: true,
					},
				],
			},
			iconClass: 'tlb-icons ico-settings',
			hideItem: false,
		},
		{
			id: 't1000',
			sort: 1000,
			caption: this.translateService.instant('procurement.common.total.dirtyRecalculate'),
			type: ItemType.Item,
			iconClass: 'control-icons ico-recalculate',
			disabled: () => {
				const itemStatus = this.invoiceHeaderService.getStatus();
				if (itemStatus?.IsReadOnly) {
					return true;
				} else {
					return this.getList().length === 0;
				}
			},
			fn: () => {
				this.invoiceHeaderService.updateReconciliation();
			},
		},
		{
			id: 'd999',
			sort: 999,
			type: ItemType.Divider,
		},
	];
}
