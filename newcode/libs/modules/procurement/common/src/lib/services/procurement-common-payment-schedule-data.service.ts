/*
 * Copyright(c) RIB Software GmbH
 */

import { bignumber, round } from 'mathjs';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, find, forEach, sumBy, orderBy } from 'lodash';
import { IReadonlyParentService, IReadonlyRootService } from '@libs/procurement/shared';
import { ILookupViewResult, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BasicsSharedDecimalPlacesEnum as decimalPlacesEnum, BasicsSharedProcurementPaymentScheduleStatusLookupService } from '@libs/basics/shared';
import { ProcurementCommonVatPercentageService } from './procurement-common-vat-percentage.service';
import { ProcurementCommonCalculationService } from './helper/procurement-common-calculation.service';
import { IPrcCommonPaymentScheduleDataServiceInterface, IPrcHeaderDataService } from '../model/interfaces';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ProcurementCommonPaymentScheduleCreateTargetComponent } from '../components/payment-schedule-create-target/payment-schedule-create-target.component';
import { IPrcPaymentScheduleEntity, IPrcCommonPaymentScheduleTotalSourceContextEntity, PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY } from '../model/entities';
import { ProcurementCommonPaymentScheduleReadonlyProcessor } from './processors/procurement-common-payment-schedule-readonly-processor.service';

/**
 * Procurement payment schedule common data service
 */
