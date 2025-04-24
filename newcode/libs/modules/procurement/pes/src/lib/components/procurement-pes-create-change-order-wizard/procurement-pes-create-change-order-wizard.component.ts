import { Component, inject } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { createLookup, FieldType, getCustomDialogDataToken, GridComponent, IFormConfig, IGridConfiguration, UiCommonModule } from '@libs/ui/common';
import { IChangeItems, IPESCreateChangeOrderOptions, PES_CREATE_CHANGE_ORDER_PARAM } from '../../model/interfaces/wizard/pes-create-change-order.interface';
import { BasicsSharedConStatusLookupService, BasicsSharedMaterialLookupService, BasicsSharedStatusIconService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { IBasicsCustomizeConStatusEntity, IBasicsUomEntity } from '@libs/basics/interfaces';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { IPrcConHeaderEntity } from '@libs/procurement/interfaces';
import { isNil } from 'lodash';
import { PesCreateCOContractStatusOption } from '../../model/enums/pes-create-co-contract-status-option.enum';

@Component({
	selector: 'procurement-pes-create-change-order-wizard',
	standalone: true,
	imports: [PlatformCommonModule, GridComponent, UiCommonModule],
	templateUrl: './procurement-pes-create-change-order-wizard.component.html',
	styleUrl: './procurement-pes-create-change-order-wizard.component.css',
})
export class ProcurementPesCreateChangeOrderWizardComponent {
	protected readonly initData = inject(PES_CREATE_CHANGE_ORDER_PARAM);
	protected readonly gridConfig = this.getGridConfiguration();
	protected wizardOption: IPESCreateChangeOrderOptions;
	protected readonly formConfig = this.getFormConfiguration();
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IPrcConHeaderEntity[], ProcurementPesCreateChangeOrderWizardComponent>());

	public constructor() {
		this.dialogWrapper.headerText = {key: this.initData.isLinkFrameworkContract ? 'procurement.pes.createCOContractWizard.dialogTitleForFWContract' : 'procurement.pes.createCOContractWizard.dialogTitle'};
		this.wizardOption = {
			projectChangeFk: this.initData.changeHeader?.ProjectChangeFk,
			changeOrderContractDesc: this.initData.isLinkFrameworkContract ? this.initData.contract.Code : this.initData.changeHeader?.Description,
			contractStatus: this.initData.changeHeader?.ConStatusFk,
		};
	}

	public okBtnClicked() {
		this.initData.changeOrderContracts.forEach((contract) => {
			contract.Description = this.wizardOption.changeOrderContractDesc ?? '';
			contract.ProjectChangeFk = this.wizardOption.projectChangeFk;
			contract.ConStatusFk = this.wizardOption.contractStatus ?? 0;

			if (isNil(contract.Code)) {
				contract.Code = '';
			}
		});
		this.dialogWrapper.value = this.initData.changeOrderContracts;
	}

	public okBtnDisabled(): boolean {
		return (!this.wizardOption.projectChangeFk && !this.initData.isLinkFrameworkContract) || !this.wizardOption.contractStatus;
	}

	private getFormConfiguration(): IFormConfig<IPESCreateChangeOrderOptions> {
		return {
			formId: 'pes.create.change.order.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				{
					id: 'projectChangeFk',
					label: {key: 'procurement.pes.createCOContractWizard.projectChangeText'},
					model: 'projectChangeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareProjectChangeLookupService,
						serverSideFilter: {
							key: 'project-change-lookup-for-procurement-common-filter',

							execute: () => {
								return {
									ProjectFk: this.initData.changeHeader.ProjectFk ?? -1,
									IsProcurement: true,
								};
							},
						},
						showClearButton: true,
					}),
					visible: !this.initData.isLinkFrameworkContract,
				},
				{
					id: 'contractStatus',
					label: {key: 'procurement.pes.createCOContractWizard.contractStatusText'},
					model: 'contractStatus',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedConStatusLookupService,
						showGrid: false,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: inject(BasicsSharedStatusIconService<IBasicsCustomizeConStatusEntity, IPESCreateChangeOrderOptions>),
						clientSideFilter: {
							execute: (item) => {
								if (!(item && item.IsLive && item.Sorting !== 0)) {
									return false;
								}

								if (this.initData.createCOContractWithDefaultStatus === PesCreateCOContractStatusOption.ShowIsDefaultStatuses) {
									return item.IsDefault;
								} else if (this.initData.createCOContractWithDefaultStatus === PesCreateCOContractStatusOption.ShowIsPesCOStatues) {
									return item.IsPesCO;
								} else {
									return true;
								}
							},
						},
					}),
				},
				{
					id: 'changeOrderContractDesc',
					label: {
						key: this.initData.isLinkFrameworkContract ? 'procurement.pes.createCOContractWizard.fieldFWContractDesc' : 'procurement.pes.createCOContractWizard.fieldChangeOrderContractDesc',
					},
					model: 'changeOrderContractDesc',
					type: FieldType.Description,
				},
			],
		};
	}

	private getGridConfiguration(): IGridConfiguration<IChangeItems> {
		return {
			uuid: 'e5eca3b9844d466b94aa40a6c700fe97',
			columns: [
				{
					id: 'materialCode',
					model: 'MdcMaterialFk',
					width: 100,
					type: FieldType.Lookup,
					label: {key: 'basics.common.entityMaterialCode'},
					lookupOptions: createLookup<IChangeItems, IMaterialSearchEntity>({
						dataServiceToken: BasicsSharedMaterialLookupService,
					}),
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'materialDescription',
					model: 'Description1',
					width: 120,
					type: FieldType.Description,
					label: {key: 'basics.common.entityMaterialDescription'},
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'boqReference',
					model: 'BoqReference',
					width: 100,
					type: FieldType.Description,
					label: {key: 'procurement.pes.boqReference'},
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'boqBrief',
					model: 'BoqBrief',
					type: FieldType.Description,
					label: {key: 'procurement.pes.boqBrief'},
					width: 140,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'quantityDelivered',
					model: 'QuantityDelivered',
					type: FieldType.Quantity,
					label: {key: 'procurement.pes.entityQuantityDelivered'},
					width: 120,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'quantityContracted',
					model: 'QuantityContracted',
					type: FieldType.Quantity,
					label: {key: 'procurement.pes.entityQuantityContracted'},
					width: 120,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'variance',
					model: 'Variance',
					type: FieldType.Quantity,
					label: {key: 'procurement.common.variance'},
					width: 80,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'uom',
					model: 'UomFK',
					type: FieldType.Lookup,
					label: {key: 'cloud.common.entityUoM'},
					lookupOptions: createLookup<IChangeItems, IBasicsUomEntity>({
						dataServiceToken: BasicsSharedUomLookupService,
					}),
					sortable: true,
					visible: true,
					readonly: true,
				},
			],
			items: this.initData.changeShowItems,
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
		};
	}
}
