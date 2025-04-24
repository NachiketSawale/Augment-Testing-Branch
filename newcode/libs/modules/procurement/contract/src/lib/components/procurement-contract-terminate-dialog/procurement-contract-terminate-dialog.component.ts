import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { PlatformCommonModule, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IConHeaderEntity } from '../../model/entities';
import { createLookup, FieldType, getCustomDialogDataToken, GridComponent, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonDialogService, UiCommonModule } from '@libs/ui/common';
import { DecimalPipe } from '@angular/common';
import { BusinessPartnerLookupService, BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN, BusinesspartnerSharedContactLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { FormsModule } from '@angular/forms';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';

export interface IContractTerminateItem {
	Id: string;
	Type: string;
	Itemno: string;
	Reference: string;
	Quantity: number;
	QuantityDelivered: number;
	QuantityUnDelivered: number;
}

export interface IContractTerminateWizardOptions {
	selectedContract: IConHeaderEntity;
	contractTerminateItems: IContractTerminateItem[];
	TotalNet: number;
	TotalGross: number;
	TotalDeliveredNet: number;
	TotalDeliveredGross: number;
}

export interface IBusinessPartnerLookupData {
	BusinessPartnerFk?: number;
	SubsidiaryFk?: number;
	SupplierFk?: number;
	ContactFk?: number;
}

export enum CreateTerminateContractAs {
	Requisition = 0,
	Contract,
}

export interface IContractTerminateDialogResult {
	isSuccess: boolean;
	createAsType: CreateTerminateContractAs;
	mainContractReqCode?: string;
	changeOrderCode?: string;
	navigateIds?: number[];
}

export interface ITerminateContractResponse {
	Contract?: { Id: number; Code: string };
	Requisition?: { Id: number; Code: string };
	ChangeOrderContract: { Id: number; Code: string };
}

/**
 * injection token of contract terminate dialog status dialog options
 */
export const CONTRACT_TERMINATE_DIALOG_OPTIONS = new InjectionToken<IContractTerminateWizardOptions>('CONTRACT_TERMINATE_DIALOG_OPTIONS');

@Component({
	selector: 'procurement-contract-procurement-contract-terminate-dialog',
	standalone: true,
	imports: [PlatformCommonModule, GridComponent, DecimalPipe, UiCommonModule, FormsModule],
	templateUrl: './procurement-contract-terminate-dialog.component.html',
	styleUrl: './procurement-contract-terminate-dialog.component.scss',
})
export class ProcurementContractTerminateDialogComponent implements OnInit {
	public readonly options = inject(CONTRACT_TERMINATE_DIALOG_OPTIONS);
	protected readonly translateService = inject(PlatformTranslateService);
	public CreateTerminateContractAs = CreateTerminateContractAs;
	public createAsType: CreateTerminateContractAs = CreateTerminateContractAs.Requisition;
	public bpFormEntityRuntimeData: EntityRuntimeData<IBusinessPartnerLookupData> = new EntityRuntimeData<IBusinessPartnerLookupData>();
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IContractTerminateDialogResult, ProcurementContractTerminateDialogComponent>());
	private readonly http = inject(PlatformHttpService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly FieldType = FieldType;
	protected readonly createAsTypeOptions = {
		itemsSource: {
			items: [
				{
					id: CreateTerminateContractAs.Requisition,
					displayName: { key: 'procurement.contract.wizard.newRequisition' },
				},
				{
					id: CreateTerminateContractAs.Contract,
					displayName: { key: 'procurement.contract.wizard.newContract' },
				},
			],
		},
	};
	public isCreating: boolean = false;

	public terminateItemsGridConfig: IGridConfiguration<IContractTerminateItem> = this.getTerminateItemGridConfigure();
	public bpFormConfig: IFormConfig<IBusinessPartnerLookupData> = this.getBPFormConfig();
	public bpLookupData: IBusinessPartnerLookupData = {};
	public prjChangeFk?: number;
	//TODO: should use the change module lookup. Temporary implement here.
	public prjChangeLookupService = inject(ProcurementShareProjectChangeLookupService);
	public prjChangeLookupOption = {
		serverSideFilter: {
			key: 'project-change-lookup-for-procurement-common-filter',
			execute: () => {
				const contract = this.options.selectedContract;
				return {
					ProjectFk: contract.ProjectFk,
					PrcHeaderConfigurationFk: contract.PrcHeaderEntity ? contract.PrcHeaderEntity.ConfigurationFk : null,
					ContractHeaderFk: contract.ContractHeaderFk,
					IsProcurement: true,
				};
			},
		},
	};

	public ngOnInit() {
		this.onCreateTerminateContractTypeChange();
	}

	/*
	 * Return the current selected contract code to shown in dialog
	 */
	public selectedContractCode() {
		return this.options.selectedContract.Code;
	}

	/*
	 * Call back when OK button is clicked
	 */
	public async onOKBntClicked() {
		if (!this.prjChangeFk) {
			return;
		}

		this.isCreating = true;
		const isTerminateByContract = this.createAsType === CreateTerminateContractAs.Contract;
		const createURL = 'procurement/contract/wizard/terminateContract';
		const createParam = {
			terminateContractAs: this.createAsType,
			conHeaderFk: this.options.selectedContract.Id,
			businessPartnerFk: this.bpLookupData.BusinessPartnerFk,
			contactFk: this.bpLookupData.ContactFk,
			subsidiaryFk: this.bpLookupData.SubsidiaryFk,
			supplierFk: this.bpLookupData.SupplierFk,
			projectChangeFk: this.prjChangeFk,
		};

		const resp = await this.http.post<ITerminateContractResponse>(createURL, createParam);
		const changeOrderContractCode = resp.ChangeOrderContract.Code;
		const requisitionCode = resp.Requisition?.Code;
		const contractCode = resp.Contract?.Code;

		this.dialogWrapper.value = {
			isSuccess: true,
			createAsType: this.createAsType,
			mainContractReqCode: isTerminateByContract ? contractCode : requisitionCode,
			changeOrderCode: changeOrderContractCode,
			navigateIds: isTerminateByContract ? [resp.Contract!.Id, resp.ChangeOrderContract.Id] : [resp.Requisition!.Id],
		};

		this.isCreating = false;
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	/*
	 * Call back for OK button disable or not
	 */
	public okBtnDisabled(): boolean {
		return (
			!this.prjChangeFk || //Project change must be selected.
			(this.createAsType === CreateTerminateContractAs.Contract && !this.bpLookupData.BusinessPartnerFk)
		); //If create as contract BP should be selected
	}

	//TODO businessPartner, Subsidiary, SupplierFk and ContactFk validator will be done after dev-20075 finished
	private getBPFormConfig(): IFormConfig<IBusinessPartnerLookupData> {
		return {
			formId: 'procurement.contract.termination.wizard',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: [
				{
					id: 'businesspartnerfk',
					label: {
						key: 'cloud.common.entityBusinessPartner',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						showClearButton: true,
						viewProviders: [
							{
								provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
								useValue: {
									showBranch: true,
									showContacts: true,
								},
							},
						],
					}),
					model: 'BusinessPartnerFk',
					sortOrder: 1,
					readonly: false,
				},
				{
					id: 'subsidiaryfk',
					label: {
						key: 'cloud.common.entitySubsidiary',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						showClearButton: true,
					}),
					model: 'SubsidiaryFk',
					sortOrder: 1,
					readonly: false,
				},
				{
					id: 'supplierfk',
					label: {
						key: 'cloud.common.entitySupplier',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSupplierLookupService,
						showClearButton: true,
					}),
					model: 'SupplierFk',
					sortOrder: 1,
					readonly: true,
				},
				{
					id: 'contactfk',
					label: {
						key: 'businesspartner.contact.contact',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService,
						showClearButton: true,
					}),
					model: 'ContactFk',
					sortOrder: 1,
					readonly: false,
				},
			],
		};
	}

	private getTerminateItemGridConfigure(): IGridConfiguration<IContractTerminateItem> {
		return {
			uuid: '10de61f515604e40ab330a24325dbac4',
			columns: [
				{
					id: 'Type',
					model: 'Type',
					width: 60,
					type: FieldType.Description,
					label: { key: 'cloud.common.entityType' },
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Itemno',
					model: 'Itemno',
					width: 60,
					type: FieldType.Description,
					label: { key: 'procurement.common.prcItemItemNo' },
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Reference',
					model: 'Reference',
					type: FieldType.Code,
					label: { key: 'cloud.common.entityReference' },
					visible: true,
					width: 100,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Quantity',
					model: 'Quantity',
					type: FieldType.Quantity,
					label: { key: 'cloud.common.entityQuantity' },
					visible: true,
					width: 110,
					sortable: true,
					readonly: true,
				},
				{
					id: 'QuantityDelivered',
					model: 'QuantityDelivered',
					type: FieldType.Quantity,
					label: { key: 'procurement.contract.contractTermination.QuantityDelivered' },
					visible: true,
					width: 110,
					sortable: true,
					readonly: true,
				},
				{
					id: 'QuantityUnDelivered',
					model: 'QuantityUnDelivered',
					type: FieldType.Quantity,
					label: { key: 'procurement.contract.contractTermination.QuantityUnDelivered' },
					visible: true,
					width: 110,
					sortable: true,
					readonly: true,
				},
			],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			items: this.options.contractTerminateItems,
		};
	}

	public onCreateTerminateContractTypeChange() {
		this.bpFormEntityRuntimeData.entityIsReadOnly = this.createAsType === CreateTerminateContractAs.Requisition;
	}
}