export abstract class ProcurementCommonPaymentScheduleDataService<
		T extends IPrcPaymentScheduleEntity,
		PT extends IEntityIdentification,
		PU extends CompleteIdentification<PT>,
		RT extends IEntityIdentification = PT,
		RU extends CompleteIdentification<RT> = PU,
	>
	extends DataServiceFlatLeaf<T, PT, PU>
	implements IPrcCommonPaymentScheduleDataServiceInterface<T, PT, PU> {
	protected readonly http = inject(HttpClient);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly vatPercentService = inject(ProcurementCommonVatPercentageService);
	protected readonly calculationService = inject(ProcurementCommonCalculationService);
	protected readonly prcPsStatusService = inject(BasicsSharedProcurementPaymentScheduleStatusLookupService);
	protected readonly sumLineCode = '∑';
	protected readonly defaultPrcPsStatusFk = this.getDefaultPsStatusFk();
	private _paymentScheduleTarget = { netOc: 0, grossOc: 0, net: 0, gross: 0 };
	protected readonly readonlyProcessor: ProcurementCommonPaymentScheduleReadonlyProcessor<T, PT, PU, RT, RU>;
	protected readonly fieldsSumToSumLine: (keyof Pick<IPrcPaymentScheduleEntity, 'PercentOfContract' | 'AmountNet' | 'AmountNetOc' | 'AmountGross' | 'AmountGrossOc'>)[] = [
		'PercentOfContract',
		'AmountNet',
		'AmountNetOc',
		'AmountGross',
		'AmountGrossOc',
	];

	protected constructor(
		protected moduleName: string,
		public totalSourceUrl: string,
		public parentService: IPrcHeaderDataService<PT, PU> & IReadonlyParentService<PT, PU>,
		public rootService: IReadonlyRootService<RT, RU>,
		public paymentScheduleUrl = 'procurement/common/prcpaymentschedule',
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: paymentScheduleUrl,
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPaymentSchedule',
				parent: parentService,
			},
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.createReadonlyProcessor()]);
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonPaymentScheduleReadonlyProcessor(this);
	}

	/**
	 * Update entity readonly status
	 */
	public updateReadOnly(entity: T) {
		this.readonlyProcessor.process(entity);
	}

	/**
	 * Calculate AmountNet/AmountNetOc/AmountGross/AmountGrossOc by PercentOfContract
	 * @param entity
	 */
	public calculateAmountByPercent(entity: T) {
		const isSumLine = this.isSumLine(entity);
		if (isSumLine) {
			return;
		}

		const rate = this.getExchangeRate();
		const valueNetOc = this.paymentScheduleTargetNetOc;
		const grossOc = this.paymentScheduleTargetGrossOc;

		entity.AmountNetOc = round(bignumber(valueNetOc).mul(entity.PercentOfContract).div(100), decimalPlacesEnum.decimalPlaces2).toNumber();
		entity.AmountNet = rate === 0 ? 0 : round(bignumber(entity.AmountNetOc).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
		entity.AmountGrossOc = round(bignumber(grossOc).mul(entity.PercentOfContract).div(100), decimalPlacesEnum.decimalPlaces2).toNumber();
		entity.AmountGross = rate === 0 ? 0 : round(bignumber(entity.AmountGrossOc).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();

		this.setModified([entity]);
	}

	/**
	 * calculate sum line
	 */
	public calculateSumLine() {
		const list = this.getList();
		const sumLine = this.getSumLine();
		this.sumFieldsToSumLine(list, sumLine);
		//TODO DEV-21332
		//service.gridRefresh();
	}

	/**
	 * Whether parent is main entity
	 */
	public abstract isParentMainEntity(parent?: PT): boolean;

	/**
	 * Whether selected item can delete
	 */
	public override canDelete(): boolean {
		if (!super.canDelete()) {
			return false;
		}
		const selected = this.getSelectedEntity();
		return !(!selected || this.isSumLine(selected) || this.isReadonlyStatus(selected));
	}

	/**
	 * Whether it can create
	 */
	public override canCreate(): boolean {
		if (!super.canCreate()) {
			return false;
		}
		const parent = this.parentService.getSelectedEntity();
		return !parent ? false : this.isParentMainEntity(parent);
	}

	protected override provideLoadPayload(): object {
		const prcHeaderContext = this.parentService.getHeaderContext();
		return { MainItemId: prcHeaderContext.prcHeaderFk, moduleName: this.moduleName };
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = loaded as IPrcCommonPaymentScheduleResponse<T>;
		const list = dto.Main;
		this.setPaymentScheduleTargetValue(dto.paymentScheduleNetOc, dto.paymentScheduleGrossOc);
		this.addSumLineToList(list);
		this.calculateRemaining(list);
		return list;
	}

	/**
	 * Get data list
	 */
	public override getList(): T[] {
		const list = super.getList();
		return filter(list, (i) => !this.isSumLine(i));
	}

	/**
	 * Get sum line
	 */
	public getSumLine(): T {
		const list = super.getList();
		return find(list, (i) => this.isSumLine(i))!;
	}

	/**
	 * Create entity
	 */
	public async createEntityNTarget(): Promise<T | undefined> {
		if (this.hasPaymentScheduleTarget) {
			return super.create();
		}
		const isSuccessful = await this.openDialogSetPaymentScheduleTarget();
		return isSuccessful ? super.create() : undefined;
	}

	private async openDialogSetPaymentScheduleTarget() {
		const totalSourceContextEntity = this.getTotalSourceContextEntity();
		const totalSourceEntity = await this.dialogService.show<IPrcCommonPaymentScheduleTotalSourceContextEntity, ProcurementCommonPaymentScheduleCreateTargetComponent>({
			headerText: 'procurement.common.createFirstPaymentScheduleLine',
			width: '500px',
			maxWidth: '1000px',
			resizeable: true,
			bodyComponent: ProcurementCommonPaymentScheduleCreateTargetComponent,
			bodyProviders: [
				{
					provide: PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY,
					useValue: totalSourceContextEntity,
				},
			],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'basics.common.button.ok' },
					isDisabled: (info) => {
						return (info.dialog.body as ProcurementCommonPaymentScheduleCreateTargetComponent).disableOkButton();
					},
					fn: async (evt, info) => {
						(info.dialog.body as ProcurementCommonPaymentScheduleCreateTargetComponent).ok();
					},
				},
			],
		});
		if (totalSourceEntity?.value && totalSourceEntity.closingButtonId === StandardDialogButtonId.Ok) {
			const value = totalSourceEntity.value as ILookupViewResult<IPrcCommonPaymentScheduleTotalSourceContextEntity>;
			if (value?.result) {
				await this.updatePaymentScheduleTarget(value.result.SourceNetOc, value.result.SourceGrossOc);
				this.setPaymentScheduleTargetValue(value.result.SourceNetOc, value.result.SourceGrossOc);
				return true;
			}
		}
		return false;
	}

	private getTotalSourceContextEntity() {
		return {
			ParentId: this.parentService.getSelectedEntity()?.Id,
			ParentConfigurationFk: this.parentService.getHeaderEntity().ConfigurationFk,
			VatPercent: this.getVatPercent(),
			Url: this.totalSourceUrl,
			SourceNetOc: 0,
			SourceGrossOc: 0,
		};
	}

	public async updatePaymentScheduleTarget(netOc: number, grossOc: number) {
		const parentContext = this.parentService.getHeaderContext();
		const param = {
			PrcHeaderFk: parentContext.prcHeaderFk,
			ExchangeRate: parentContext.exchangeRate,
			TotalNetOc: netOc,
			TotalGrossOc: grossOc,
		};
		await this.rootService.save();
		return await firstValueFrom(this.http.post<boolean>(this.configService.webApiBaseUrl + this.paymentScheduleUrl + '/setpaymentscheduletotal', param));
	}

	/**
	 * Get payment schedule target
	 */
	public get paymentScheduleTarget() {
		return this._paymentScheduleTarget;
	}

	/**
	 * Payment schedule total netOc
	 */
	public get paymentScheduleTargetNetOc() {
		return this.paymentScheduleTarget.netOc;
	}

	/**
	 * Payment schedule total grossOc
	 */
	public get paymentScheduleTargetGrossOc() {
		return this.paymentScheduleTarget.grossOc;
	}

	/**
	 * Payment schedule total grossOc
	 */
	public get hasPaymentScheduleTarget() {
		return this.paymentScheduleTarget.netOc && this.paymentScheduleTarget.grossOc;
	}

	protected setPaymentScheduleTargetValue(netOc: number, grossOc: number) {
		const exchangeRate = this.getExchangeRate();
		this._paymentScheduleTarget = {
			netOc: netOc,
			grossOc: grossOc,
			net: this.calculationService.getHomeValueByOcValue(netOc, exchangeRate),
			gross: this.calculationService.getHomeValueByOcValue(grossOc, exchangeRate),
		};
	}

	/**
	 * whether disable recalculate button
	 */
	public disabledRecalculateTo100(): boolean {
		const parent = this.parentService.getSelectedEntity();
		return !parent ? true : !this.isParentMainEntity(parent);
	}

	/**
	 * Recalculate to 100%
	 */
	public async recalculateTo100() {
		const entity = this.getSelectedEntity();
		const parent = this.parentService.getSelectedEntity();
		if (!entity || !parent) {
			return;
		}

		const headerContext = this.parentService.getHeaderContext();
		const param = {
			mainItemId: entity.Id,
			ProjectFk: headerContext.projectFk,
			moduleName: this.moduleName,
			prcHeaderFk: entity.PrcHeaderFk,
			taxCodeFk: headerContext.taxCodeFk,
			exchangeRate: headerContext.exchangeRate,
			parentHeaderId: parent.Id,
		};
		await this.rootService.save();
		await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + this.paymentScheduleUrl + '/recalculate', param));
		await this.load({ id: 0, pKey1: parent.Id });
	}

	/**
	 * Get vat percent
	 */
	public getVatPercent(): number {
		const headerContext = this.parentService.getHeaderContext();
		return this.vatPercentService.getVatPercent(headerContext.taxCodeFk, headerContext.vatGroupFk);
	}

	/**
	 * Get header exchange rate
	 */
	public getExchangeRate(): number {
		const headerContext = this.parentService.getHeaderContext();
		return headerContext.exchangeRate;
	}

	protected addSumLineToList(list: T[]) {
		const existSumLine = find(list, { Code: this.sumLineCode });
		if (!existSumLine) {
			list.unshift(this.createSumLine(list) as T);
		}
	}

	protected createSumLine(list: T[]): IPrcPaymentScheduleEntity {
		const sumLine = this.createEmptyLine();
		this.sumFieldsToSumLine(list, sumLine);
		return sumLine;
	}

	protected sumFieldsToSumLine(list: T[], sumLine: IPrcPaymentScheduleEntity) {
		forEach(this.fieldsSumToSumLine, (field) => {
			sumLine[field] = sumBy(list, field);
		});
	}

	private createEmptyLine(): IPrcPaymentScheduleEntity {
		const parentHeaderContext = this.parentService.getHeaderContext();
		return {
			Id: 0,
			Code: this.sumLineCode,
			Sorting: 0,
			Description: '',
			PrcHeaderFk: parentHeaderContext.prcHeaderFk,
			PrcPsStatusFk: this.defaultPrcPsStatusFk,
			DateRequest: new Date().toISOString(),
			PercentOfContract: 0,
			AmountNet: 0,
			AmountNetOc: 0,
			AmountGross: 0,
			AmountGrossOc: 0,
			CommentText: '',
			PaymentVersion: '',
			MeasuredPerformance: 0,
			IsTotal: false,
			IsLive: true,
			IsDone: false,
			Remaining: 0,
			RemainingOc: 0,
		};
	}

	private getDefaultPsStatusFk(): number {
		const statuses = this.prcPsStatusService.syncService?.getListSync() ?? [];
		const livedStatuses = statuses.filter((s) => s.IsLive && s.Sorting !== 0);
		const defaultStatus = orderBy(livedStatuses.length ? livedStatuses : statuses, ['IsDefault', 'Sorting', 'Id'], ['desc', 'asc', 'asc']);
		return defaultStatus[0].Id;
	}

	protected isSumLine(item: T): boolean {
		return item.Code === this.sumLineCode;
	}

	protected isReadonlyStatus(item: T): boolean {
		const psStatuses = this.prcPsStatusService.syncService?.getListSync();
		const psStatus = find(psStatuses, { Id: item.PrcPsStatusFk });
		return !!psStatus?.IsReadOnly;
	}

	public calculateRemaining(list?: T[], refreshGrid: boolean = true) {
		list = list ?? this.getList();
		const exchangeRate = this.getExchangeRate();
		let remainingOc = this.paymentScheduleTargetNetOc;
		forEach(list, (item) => {
			item.RemainingOc = this.calculationService.roundTo(bignumber(remainingOc).sub(item.AmountNetOc).toNumber(), 2);
			item.Remaining = this.calculationService.getHomeValueByOcValue(item.RemainingOc, exchangeRate);
			remainingOc = item.RemainingOc;
		});
		if (refreshGrid) {
			//TODO DEV-21332
			//service.gridRefresh();
		}
	}

	/**
	 * Whether show grid container header total setting part
	 */
	public isShowTotalSetting(parent: PT) {
		return this.isParentMainEntity(parent);
	}
}

export interface IPrcCommonPaymentScheduleResponse<T> {
	Main: T[];
	paymentScheduleNetOc: number;
	paymentScheduleGrossOc: number;
	hasTotalSetting: boolean;
}
