/*
 * Copyright(c) RIB Software GmbH
 */
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { createLookup, FieldType, FormRow, IFieldValueChangeInfo } from '@libs/ui/common';
import { StockAccrualMode } from '../model/enums/stock-accrual-transaction.enum';
import { BasicsCompanyPeriodLookupService, BasicsShareCompanyYearLookupService } from '@libs/basics/shared';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { ValidationResult } from '@libs/platform/data-access';
import { ProcurementCommonCreateAccrualTransactionWizardService } from '@libs/procurement/common';
import { IStockTransactionContextEntity } from '../model/entities/stock-transaction-context-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockCreateAccrualTransactionWizardService extends ProcurementCommonCreateAccrualTransactionWizardService<IStockTransactionContextEntity> {

	private readonly translateSource = 'procurement.stock.wizard.createAccrualTransaction.';

	public constructor() {
		super({
			contextUrlSuffix: 'procurement/stock/accrual/transaction/'
		});
		this.config.translateSource = this.translateSource;
	}

	protected override getAccrualModeOptions() {
		const transactionModeSource = 'procurement.stock.transactionMode.';
		return createLookup({
			dataService: this.lookupServiceFactory.fromItems(
				[
					{id: StockAccrualMode.OneTransactionPerStockTransaction, desc: {key: transactionModeSource + 'OneTransactionperStockTransaction'}},
					{id: StockAccrualMode.OneTransactionPerStockHeader, desc: {key: transactionModeSource + 'OneTransactionperStockHeader'}},
					{id: StockAccrualMode.ConsolidatedByCUAccount, desc: {key: transactionModeSource + 'ConsolidatedCUandAccount'}},
					{id: StockAccrualMode.ConsolidatedByAccount, desc: {key: transactionModeSource + 'ConsolidatedAccount'}},
				],
				{uuid: '6a56f2de317a44f48d2881ea1cc8487c', valueMember: 'id', displayMember: 'desc', translateDisplayMember: true}
			),
		});
	}

	protected override formatData(createParam: IStockTransactionContextEntity) {
		if (createParam.EffectiveDate_Start) {
			createParam.EffectiveDate_Start = new Date(createParam.EffectiveDate_Start);
		}
		if (createParam.EffectiveDate_End) {
			createParam.EffectiveDate_End = new Date(createParam.EffectiveDate_End);
		}
	}

	protected override validateVoucherNumber(createParam: IStockTransactionContextEntity) {
		if (createParam.VoucherNo) {
			this.setValidationResult('VoucherNo', new ValidationResult(
				this.translateService.instant(this.commonTranslate + 'required').text
			));
		} else if (this.wizardRuntimeData.validationResults.some(v => v.field === 'VoucherNo')) {
			this.setValidationResult('VoucherNo');
		}
	}

	protected override generateCommonFormFields(entity: IStockTransactionContextEntity): FormRow<IStockTransactionContextEntity>[] {
		return [
			{
				id: 'companyYear',
				label: {key: this.commonTranslate + 'entityCompanyYearServiceFk'},
				type: FieldType.Composite,
				composite: ['CompanyYearId_Start', 'CompanyYearId_End'].map((field, index) => ({
					id: field,
					model: field,
					label: index === 0 ? undefined : {key: this.commonTranslate + 'to'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareCompanyYearLookupService,
						serverSideFilter: {
							key: 'basics-company-companyyear-filter',
							execute: () => `CompanyFk=${this.configService.clientId}`
						},
					}),
					change: (changeInfo) => this.handleCompanyYearSelection(changeInfo, entity,
						index === 0 ? (periodId) => {
							entity.CompanyPeriodId_Start = periodId;
						} : (periodId) => {
							entity.CompanyPeriodId_End = periodId;
						}),
				})),
			},
			{
				id: 'CompanyPeriod',
				label: {key: this.translateSource + 'entityCompanyPeriod'},
				type: FieldType.Composite,
				composite: ['CompanyPeriodId_Start', 'CompanyPeriodId_End'].map((field, index) => ({
					id: field,
					model: field,
					label: index === 0 ? undefined : {key: this.commonTranslate + 'to'},
					type: FieldType.Lookup,
					lookupOptions: this.getCompanyPeriodLookupOptions(index === 0 ? () => entity.CompanyYearId_Start : () => entity.CompanyYearId_End),
					change: () => this.recalculateEffectiveDateRange(entity),
				})),
			},
			{
				id: 'effectiveDate',
				label: {key: this.translateSource + 'effectiveDate'},
				model: 'effectiveDate',
				type: FieldType.Composite,
				composite: ['EffectiveDate_Start', 'EffectiveDate_End'].map((field, index) => ({
					id: field,
					model: field,
					label: index === 0 ? undefined : {key: this.commonTranslate + 'to'},
					type: FieldType.Date
				})),
			},
			{
				id: 'VoucherNo',
				model: 'VoucherNo',
				label: {key: this.commonTranslate + 'voucherNo'},
				type: FieldType.Code,
				required: true,
				change: () => this.validateVoucherNumber(entity)
			}];
	}

	protected override okBtnDisabled(entity: IStockTransactionContextEntity): boolean {
		if (!entity) {
			return true;
		}
		const isVoucherValid = typeof entity.VoucherNo === 'string' && entity.VoucherNo.trim() !== '';
		const isDateValid = entity.EffectiveDate_Start instanceof Date &&
			entity.EffectiveDate_End instanceof Date &&
			entity.EffectiveDate_Start.getTime() <= entity.EffectiveDate_End.getTime();

		return !isVoucherValid || !isDateValid;
	}

	private async handleCompanyYearSelection(changeInfo: IFieldValueChangeInfo<IStockTransactionContextEntity, PropertyType>,
	                                         data: IStockTransactionContextEntity, setCompanyPeriodId: (periodId: number) => void) {
		if (!changeInfo.newValue) {
			return;
		}

		const items = await firstValueFrom(this.companyPeriodLookupService.getList());
		const periodMap = new Map(items.map(item => [item.CompanyYearFk, item.Id]));
		const matchPeriod = periodMap.get(changeInfo.newValue as number);
		if (matchPeriod) {
			setCompanyPeriodId(matchPeriod);
		}
		await this.recalculateEffectiveDateRange(data);
	}

	private getCompanyPeriodLookupOptions(companyYearIdGet: () => number) {
		return createLookup<IStockTransactionContextEntity, ICompanyPeriodEntity>({
			dataServiceToken: BasicsCompanyPeriodLookupService,
			clientSideFilter: {
				execute: (entity) => entity.CompanyYearFk === companyYearIdGet(),
			},
		});
	}

	private async recalculateEffectiveDateRange(data: IStockTransactionContextEntity) {
		const companyPeriodItem_Start = await firstValueFrom(this.companyPeriodLookupService.getItemByKey({id: data.CompanyPeriodId_Start as number}));
		const companyPeriodItem_End = await firstValueFrom(this.companyPeriodLookupService.getItemByKey({id: data.CompanyPeriodId_End as number}));

		data.EffectiveDate_Start = new Date(companyPeriodItem_Start?.StartDate || Date.now());
		data.EffectiveDate_End = new Date(companyPeriodItem_End?.EndDate || Date.now());

		const effectiveDuration =
			data.CompanyPeriodId_Start === data.CompanyPeriodId_End
				? this.dateService.formatUTC(data.EffectiveDate_End, 'dd/MM/yyyy')
				: this.translateService.instant(this.translateSource + 'postingNarrativePrefix', {
					from: this.dateService.formatUTC(data.EffectiveDate_Start, 'dd/MM/yyyy'),
					to: this.dateService.formatUTC(data.EffectiveDate_End, 'dd/MM/yyyy')
				}).text;

		data.PostingNarrative = effectiveDuration + ' ' + this.translateService.instant(this.translateSource + 'postingNarrativePostfix').text;
		if (data.Abbreviation) {
			data.PostingNarrative = `${data.Abbreviation} ${data.PostingNarrative}`;
		}

		this.checkEffectiveDateValidity(data);
	}

	private setValidationResult(field: string, result?: ValidationResult) {
		//TODO: currently the validation is not work in form dialog. https://rib-40.atlassian.net/browse/DEV-23444, and below still workaround.
		const index = this.wizardRuntimeData.validationResults.findIndex(r => r.field === field);
		if (index > -1) {
			this.wizardRuntimeData.validationResults.splice(index, 1);
		}

		if (result) {
			this.wizardRuntimeData.validationResults.push({
				field: field,
				result: result,
			});
		}
	}

	private checkEffectiveDateValidity(data: IStockTransactionContextEntity) {
		if (!data.EffectiveDate_Start || !data.EffectiveDate_End) {
			return;
		}
		const isValid = data.EffectiveDate_Start.getTime() <= data.EffectiveDate_End.getTime();
		this.setValidationResult('effectiveDate', isValid ? undefined : new ValidationResult(this.translateService.instant(this.commonTranslate + 'invalidateEffectiveDate').text));
	}
}
