/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { createLookup, FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import {
	BasicsCompanyLookupService,
	BasicsSharedBillTypeLookupService, BasicsSharedClerkLookupService,
	BasicsSharedProcurementConfigurationLookupService, BasicsSharedRubricCategoryLookupService
} from '@libs/basics/shared';
import { ISalesConfigurationHeaderEntity } from '@libs/sales/shared';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { SalesContractAdvanceDataService } from '../services/sales-contract-advance-data.service';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { IBillTypeEntity } from '../model/entities/sales-contract-bill-type-entity.interface';
import { SalesContractNumberGenerationModel } from '../model/sales-contract-number-generation.model';

@Injectable({
	providedIn: 'root'
})
export class SalesContractGenerateAdvancePaymentBillWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	public advanceDataService: SalesContractAdvanceDataService = inject(SalesContractAdvanceDataService);

	public generateAdvancePaymentBill() {
		this.showChangeCodeDialog();
	}

	public async showChangeCodeDialog(): Promise<boolean> {

		const selectedEntity = this.advanceDataService.getSelectedEntity();
		const selectedMainEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
			return false;
		}

		if(selectedEntity.BilHeaderFk && selectedEntity.BilHeaderFk != 0) {
			this.messageBoxService.showMsgBox(this.translateService.instant('sales.contract.entityAdvanceBilHeaderValidation').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
			return false;
		}

		const entity: ISalesGenerateAdvancePaymentBillEntity = {
			Id: selectedEntity?.Id ?? 0,
			BillNo: '',
			BillType: 0,
			Category: 0,
			Configuration: 0,
			Description: '',
			CompanyFk: selectedMainEntity?.CompanyFk ?? 0,
			ClerkFk: selectedMainEntity?.ClerkFk ?? 0
		};

		const config: IFormDialogConfig<ISalesGenerateAdvancePaymentBillEntity> = {
			headerText: 'Generate Bill From Advance Line',
			formConfiguration: this.generateFormConfig(),
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesGenerateAdvancePaymentBillEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const postData = {
					ContractId: selectedMainEntity?.Id,
					AdvanceId: selectedEntity.Id,
					BillTypeFk: result.value.BillType,
					RubricCategoryFk: result.value.Category,
					ConfigurationFk: result.value.Configuration,
					BillNo: result.value.BillNo,
					Description: result.value.Description,
					ResponsibleCompanyFk: result.value.CompanyFk,
					ClerkFk: result.value.ClerkFk,
					AdvanceDate: selectedEntity.DateDue
				};

				// create bill from post data
				this.http.post(this.configService.webApiBaseUrl + 'sales/billing/createBillFromContractAdvance', postData).subscribe((res) => {
					res = res as IBillHeaderEntity;
					if(res) {
						selectedEntity.BilHeaderFk = (res as IBillHeaderEntity).Id;
						this.messageBoxService.showInfoBox('Create Bill Successfully!', 'info', true);
					} else {
						this.messageBoxService.showMsgBox(this.translateService.instant('sales.contract.generalError').text, this.translateService.instant('Generate Bill From Advance Line').text, 'ico-warning');
					}
				});
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISalesGenerateAdvancePaymentBillEntity> {
		const formRows: FormRow<ISalesGenerateAdvancePaymentBillEntity>[] = [
			{
				id: 'BilType',
				label: 'Bil Type',
				type: FieldType.Lookup,
				model: 'BilType',
				required: false,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedBillTypeLookupService,
					showClearButton: false
				}),
				change: changeInfo => {
					this.http.post(this.configService.webApiBaseUrl + 'basics/customize/billtype/list', {}).subscribe(e => {
						const selectedType = (e as IBillTypeEntity[]).filter(x => x.Id == changeInfo.newValue)[0];
						if(selectedType) {

							// set category
							changeInfo.entity.Category = selectedType.RubricCategoryFk;

							this.http.get(this.configService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk=7)').subscribe(configs => {
								const configList = (configs as ISalesConfigurationHeaderEntity[]).filter(x => x.RubricCategoryFk == selectedType.RubricCategoryFk);
								const selectedConfig = configList[configList.length - 1];
								if(selectedConfig) {
									// set configuration
									changeInfo.entity.Configuration = selectedConfig.Id;
								}
							});

							// number generation logic
							this.http.get(this.configService.webApiBaseUrl + 'sales/contract/numbergeneration/list').subscribe(response => {
								const numberList = response as SalesContractNumberGenerationModel[];
								const isGenerated = numberList.filter(x=> x.RubricCatID == selectedType.RubricCategoryFk);
								if(isGenerated) {
									changeInfo.entity.BillNo = 'Is generated';
								} else {
									changeInfo.entity.BillNo = '';
								}
							});
						}
					});
				}
			},
			{
				id: 'Category',
				label: 'Category',
				type: FieldType.Lookup,
				model: 'Category',
				required: false,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					showClearButton: false
				}),
			},
			{
				id: 'Configuration',
				label: 'Configuration',
				type: FieldType.Lookup,
				model: 'Configuration',
				required: false,
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
				required: false,
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
				required: false,
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
				required: false,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: false
				}),
			},
		];
		return {
			formId: 'generate.advance.bill.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}
}

export interface ISalesGenerateAdvancePaymentBillEntity {
	Id: number | undefined;
	BillType: number;
	Category: number;
	Configuration: number;
	BillNo: string;
	Description?: string;
	CompanyFk: number;
	ClerkFk: number;
}