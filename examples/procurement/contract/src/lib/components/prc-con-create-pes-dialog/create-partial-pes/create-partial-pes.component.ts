/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef, createLookup, FieldType, getCustomDialogDataToken, GridComponent, IGridConfiguration, StandardDialogButtonId, UiCommonModule } from '@libs/ui/common';
import { Component, inject } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { BoqPrcItemEntity, CreateOptionsSource, CreateOptionsValue, ICreateOptions, IPrcContractCreatePesOption, PesGridEntity, PRC_CONTRACT_CREATE_PES_OPTIONS } from '../../../model/interfaces/wizards/prc-contract-create-pes-wizard.interface';
import { NgIf } from '@angular/common';
import { PrcConCreatePesCoverConfirmComponent } from '../cover-confirm-page/cover-confirm-page.component';
import { BasicsSharedPesStatusLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IBasicsCustomizePesStatusEntity } from '@libs/basics/interfaces';

@Component({
	selector: 'procurement-contract-create-partial-pes',
	templateUrl: './create-partial-pes.component.html',
	imports: [
		UiCommonModule,
		PlatformCommonModule,
		FormsModule,
		NgIf,
		GridComponent
	],
	standalone: true
})
export class PrcConCreatePartialPesComponent {
	public createPesOption: IPrcContractCreatePesOption = inject(PRC_CONTRACT_CREATE_PES_OPTIONS);
	public isDisableFromConsolidatedContract: boolean = true;
	public itemGridCfg!: IGridConfiguration<BoqPrcItemEntity>;
	public pesGridCfg!: IGridConfiguration<PesGridEntity>;
	protected readonly createOptionsValue = CreateOptionsValue;
	protected readonly createOptionsSource = CreateOptionsSource;
	protected createOptions: ICreateOptions = {
		value: this.createOptionsValue.createPesOptionsNew,
		source: this.createOptionsSource.createFromVariance
	};
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IPrcContractCreatePesOption, PrcConCreatePesCoverConfirmComponent>());

	public constructor() {
		this.itemGridCfg =
			this.createGridConfig<BoqPrcItemEntity>(
				'5b8809a502d34fb9bda8db977c3651a1',
				[
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'description',
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						model: 'Description',
						readonly: true,
						sortable: true,
						type: FieldType.Description,
						visible: true
					},
					{
						id: 'ccQuantity',
						model: 'Quantity',
						type: FieldType.Integer,
						label: {
							text: 'Consolidate Contract QTY',
							key: 'procurement.contract.wizard.consolidateContractQuantity'
						},
						width:150,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'uom',
						label: {
							text: 'UoM',
							key: 'cloud.common.entityUoM'
						},
						model: 'UomFK',
						readonly: true,
						sortable: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService
						}),
						visible: true
					}
				],
				this.createPesOption?.boqPrcItems || []
			);
		this.pesGridCfg =
			this.createGridConfig<PesGridEntity>(
				'2603876bbde04bdc939a91c34ebb500b',
				[
					{
						id: 'status',
						model: 'PesStatusFk',
						label: {
							text: 'Status',
							key: 'cloud.common.entityStatus'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedPesStatusLookupService,
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: {
								select(item: IBasicsCustomizePesStatusEntity): string {
									return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
								},
								getIconType() {
									return 'css';
								}
							}
						}),
						visible: true,
						readonly: true,
						sortable: true
					},
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'description',
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						model: 'Description',
						readonly: true,
						sortable: true,
						type: FieldType.Description,
						visible: true
					},
					{
						id: 'documentDate',
						model: 'DocumentDate',
						type: FieldType.Date,
						label: {
							text: 'Document Date',
							key: 'procurement.contract.wizard.documentDate'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'dateDelivered',
						model: 'DateDelivered',
						type: FieldType.Date,
						label: {
							text: 'Date Delivered',
							key: 'procurement.contract.wizard.dateDelivered'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'total',
						model: 'PesValue',
						type: FieldType.Money,
						label: {
							text: 'Total',
							key: 'procurement.contract.wizard.total'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
				],
				this.createPesOption?.pesHeaders || []
			);
		this.isDisableFromConsolidatedContract = !this.createPesOption.isConsolidateChange;
	}

	public ok() {
		this.dialogWrapper.value = {
			mainItemId: this.createPesOption.mainItemId,
			options: this.createPesOption.options
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	public onCreateOptionChange() {
		if (this.createOptions.value != this.createOptionsValue.createPesOptionsNew) {
			this.createOptions.source = this.createOptionsSource.noChoice;//Remove the current selection
		} else {
			this.createOptions.source = this.createOptionsSource.createFromVariance;
		}

	}

	public onCreateSourceChange() {
		this.createOptions.value = this.createOptionsValue.createPesOptionsNew;
	}

	private createGridConfig<T extends object>(uuid: string, columns: ColumnDef<T>[], items: T[]): IGridConfiguration<T> {
		return {
			uuid: uuid,
			columns: columns,
			items: items,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
		};
	}

}