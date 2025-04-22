/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import { createLookup, FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedSCurveLookupService } from '@libs/basics/shared';
import {DeliveryScheduleRepeatOptions, ProcurementCommonVatPercentageService} from '@libs/procurement/common';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractGeneratePaymentScheduleWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	protected formConfig: IFormConfig<ISalesGeneratePaymentScheduleEntity> = { rows: [] };
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	protected readonly getVatPercentService = inject(ProcurementCommonVatPercentageService);

	public generatePaymentSchedule() {
		this.showGeneratePaymentScheduleDialog();
	}

	public async showGeneratePaymentScheduleDialog(): Promise<boolean> {

		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Generate Payment Schedule').text, 'ico-warning');
			return false;
		}

		const entity: ISalesGeneratePaymentScheduleEntity = {
			SCurve: 0,
			UserFrequencyLookup: 1,
			CodeMask: '##',
			EndDate: '',
			IsDelay: false,
			StartDate: '',
			DescriptionMask: 'Payment-##',
			TotalGrossOc: selectedEntity?.AmountGrossOc ?? 0,
			TotalNetOc: selectedEntity?.AmountNetOc ?? 0,
			UserFrequency: 1,
			Occurrence: null
		};

		this.formConfig = this.generateFormConfig();

		const config: IFormDialogConfig<ISalesGeneratePaymentScheduleEntity> = {
			headerText: 'Generate Payment Schedule',
			formConfiguration: this.formConfig,
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesGeneratePaymentScheduleEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				await this.getVatPercentService.getTaxCodeNMatrixData();
				const vatPercent = this.getVatPercentService.getVatPercent(selectedEntity.TaxCodeFk);
				if(_.isNull(result.value.CodeMask) || _.isNull(result.value.StartDate) || _.isNull(result.value.EndDate) || _.isNull(result.value.DescriptionMask) || _.isNull(result.value.TotalNetOc) || _.isNull(result.value.TotalGrossOc)) {
					this.messageBoxService.showMsgBox('Please fill all the mandatory fields!', this.translateService.instant('Generate Payment Schedule').text, 'ico-warning');
					return;
				}
				const postData = {
					CodeMask: result.value.CodeMask,
					DescriptionMask: result.value.DescriptionMask,
					EndWork: result.value.EndDate,
					ExchangeRate: selectedEntity.ExchangeRate,
					HeaderFk: selectedEntity.Id,
					IsDelay: result.value.IsDelay,
					OcPercent: this.getOcPercent(selectedEntity),
					Occurence: result.value.Occurrence ?? 1,
					RadioType: result.value.SCurve,
					Repeat: result.value.UserFrequencyLookup,
					ScurveFk: result.value.ScurveFk ?? 0,
					StartWork: result.value.StartDate,
					TotalCost: result.value.TotalNetOc,
					TotalOcGross: result.value.TotalGrossOc,
					VatPercent: vatPercent
				};

				const queryPath = this.configService.webApiBaseUrl + 'sales/contract/paymentschedule/generateByWizard';
				this.http.post(queryPath, postData).subscribe((res) => {
					this.messageBoxService.showInfoBox('Generate Payment Schedule Successfully.', 'info', true);
					this.headerDataService.refreshSelected();
					return;
				});
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISalesGeneratePaymentScheduleEntity> {
		const formRows: FormRow<ISalesGeneratePaymentScheduleEntity>[] = [
			{
				id: 'SCurve',
				type: FieldType.Radio,
				model: 'SCurve',
				readonly: false,
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: 'S-Curve'
						},
						{
							id: 1,
							displayName: 'User Frequency'
						}
					]
				},
				change: (changeInfo) => {
					if (this.formConfig !== null) {

						const sCurveLookup = _.find(this.formConfig.rows, { id: 'ScurveFk' });
						const userFrequencyLookup = _.find(this.formConfig.rows, { id: 'UserFrequencyLookup' });
						const IsDelay = _.find(this.formConfig.rows, { id: 'IsDelay' });

						if(changeInfo.newValue === 0) {
							if (userFrequencyLookup && sCurveLookup && IsDelay) {
								userFrequencyLookup.readonly = true;
								sCurveLookup.readonly = false;
								IsDelay.readonly = false;
							}
						}

						if(changeInfo.newValue === 1) {
							if (sCurveLookup && userFrequencyLookup && IsDelay) {
								sCurveLookup.readonly = true;
								userFrequencyLookup.readonly = false;
								IsDelay.readonly = true;
								changeInfo.entity.IsDelay = false;
							}
						}
					}
				}
			},
			{
				id: 'ScurveFk',
				type: FieldType.Lookup,
				label: 'S-Curve',
				model: 'ScurveFk',
				required: true,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedSCurveLookupService,
					showClearButton: false
				}),
			},
			{
				id: 'UserFrequencyLookup',
				type: FieldType.Lookup,
				label: 'User Frequency',
				model: 'UserFrequencyLookup',
				required: true,
				readonly: true,
				lookupOptions: createLookup({
					dataService: this.lookupServiceFactory.fromItems(
						[
							{
								id: DeliveryScheduleRepeatOptions.weekly,
								desc: {
									key: 'procurement.common.wizard.generateDeliverySchedule.weekly',
								}
							},
							{
								id: DeliveryScheduleRepeatOptions.monthly,
								desc: {
									key: 'procurement.common.wizard.generateDeliverySchedule.monthly',
								}
							},
							{
								id: DeliveryScheduleRepeatOptions.quarterly,
								desc: {
									key: 'procurement.common.wizard.generateDeliverySchedule.quarterly',
								}
							},
							{
								id: DeliveryScheduleRepeatOptions.userSpecified,
								desc: {
									key: 'procurement.common.wizard.generateDeliverySchedule.userSpecified',
								}
							},
						],
						{
							uuid: '020610ddfaf14c4bbb3dd4e55321225c',
							valueMember: 'id',
							displayMember: 'desc',
							translateDisplayMember: true
						}
					)
				}),
				change: (changeInfo) => {
					const Occurrence = _.find(this.formConfig.rows, { id: 'Occurrence' });
					if(changeInfo.newValue === DeliveryScheduleRepeatOptions.userSpecified) {
						if(Occurrence) {
							Occurrence.readonly = false;
						}
						changeInfo.entity.Occurrence = 1;
					} else{
						if(Occurrence) {
							Occurrence.readonly = true;
						}
						changeInfo.entity.Occurrence = null;
					}
				}
			},
			{
				id: 'Occurrence',
				label: 'Occurrence',
				type: FieldType.Code,
				model: 'Occurrence',
				required: false,
				readonly: true
			},
			{
				id: 'CodeMask',
				label: 'Code Mask',
				type: FieldType.Code,
				model: 'CodeMask',
				required: true
			},
			{
				id: 'DescriptionMask',
				label: 'Description Mask',
				type: FieldType.Code,
				model: 'DescriptionMask',
				required: true
			},
			{
				id: 'TotalNetOc',
				label: 'Total OC (Net)',
				type: FieldType.Description,
				model: 'TotalNetOc',
				required: true
			},
			{
				id: 'TotalGrossOc',
				label: 'Total OC (Gross)',
				type: FieldType.Description,
				model: 'TotalGrossOc',
				required: true
			},
			{
				id: 'StartDate',
				label: 'Start Date',
				type: FieldType.Date,
				model: 'StartDate',
				required: true
			},
			{
				id: 'EndDate',
				label: 'End Date',
				type: FieldType.Date,
				model: 'EndDate',
				required: true
			},
			{
				id: 'IsDelay',
				label: 'Is Delay',
				type: FieldType.Boolean,
				model: 'IsDelay',
				required: true,
				readonly: false
			},
		];
		return {
			formId: 'generate.payment.schedule.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}

	protected getOcPercent(selectedEntity: IOrdHeaderEntity) {
		if (!selectedEntity.AmountNetOc || !selectedEntity.AmountGrossOc || selectedEntity.AmountNetOc === 0 || selectedEntity.AmountGrossOc === 0) {
			return 0;
		} else {
			return parseFloat((selectedEntity.AmountGrossOc / selectedEntity.AmountNetOc).toString());
		}
	}
}

export interface ISalesGeneratePaymentScheduleEntity {
	SCurve: number;
	ScurveFk?: number | null;
	UserFrequencyLookup?: number | null;
	UserFrequency: number;
	Occurrence?: number | null;
	CodeMask: string;
	DescriptionMask: string;
	TotalNetOc: number;
	TotalGrossOc: number;
	StartDate: string;
	EndDate: string;
	IsDelay: boolean
}