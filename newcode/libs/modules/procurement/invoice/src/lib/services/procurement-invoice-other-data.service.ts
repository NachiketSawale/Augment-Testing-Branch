/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInvHeaderEntity, IInvOtherEntity, InvComplete, InvOtherComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { BasicsSharedCalculateOverGrossService, BasicsShareProcurementConfigurationToBillingSchemaLookupService, MainDataDto } from '@libs/basics/shared';
import { IExchangeRateChangedEvent, ProcurementCommonCalculationService, ProcurementCommonVatPercentageService } from '@libs/procurement/common';
import { bignumber } from 'mathjs';
import { firstValueFrom } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { ProcurementInvoiceOtherReadonlyProcessor } from './processors/procurement-invoice-other-readonly-processor.service';
import { ProcurementInvoiceOtherDataProcessor } from './processors/procurement-invoice-other-data-processor.class';


@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceOtherDataService extends DataServiceFlatNode<IInvOtherEntity, InvOtherComplete, IInvHeaderEntity, InvComplete> {

	public readonly readonlyProcessor: ProcurementInvoiceOtherReadonlyProcessor;
	public readonly dataProcessor: ProcurementInvoiceOtherDataProcessor;
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;
	private readonly vatPercentService = inject(ProcurementCommonVatPercentageService);
	private readonly itemCalculationHelper = inject(ProcurementCommonCalculationService);
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvOtherEntity> = {
			apiUrl: 'procurement/invoice/other',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvOtherEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Node,
				itemName: 'InvOther',
				parent: parentService,
			},
		};
		super(options);
		this.readonlyProcessor = new ProcurementInvoiceOtherReadonlyProcessor(this, this.parentService);
		this.dataProcessor = new ProcurementInvoiceOtherDataProcessor(this);
		this.processor.addProcessor([
			this.readonlyProcessor,
			this.dataProcessor
		]);

		this.parentService.exchangeRateChanged$.subscribe((e) => {
			this.onParentExchangeRateChanged(e);
		});
		this.parentService.billingSchemaChanged$.subscribe((e) => {
			this.onParentBillingSchemaChanged(e);
		});
		this.parentService.vatGroupChanged$.subscribe((e) => {
			this.onParentVatGroupChanged(e);
		});

	}

	private _cachedVatPercent: number = 0;

	public get cachedVatPercent() {
		return this._cachedVatPercent;
	}

	private _cachedExchangeRate: number = 0;

	public get cachedExchangeRate() {
		return this._cachedExchangeRate;
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IInvOtherEntity): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: InvComplete, modified: InvOtherComplete[], deleted: IInvOtherEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.InvOtherToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.InvOtherToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: InvComplete): IInvOtherEntity[] {
		if (parentUpdate && parentUpdate.InvOtherToSave) {
			return parentUpdate.InvOtherToSave.flatMap(e => e.InvOther ? e.InvOther : []);
		} else {
			return [];
		}
	}

	public getVatPercentWithTaxCodeMatrix(taxCodeFk: number, vatGroupFk?: number): number {
		const parent = this.getSelectedParent()!;
		vatGroupFk = !vatGroupFk && parent ? parent.BpdVatGroupFk || 0 : vatGroupFk;
		return this.vatPercentService.getVatPercent(taxCodeFk, vatGroupFk);
	}

	/**
	 *   setTotalAndItsGross rename calculateGrossAndTotalValues
	 * @param item
	 */
	public calculateGrossAndTotalValues(item: IInvOtherEntity) {
		this.calculateBaseValues(item);
		if (this.isOverGross) {
			item.AmountTotalGrossOc = this.itemCalculationHelper.roundTo(bignumber(item.Quantity).mul(item.AmountGrossOc));
			item.AmountTotalGross = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountTotalGrossOc, this.cachedExchangeRate);
			item.AmountTotalOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountTotalGrossOc, this.cachedVatPercent);
			item.AmountTotal = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountTotalGross, this.cachedVatPercent);
		} else {
			item.AmountTotalOc = this.itemCalculationHelper.roundTo(bignumber(item.AmountNetOc).mul(item.Quantity));
			item.AmountTotal = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountTotalOc, this.cachedExchangeRate);
			item.AmountTotalGrossOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountTotalOc, this.cachedVatPercent);
			item.AmountTotalGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountTotal, this.cachedVatPercent);
		}
	}

	/**
	 *   calculateItemValuesAfterTaxChange rename calculationAfterVatPercentChange
	 * @param item
	 */
	public calculateItemValuesAfterTaxChange(item: IInvOtherEntity) {
		this.calculateBaseValues(item);
		if (this.isOverGross) {
			item.AmountNet = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountGross, this.cachedVatPercent);
			item.AmountNetOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountGrossOc, this.cachedVatPercent);
			item.AmountTotal = this.itemCalculationHelper.roundTo(bignumber(item.AmountNet).mul(item.Quantity));
			item.AmountTotalOc = this.itemCalculationHelper.roundTo(bignumber(item.AmountNetOc).mul(item.Quantity));
		} else {
			item.AmountGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(item.AmountNet, this.cachedVatPercent);
			item.AmountGrossOc = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountGross, this.cachedExchangeRate);
			item.AmountTotalGross = this.itemCalculationHelper.roundTo(bignumber(item.Quantity).mul(item.AmountGross));
			item.AmountTotalGrossOc = this.itemCalculationHelper.roundTo(bignumber(item.Quantity).mul(item.AmountGrossOc));
		}
	}

	/**
	 *   recalcuteOther rename recalculateOther
	 */
	public recalculateOther() {
		let amountTotal = 0, amountTotalOc = 0, amountTotalGross = 0, amountTotalGrossOc = 0;
		this.getList().forEach(item => {
			amountTotalGrossOc = this.itemCalculationHelper.roundTo(bignumber(amountTotalGrossOc).add(item.AmountTotalGrossOc));
			amountTotalGross = this.itemCalculationHelper.roundTo(bignumber(amountTotalGross).add(item.AmountTotalGross));
			amountTotalOc = this.itemCalculationHelper.roundTo(bignumber(amountTotalOc).add(item.AmountTotalOc));
			amountTotal = this.itemCalculationHelper.roundTo(bignumber(amountTotal).add(item.AmountTotal));
		});
		this.parentService.recalculateOther(amountTotalOc, amountTotal, amountTotalGrossOc, amountTotalGross);
	}

	public override createUpdateEntity(modified: IInvOtherEntity | null): InvOtherComplete {
		const complete = new InvOtherComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.InvOther = modified;
		}
		return complete;
	}

	public async refreshAccountInfo(items?: IInvOtherEntity[]) {
		items = items || this.getList();

		const dtos = items.filter(item => {
			return item.PrcStructureFk !== undefined && item.PrcStructureFk >= 0;
		});
		const res = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'procurement/invoice/other/refreshaccount', {Dtos: dtos})) as IInvOtherEntity[];
		res.forEach((item) => {
			const index = dtos.findIndex(e => e.Id === item.Id);
			if (index !== -1) {
				dtos[index].Account = item.Account;
				dtos[index].AccountDesc = item.AccountDesc;
			}
		});
		//this.gridRefresh();
	}

	public calculateBaseValues(item: IInvOtherEntity) {
		const parent = this.getSelectedParent()!;
		const vatPercent = item.TaxCodeFk ? this.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk) : 0;
		const exchangeRate = parent.ExchangeRate || 0;

		this._cachedVatPercent = vatPercent;
		this._cachedExchangeRate = exchangeRate;
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
		};
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
			headerBillingSchemaFk: parent.BillingSchemaFk,
			headerCompanyDeferalTypeFk: parent.CompanyDeferalTypeFk
		};
	}

	protected override onLoadSucceeded(loaded: object): IInvOtherEntity[] {
		const dataDto = new MainDataDto<IInvOtherEntity>(loaded);
		return dataDto.Main;
	}

	protected override onCreateSucceeded(created: IInvOtherEntity): IInvOtherEntity {
		const parent = this.getSelectedParent()!;
		created.Quantity = 1;
		created.AmountNet = this.itemCalculationHelper.roundTo(bignumber(parent.AmountNetBalance || 0).mul(created.Quantity));
		created.AmountNetOc = this.itemCalculationHelper.roundTo(bignumber(parent.AmountNetBalanceOc || 0).mul(created.Quantity));
		created.AmountGross = this.itemCalculationHelper.roundTo(bignumber(parent.AmountGrossBalance || 0).mul(created.Quantity));
		created.AmountGrossOc = this.itemCalculationHelper.roundTo(bignumber(parent.AmountGrossBalanceOc || 0).mul(created.Quantity));
		this.calculateGrossAndTotalValues(created);
		return created;
	}

	protected onParentExchangeRateChanged(e: IExchangeRateChangedEvent) {
		const exchangeRate = e.exchangeRate;
		this.getList().forEach(item => {
			item.AmountNet = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountNetOc, exchangeRate);
			item.AmountTotal = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountTotalOc, exchangeRate);
			item.AmountGross = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountGrossOc, exchangeRate);
			item.AmountTotalGross = this.itemCalculationHelper.getHomeValueByOcValue(item.AmountTotalGrossOc, exchangeRate);
			this.setModified(item);
		});
		this.recalculateOther();
	}

	protected async onParentBillingSchemaChanged(e: number) {
		const parent = this.getSelectedParent()!;
		if (parent && e) {
			const billingSchema = await firstValueFrom(this.prcConfig2BSchemaLookupService.getItemByKey({id: parent.BillingSchemaFk}));
			const isChained = billingSchema?.IsChained || false;
			this.getList().forEach(item => {
				//todo  dev-20642
				// platformRuntimeDataService.readonly(item, [
				// 	{field: 'BasCompanyDeferalTypeFk', readonly: isChanined},
				// 	{field: 'DateDeferalStart', readonly: isChanined}
				// ]);
				if (isChained && (item.BasCompanyDeferalTypeFk !== null || item.DateDeferalStart !== null)) {
					item.BasCompanyDeferalTypeFk = null;
					item.DateDeferalStart = null;
					this.setModified(item);
				}
			});
		}
	}

	protected onParentVatGroupChanged(e: number) {
		this.getList().forEach(item => {
			this.calculateItemValuesAfterTaxChange(item);
			this.setModified(item);
		});
		this.recalculateOther();
	}
}
