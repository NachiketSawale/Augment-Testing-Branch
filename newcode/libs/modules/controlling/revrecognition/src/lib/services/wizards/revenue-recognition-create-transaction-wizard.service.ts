/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldType, IFormDialogConfig, ILookupContext, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingRevenueRecognitionDataService } from '../../revenue-recognition/revenue-recognition-data.service';
import { ITransactionParamEntity } from '../../model/entities/transaction-param-entity.interface';
import { ControllingCommonCompanyYearLookupService } from '@libs/controlling/common';
import { BasicsCompanyPeriodLookupService } from '@libs/basics/shared';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { firstValueFrom } from 'rxjs';
import { zonedTimeToUtc } from 'date-fns-tz';


@Injectable({
	providedIn: 'root'
})
export class ControllingRevenueRecognitionCreateTransactionWizardService {
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(ControllingRevenueRecognitionDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public async onCreateTransactionWizard() {
		const transactionInitResp = await this.http.get('controlling/RevenueRecognition/wizard/transactionInit');
		if (transactionInitResp) {
			const transactionParamEntity = transactionInitResp as ITransactionParamEntity;
			if (transactionParamEntity.UseCompanyNumber) {
				transactionParamEntity.VoucherNo = this.translateService.instant('cloud.common.isGenerated').text;
			}
			const modelOptions: IFormDialogConfig<ITransactionParamEntity> = {
				headerText: 'controlling.revrecognition.createTransaction.title',
				showOkButton: true,
				formConfiguration: {
					showGrouping: false,
					groups: [
						{
							groupId: 'basicData'
						}
					],
					rows: [{
						groupId: 'basicData',
						id: 'companyYearId',
						model: 'CompanyYearId',
						label: {
							text: 'Company Year',
							key: 'controlling.revrecognition.entityCompanyYearServiceFk'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ControllingCommonCompanyYearLookupService,
							serverSideFilter: {
								key: 'basics-company-period-filter',
								execute: (context) => {
									return 'CompanyFk = ' + this.configurationService.clientId;
								},
							},
						}),
						sortOrder: 1
					}, {
						groupId: 'basicData',
						id: 'companyPeriodId',
						model: 'CompanyPeriodId',
						label: {
							text: 'Company Period',
							key: 'controlling.revrecognition.entityCompanyPeriod'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsCompanyPeriodLookupService,
							showClearButton: true,
							serverSideFilter: {
								key: 'basics-company-period-filter',
								execute: (context: ILookupContext<ICompanyPeriodEntity, ITransactionParamEntity>) => {
									if (context.entity && context.entity.CompanyYearId !== null) {
										return 'CompanyYearFk = ' + (context.entity?.CompanyYearId as number);
									} else {
										return {};
									}
								},
							}
						}),
						change: async (info) => {
							if (info.newValue) {
								const companyPeriodLookupService = ServiceLocator.injector.get(BasicsCompanyPeriodLookupService);
								const companyPeriodItem = await firstValueFrom(companyPeriodLookupService.getItemByKey({id: info.newValue as number}));
								if (companyPeriodItem?.EndDate) {
									info.entity.PostingNarrative = 'Accruals';
									const endDate = zonedTimeToUtc(companyPeriodItem.EndDate, 'UTC').toISOString();
									info.entity.PostingNarrative = `${endDate} ${info.entity.PostingNarrative}`;
									if (info.entity.Abbreviation) {
										info.entity.PostingNarrative = `${info.entity.Abbreviation} ${info.entity.PostingNarrative}`;
									}
								}
							}
						},
						sortOrder: 1
					}, {
						groupId: 'basicData',
						id: 'voucherNo',
						model: 'VoucherNo',
						label: {
							text: 'Voucher No',
							key: 'controlling.revrecognition.createTransaction.voucherNo'
						},
						required: true,
						type: FieldType.Code,
						sortOrder: 1
					}, {
						groupId: 'basicData',
						id: 'postingNarrative',
						model: 'PostingNarrative',
						label: {
							text: 'Posting Narrative',
							key: 'controlling.revrecognition.createTransaction.postingNarrative'
						},
						type: FieldType.Description,
						sortOrder: 1
					}, {
						groupId: 'basicData',
						id: 'comment',
						model: 'Comment',
						label: {
							text: 'Comment',
							key: 'cloud.common.entityCommentText'
						},
						type: FieldType.Comment,
						sortOrder: 1
					}]
				},
				customButtons: [],
				entity: transactionParamEntity
			};
			const result = await this.formDialogService.showDialog(modelOptions);
			if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const transactionParam = result.value;
				const resp = await this.http.post('controlling/RevenueRecognition/wizard/createTransaction', transactionParam);
				if (resp) {
					const createCount = resp as number;
					if (createCount > 0) {
						this.messageBoxService.showInfoBox(
							this.translateService.instant('controlling.revrecognition.createTransaction.companyTransactionCreated', {
								count: createCount,
							}).text,
							'info',
							false,
						);
					} else {
						this.messageBoxService.showInfoBox('controlling.revrecognition.createTransaction.noCompanyTransactionCreated', 'info', false);
					}
					this.dataService.refreshSelected();
				}
			}
		}
	}
}