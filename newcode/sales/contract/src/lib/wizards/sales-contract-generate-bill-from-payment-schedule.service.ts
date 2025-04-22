/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import { createLookup, FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, IGridConfiguration, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import {
	BasicsCompanyLookupService,
	BasicsSharedBillTypeLookupService,
	BasicsSharedClerkLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedRubricCategoryLookupService
} from '@libs/basics/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { ISalesConfigurationHeaderEntity, SalesSharedWipLookupService } from '@libs/sales/shared';
import { IOrdBoqEntity, IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { SalesContractPaymentScheduleDataService } from '../services/sales-contract-payment-schedule-data.service';
import { SalesContractBilHeaderLookupService } from '../lookup-services/sales-contract-bil-header.service';
import { OrdBoqLookupService } from '../lookup-services/sales-contract-boq.service';
import { IBillTypeEntity } from '../model/entities/sales-contract-bill-type-entity.interface';
import { SalesContractNumberGenerationModel } from '../model/sales-contract-number-generation.model';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesContractGenerateBillFromPaymentScheduleWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	protected formConfig: IFormConfig<ISalesGeneratePaymentScheduleBillEntity> = { rows: [] };
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	public paymentScheduleDataService: SalesContractPaymentScheduleDataService= inject(SalesContractPaymentScheduleDataService);
	public BoqHeaderFk: number = 0;
	public BoqFk: number = 0;

	public generateBillFromPaymentSchedule() {
		this.showGenerateBillDialog();
	}

	public async showGenerateBillDialog(): Promise<boolean> {

		const selectedEntity = this.paymentScheduleDataService.getSelectedEntity();
		const selectedMainEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
			return false;
		}

		if(selectedEntity.BilHeaderFk && selectedEntity.BilHeaderFk != 0) {
			this.messageBoxService.showMsgBox(this.translateService.instant('sales.contract.entityPaymentScheduleBilHeaderValidation').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
			return false;
		}

		const entity: ISalesGeneratePaymentScheduleBillEntity = {
			Id: selectedEntity?.Id ?? 0,
			GenerateOption: 0,
			BillNo: '',
			BillTypeFk: 1,
			CategoryFk: 0,
			ConfigurationFk: 0,
			Description: '',
			CompanyFk: selectedMainEntity?.CompanyFk ?? 0,
			ClerkFk: selectedMainEntity?.ClerkFk ?? 0,
			PreviousBillFk: 0,
			BoqFk: 0,
			WipHeaderFk: null,
			selectedSchedule: [selectedEntity]
		};

		// updating form config as per selected type
		this.updateConfigurationSetting(entity);

		this.formConfig = this.generateFormConfig();

		const config: IFormDialogConfig<ISalesGeneratePaymentScheduleBillEntity> = {
			headerText: 'Generate Bill From Payment Schedule',
			formConfiguration: this.formConfig,
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesGeneratePaymentScheduleBillEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {

				// field validation
				if(result.value?.GenerateOption === 0 && !result.value?.BoqFk) {
					this.messageBoxService.showMsgBox('Please select BoQ!', this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
					return;
				} else if(result.value?.GenerateOption && !result.value?.WipHeaderFk) {
					this.messageBoxService.showMsgBox('Please select WIP!', this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
					return;
				}
				if(!result.value?.PreviousBillFk){
					this.messageBoxService.showMsgBox('Please select Previous Bill!', this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
					return;
				}

				this.getBoqItemDetails(selectedMainEntity?.Id ?? 0, result.value?.BoqFk ?? 0).then(resp => {
					const postData = {
						BillNo: result.value?.BillNo,
						BillTypeFk: result.value?.BillTypeFk,
						BoqFk: this.BoqFk,
						BoqHeaderFk: this.BoqHeaderFk,
						ClerkFk: result.value?.ClerkFk,
						ConfigurationFk: result.value?.ConfigurationFk,
						ContractId: selectedMainEntity?.Id ?? 0,
						Description: result.value?.Description,
						PaymentScheduleDateRequest: selectedEntity.DateRequest,
						PaymentScheduleId: selectedEntity.Id,
						PaymentSchedulePaymentBalanceNet: selectedEntity.PaymentBalanceNet,
						PreviousBillFk: result.value?.PreviousBillFk,
						RadioTypeId: result.value?.GenerateOption,
						ResponsibleCompanyFk: result.value?.CompanyFk,
						RubricCategoryFk: result.value?.CategoryFk,
						WipFk: result.value?.WipHeaderFk
					};

					// create bill from post data
					this.http.post(this.configService.webApiBaseUrl + 'sales/billing/createbillfromcontractpaymentschedule', postData).subscribe((res) => {
						res = res as IBillHeaderEntity;
						if(res) {
							selectedEntity.BilHeaderFk = (res as IBillHeaderEntity).Id;
							this.messageBoxService.showInfoBox('Create Bill Successfully!', 'info', true);
						} else {
							this.messageBoxService.showMsgBox(this.translateService.instant('sales.contract.generalError').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
						}
					});
				});
			}
		});

		return ret;
	}

	private gridConfiguration:  IGridConfiguration<IOrdPaymentScheduleEntity> =  {
		uuid: 'b1bc74f523a54da38ca78dfd92021399',
		idProperty: 'Id',
		skipPermissionCheck: true,
		columns:[
			{
				id: 'Code',
				sortable: false,
				model: 'Code',
				label: {
					key: 'cloud.common.entityCode',
				},
				type: FieldType.Code,
				width: 100,
				visible: true,
				readonly: true
			},
			{
				id: 'DatePayment',
				sortable: false,
				model: 'DatePayment',
				label: 'Payment Date',
				type: FieldType.Date,
				width: 100,
				visible: true,
				readonly: true
			},
			{
				id: 'DateRequest',
				sortable: false,
				model: 'DateRequest',
				label: 'Request Date',
				type: FieldType.Date,
				width: 100,
				visible: true,
				readonly: true
			},
			{
				id: 'AmountNetOc',
				sortable: false,
				model: 'AmountNetOc',
				label: 'Net Amount',
				type: FieldType.Text,
				width: 100,
				visible: true,
				readonly: true
			},
			{
				id: 'AmountGrossOc',
				sortable: false,
				model: 'AmountGrossOc',
				label: 'Net Amount',
				type: FieldType.Text,
				width: 100,
				visible: true,
				readonly: true
			}
		]
	};

	private generateFormConfig(): IFormConfig<ISalesGeneratePaymentScheduleBillEntity> {
		const formRows: FormRow<ISalesGeneratePaymentScheduleBillEntity>[] = [
			{
				id: 'selectedSchedule',
				type: FieldType.Grid,
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 100,
				model: 'selectedSchedule',
			},
			{
				id: 'GenerateOption',
				type: FieldType.Radio,
				model: 'GenerateOption',
				readonly: false,
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: 'Generate lumpsum bill from contract(with lumpsum BoQ)' // TODO: Translated text required
						},
						{
							id: 1,
							displayName: 'Generate quantity-based bill from WIP(Ignore Amount from Payment Schedule)' // TODO: Translated text required
						}
					]
				},
				change: (changeInfo) => {
					const WipHeaderRow = _.find(this.formConfig.rows, { id: 'WipHeaderFk' });
					const ExistedBoqRow = _.find(this.formConfig.rows, { id: 'BoqFk' });
					if(WipHeaderRow && ExistedBoqRow){
						if(changeInfo.newValue === 0){
							WipHeaderRow.readonly = true;
							ExistedBoqRow.readonly = false;
							changeInfo.entity.WipHeaderFk = null;
						} else{
							WipHeaderRow.readonly = false;
							ExistedBoqRow.readonly = true;
							changeInfo.entity.BoqFk = null;
						}
					}
				}
			},
			{
				id: 'WipHeaderFk',
				label: 'WIP',
				type: FieldType.Lookup,
				model: 'WipHeaderFk',
				required: false,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: SalesSharedWipLookupService,
					showClearButton: false
				})
			},
			{
				id: 'PreviousBillFk',
				label: 'Previous Bill',
				type: FieldType.Lookup,
				model: 'PreviousBillFk',
				required: true,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: SalesContractBilHeaderLookupService,
					showClearButton: false,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Description'
				}),
			},
			{
				id: 'BoqFk',
				label: 'Existed BoQ',
				type: FieldType.Lookup,
				model: 'BoqFk',
				required: false,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: OrdBoqLookupService,
					showClearButton: false,
					showDescription: true,
					descriptionMember: 'BoqRootItem.BriefInfo.Description'
				}),
			},
			{
				id: 'BillTypeFk',
				label: 'Bil Type',
				type: FieldType.Lookup,
				model: 'BillTypeFk',
				required: true,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedBillTypeLookupService,
					showClearButton: false
				})
			},
			{
				id: 'CategoryFk',
				label: 'Category',
				type: FieldType.Lookup,
				model: 'CategoryFk',
				required: true,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					showClearButton: false
				}),
			},
			{
				id: 'ConfigurationFk',
				label: 'Configuration',
				type: FieldType.Lookup,
				model: 'ConfigurationFk',
				required: true,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					showClearButton: false
				}),
			},
			{
				id: 'BillNo',
				label: 'Bill No.',
				type: FieldType.Code,
				model: 'BillNo',
				required: true,
				readonly: false
			},
			{
				id: 'Description',
				label: 'Description',
				type: FieldType.Description,
				model: 'Description',
				required: false,
				readonly: false
			},
			{
				id: 'CompanyFk',
				label: 'Profit Center',
				type: FieldType.Lookup,
				model: 'CompanyFk',
				required: true,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName'
				}),
			},
			{
				id: 'ClerkFk',
				label: 'ClerkFk',
				type: FieldType.Lookup,
				model: 'ClerkFk',
				required: true,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: false
				}),
			}
		];
		return {
			formId: 'generate.paymentschedule.bill.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}

	public updateConfigurationSetting(entity: ISalesGeneratePaymentScheduleBillEntity){
		this.http.post(this.configService.webApiBaseUrl + 'basics/customize/billtype/list', {}).subscribe(e => {
			const selectedType = (e as IBillTypeEntity[]).filter(x => x.Id == entity.BillTypeFk)[0];
			if(selectedType) {

				// set category
				entity.CategoryFk = selectedType.RubricCategoryFk;

				this.http.get(this.configService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk=7)').subscribe(configs => {
					const configList = (configs as ISalesConfigurationHeaderEntity[]).filter(x => x.RubricCategoryFk == selectedType.RubricCategoryFk);
					const selectedConfig = configList[configList.length - 1];
					if(selectedConfig) {
						// set configuration
						entity.ConfigurationFk = selectedConfig.Id;
					}
				});

				// number generation logic
				this.http.get(this.configService.webApiBaseUrl + 'sales/contract/numbergeneration/list').subscribe(response => {
					const numberList = response as SalesContractNumberGenerationModel[];
					const isGenerated = numberList.filter(x=> x.RubricCatID == selectedType.RubricCategoryFk);
					const BillNoRow = _.find(this.formConfig.rows, { id: 'BillNo' });
					if(isGenerated) {
						entity.BillNo = 'Is generated';
						BillNoRow ? BillNoRow.readonly = true : '';
					} else {
						entity.BillNo = '';
						BillNoRow ? BillNoRow.readonly = false : '';
					}
				});
			}
		});
	}

	public async getBoqItemDetails(ordHeaderFk: number, selectedBoq: number){
		return await this.http.get(this.configService.webApiBaseUrl + 'sales/contract/boq/list?contractId=' + ordHeaderFk).toPromise().then((res) => {
			const filteredData = (res as IOrdBoqEntity[]).filter(x => x.Id = selectedBoq)[0];
			this.BoqHeaderFk = filteredData.BoqRootItem.BoqHeaderFk ?? 0;
			this.BoqFk = (filteredData.BoqRootItem.BoqItemPrjItemFk ?? 0) + 1; // to get PrjBoqItemFk
		});
	}
}

export interface ISalesGeneratePaymentScheduleBillEntity {
	Id: number | undefined;
	selectedSchedule: IOrdPaymentScheduleEntity[],
	GenerateOption: number;
	WipHeaderFk?: number | null;
	PreviousBillFk: number;
	BoqFk?: number | null;
	BillTypeFk: number;
	CategoryFk: number;
	ConfigurationFk?: number | null;
	BillNo: string;
	Description?: string | null;
	CompanyFk: number;
	ClerkFk: number;
}