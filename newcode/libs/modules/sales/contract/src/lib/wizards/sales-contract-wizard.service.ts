/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult,
	IFormConfig,
	IFormDialogConfig, UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import {
	BasicsSharedProcurementConfigurationHeaderLookupService,
	BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
	Rubric
} from '@libs/basics/shared';

import { ContractUpdatePaymentScheduleDegreeOfCompletionWizardService } from '@libs/procurement/contract';
import { IOrdHeaderEntity, IOrdStatusEntity } from '@libs/sales/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { ICreateBillFromContractRequestEntityGenerated } from '../model/entities/create-bill-from-contract-request-entity.interface';
import { IBillTypeEntity } from '../model/entities/sales-contract-bill-type-entity.interface';
import { SalesContractBillTypeLookupService } from '../lookup-services/sales-biiling-type-lookup.service';
import { SalesContractPreviousBillLookupService } from '../lookup-services/sales-contract-previous-bill-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractWizardService {

	protected http = inject(HttpClient);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SalesContractContractsDataService);
	public readonly ContractUpdatePaymentScheduleDegreeOfCompletionWizardService = inject(ContractUpdatePaymentScheduleDegreeOfCompletionWizardService);

	// Create bill wizard service
	public createBill() {
		const selections = this.dataService.getSelection()[0];

		if (!selections && selections == undefined) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		}

		this.http.get(this.configurationService.webApiBaseUrl + 'sales/contract/status/list').subscribe(result => {
			const ordStatus = (result as IOrdStatusEntity[]).filter(item => item.Id === selections.OrdStatusFk)[0];
			if (!ordStatus.IsFinallyBilled && !ordStatus.IsOrdered) {
				this.messageBoxService.showInfoBox('sales.contract.wizardCWCreateBillNotOrderedWarning', 'info', true);
				return;
			}

			if (ordStatus.IsFinallyBilled) {
				this.messageBoxService.showInfoBox('sales.contract.wizardCWCreateBillContractFinallyBilled', 'info', true);
				return;
			}
			this.prepareFormData(selections);
		});
	}

	public BilHeaderIds: ICreateBillFromContractRequestEntityGenerated = {
		BillNo: 'Is generated',
		Description: '',
		RubricCategoryFk: 0,
		TypeFk: 0,
		UseTransferContractQuantityOpt: false
	};

	public getRubricCategoryFromType(){
		this.http.post(this.configurationService.webApiBaseUrl + 'basics/customize/BillType/list',{}).subscribe(result => {
			const defaultData = (result as IBillTypeEntity[]).filter(items => items.IsDefault)[0];
			this.BilHeaderIds.TypeFk = defaultData.Id;
			this.BilHeaderIds.RubricCategoryFk= defaultData.RubricCategoryFk;
		});
	}

	public updatePaymentScheduleDoc(){
		this.ContractUpdatePaymentScheduleDegreeOfCompletionWizardService.onStartWizard();

	}

	public changeRubricCategoryFromType(typeFk: number) {
		this.http.post(this.configurationService.webApiBaseUrl + 'basics/customize/BillType/list', {}).subscribe(result => {
			const defaultData = (result as IBillTypeEntity[]).filter(items => items.Id === typeFk)[0];
			this.BilHeaderIds.RubricCategoryFk = defaultData.RubricCategoryFk;
		});
	}
	private prepareFormData(selections: IOrdHeaderEntity) {

		const mainEntity = this.dataService.getSelection()[0];
		this.getRubricCategoryFromType();

		const config: IFormDialogConfig<ICreateBillFromContractRequestEntityGenerated> = {
			headerText: {text: 'Create Bill from Contract'},
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.BilHeaderIds
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<ICreateBillFromContractRequestEntityGenerated>) => {
			if(result.closingButtonId === 'ok') {
				const bilHeaderEntity = result.value;
				const postData = {
					'billNo' : (bilHeaderEntity ? bilHeaderEntity.BillNo : ''),
					'configurationId' : (bilHeaderEntity ? bilHeaderEntity.ConfigurationFk : null),
					'contractId' : mainEntity.Id,
					'description' : (bilHeaderEntity ? bilHeaderEntity.Description : null),
					'previousBillId' : (bilHeaderEntity ? bilHeaderEntity.PreviousBillFk : null),
					'typeId' : (bilHeaderEntity ? bilHeaderEntity.TypeFk : null),
					'useTransferContractQuantityOpt' : (bilHeaderEntity ? bilHeaderEntity.UseTransferContractQuantityOpt : false)
				};
				const queryPath = this.configurationService.webApiBaseUrl + 'sales/billing/createbillfromcontract';
				this.http.post(queryPath, postData).subscribe((res) => {
					this.messageBoxService.showInfoBox('Bill created successfully!', 'info', true);
					return;
				});
			}
		});
	}

	private generateEditOptionRows(): IFormConfig<ICreateBillFromContractRequestEntityGenerated> {
		let formRows: FormRow<ICreateBillFromContractRequestEntityGenerated>[] = [];
		formRows = [
			{
				id: 'Type',
				label: {
					text: 'Type',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractBillTypeLookupService,
					showClearButton: false
				}),
				model: 'TypeFk',
				readonly: false,
				change: e => {
					if(e.newValue) {
						this.changeRubricCategoryFromType(e.newValue as number);
					}
				}
			},
			{
				id: 'Category',
				label: {
					text: 'Category',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
					serverSideFilter: {
						key: 'rubric-category-by-rubric-company-lookup-filter',
						execute() {
							return { Rubric: Rubric.Bill };
						},
					},
					showClearButton: false,
					readonly: true
				}),
				model: 'RubricCategoryFk',
				readonly: true
			},
			{
				id: 'PreviousBill',
				label: {
					text: 'Previous Bill',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractPreviousBillLookupService,
					showClearButton: true
				}),
				model: 'PreviousBillFk'
			},
			{
				id: 'Configuration',
				label: {
					text: 'Configuration',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationHeaderLookupService,
					showClearButton: true
				}),
				model: 'ConfigurationFk'
			},
			{
				id: 'BillNo',
				label: {
					text: 'BillNo',
				},
				type: FieldType.Description,
				model: 'BillNo',
				readonly: true
			},
			{
				id: 'Description',
				label: {
					text: 'Description',
				},
				type: FieldType.Description,
				model: 'Description'
			},
			{
				id: 'AsBillQuantity',
				label: {
					text: 'Contract Quantity as Bill Quantity',
				},
				type: FieldType.Boolean,
				model: 'UseTransferContractQuantityOpt'
			}
		];
		const formConfig: IFormConfig<ICreateBillFromContractRequestEntityGenerated> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

}