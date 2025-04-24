/*
 * Copyright(c) RIB Software GmbH
 */
import * as math from 'mathjs';
import { Injectable, inject } from '@angular/core';
import { sumBy } from 'lodash';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntitySchemaStringProperty, IReadOnlyField, PlatformSchemaService, ServiceRole } from '@libs/platform/data-access';
import { CorrectInvoiceType, ICopyInvoiceGeneral, IInv2PESEntity, IInvHeaderEntity, IInvRejectEntity, InvComplete } from '../model';
import { IExceptionResponse, IFilterResult, ISearchPayload, ISearchResult, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import {
	BasicsExportService,
	BasicsSharedDataValidationService,
	BasicsSharedInvoiceTypeLookupService,
	BasicsSharedNumberGenerationService,
	BasicsSharedPaymentTermLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedStringBuilder,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	ExportOptions,
	MainDataDto,
	PaymentTermCalculationService,
	ProcurementConfigurationEntity,
} from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { PROCUREMENT_INVOICE_HEADER_SCHEME_ID } from './procurement-invoice-header-scheme-id.model';
import {
	IExchangeRateChangedEvent,
	IModifyExchangeRate,
	IPaymentTermChangedEvent, IPrcCommonReadonlyService,
	IPrcModuleValidatorService,
	numberNBigNumber,
	ProcurementCalculateErrorMessage,
	ProcurementCommonCalculationService,
	ProcurementCommonCascadeDeleteConfirmService,
	ProcurementCommonItemCalculationService,
	ProcurementCommonVatPercentageService,
	ProcurementOverviewSearchlevel,
} from '@libs/procurement/common';
import { EntityProxy, FieldKind, IContractLookupEntity, PrcInvoiceStatusEntity, PrcInvoiceStatusLookupService, ProcurementInternalModule, ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { Subject } from 'rxjs';
import { ProcurementInvoiceStatusPermissionService } from '../services/procurement-invoice-status-permission.service';
import { ProcurementInvoiceHeaderReadonlyProcessor } from './procurement-invoice-header-readonly-processor.class';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementInvoiceCallOffProcessor } from '../services/processors/procurement-invoice-call-off-processor.class';
import { CORRECT_TYPE_TOKEN, ProcurementInvoiceHeaderCorrectComponent } from '../components/procurement-invoice-header-correct/procurement-invoice-header-correct.component';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceHeaderDataService extends DataServiceFlatRoot<IInvHeaderEntity, InvComplete> implements IPrcModuleValidatorService<IInvHeaderEntity, InvComplete>, IModifyExchangeRate<IInvHeaderEntity>, IPrcCommonReadonlyService<IInvHeaderEntity> {
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);
	private http = inject(PlatformHttpService);

	public readonly readonlyProcessor: ProcurementInvoiceHeaderReadonlyProcessor;
	public readonly callOffProcessor: ProcurementInvoiceCallOffProcessor;

	public readonly itemCalculationService = inject(ProcurementCommonItemCalculationService);
	public readonly roundingType = this.itemCalculationService.getRoundingType<IInvRejectEntity>();
	public readonly round = this.itemCalculationService.round.bind(this.itemCalculationService);
	public readonly calculationService = inject(ProcurementCommonCalculationService);
	public readonly invTypeLookupService = inject(BasicsSharedInvoiceTypeLookupService);
	public readonly paymentTermCalculationService = inject(PaymentTermCalculationService);
	public readonly msgDialogService = inject(UiCommonMessageBoxService);
	protected readonly numberGenerationService = inject(BasicsSharedNumberGenerationService);

	public readonly entityProxy = new EntityProxy(this, [['BpdVatGroupFk', FieldKind.MdcVatGroupFk]]);
	public readonly onUpdateSucceeded$ = new Subject<boolean>();
	public readonly onChainInvoiceChange$ = new Subject<{ sumGrossChainInvoices: number; sumNetChainInvoices: number }>();
	public readonly autoCreateChainedInvoice$ = new Subject<{ conHeaderId?: number; businessPartnerFk?: number; pesId?: number }>();
	public readonly paymentTermLookupService = inject(BasicsSharedPaymentTermLookupService);

	public readonly onAmountNetValueChanged$ = new Subject<IInvHeaderEntity>();
	public readonly onCopyInvGenerals$ = new Subject<ICopyInvoiceGeneral>();

	private isCreateBlankItem = false;
	private readonly billingSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);
	private readonly schemaService = inject(PlatformSchemaService<IInvHeaderEntity>);
	private readonly statusLookupService = inject(PrcInvoiceStatusLookupService);
	private readonly invStatusRightSvc = inject(ProcurementInvoiceStatusPermissionService);
	protected readonly getVatPercentService = inject(ProcurementCommonVatPercentageService);

	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	protected readonly dialogService = inject(UiCommonDialogService);
	private readonly basicsExportService = inject(BasicsExportService);
	private pattern = '';

	public constructor() {
		super({
			apiUrl: 'procurement/invoice/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listinv',
				usePost: true,
			},
			createInfo: {
				endPoint: 'create/createinv',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updateinv',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteinv',
			},
			roleInfo: <IDataServiceRoleOptions<IInvHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'InvHeaders',
			},
		});

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.callOffProcessor = this.createCallOffProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
		this.processor.addProcessor(this.callOffProcessor);

		this.init();
	}

	/**
	 * Handle on exchange rate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isUpdateByCurrency
	 * @param isRemainHomeCurrency
	 */
	public onExchangeRateChanged(entity: IInvHeaderEntity, exchangeRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean = false): void {
		if (isUpdateByCurrency) {
			this.readonlyProcessor.process(entity);
		}
	}

	protected createReadonlyProcessor() {
		return new ProcurementInvoiceHeaderReadonlyProcessor(this);
	}

	protected createCallOffProcessor() {
		return new ProcurementInvoiceCallOffProcessor(this);
	}

	private init() {
		this.selectionChanged$.subscribe((e) => {
			this.onSelectionChanged();
		});

		this.onChainInvoiceChange$.subscribe((res) => {
			this.onChainInvoiceChange(res.sumGrossChainInvoices, res.sumNetChainInvoices);
		});
	}

	private onSelectionChanged() {
		const currentItem = this.getSelectedEntity();
		if (!currentItem) {
			return;
		}

		if (currentItem.Id) {
			this.onItemStatusChanged(currentItem);
		}
	}

	private onChainInvoiceChange(sumGrossChainInvoices: number, sumNetChainInvoices: number) {
		const entity = this.getSelectedEntity();
		if (!entity) {
			return;
		}
		entity.TotalPerformedGross = this.calculationService.roundTo(entity.AmountGross + sumGrossChainInvoices);
		entity.TotalPerformedNet = this.calculationService.roundTo(entity.AmountNet + sumNetChainInvoices);

		this.fireAmountNetValueChanged([entity]);
		this.recalculateAmountBalance(entity);

		this.setModified(entity);
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IInvHeaderEntity> {
		const dto = new MainDataDto<IInvHeaderEntity>(loaded);
		this.invStatusRightSvc.preparePermissionContext(dto);

		dto.Main.forEach((invoice) => {
			this.readonlyProcessor.process(invoice);
			this.callOffProcessor.process(invoice);
		});

		//todo: wait the dynamic Characteristic service ready
		// var gridContainerGuid = 'da419bc1b8ee4a2299cf1dde81cf1884';
		// var exist = platformGridAPI.grids.exist(gridContainerGuid);
		// if (exist) {
		// 	var containerInfoService = $injector.get('procurementContractContainerInformationService');
		// 	var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 47, gridContainerGuid, containerInfoService);
		//
		// 	characterColumnService.appendCharacteristicCols(readData.dtos);
		// }

		return {
			dtos: dto.Main,
			FilterResult: dto.getValueAs<IFilterResult>('FilterResult')!,
		};
	}

	protected override provideCreatePayload(): object {
		const selectedEntity = this.getSelectedEntity();
		// todo - get pinned project
		const pinProjectFk: number | null = null;

		const payload = {
			ProjectFk: pinProjectFk,
			PreviousInvHeader: !this.isCreateBlankItem ? selectedEntity : null,
		};

		this.isCreateBlankItem = false;

		return payload;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.pattern = payload.pattern;
		return {
			...payload,
		};
	}

	protected override onCreateSucceeded(created: object): IInvHeaderEntity {
		const entity = created as IInvHeaderEntity;

		this.generateDescription(entity).then((description) => {
			entity.Description = description;
		});

		if (entity.ConHeaderFk) {
			this.contractLookupService.getItemByKey({ id: entity.ConHeaderFk }).subscribe((res) => {
				this.updatePaymentTermFkAndRelatedProperties(entity, res);
			});
		} else {
			this.configurationLookupService.getItemByKey({ id: entity.PrcConfigurationFk }).subscribe((res) => {
				this.initPaymentTermFkWhenInvoiceIsNewlyCreteated(entity, res);
			});
		}

		//set code
		if (entity) {
			this.setEntityReadOnlyFields(entity, this.getReadOnlyFields(entity));
			if (this.shouldGenerateNumber(entity)) {
				entity.Code = this.getNumberDefaultText(entity);
			}
			//handle error message
			if (entity.Code === '') {
				const codeTr = this.translationService.instant('cloud.common.entityCode').text;
				const validateResult = this.validationService.createErrorObject({
					key: 'cloud.common.generatenNumberFailed',
					params: { fieldName: codeTr },
				});
				this.addInvalid(entity, { field: 'Code', result: validateResult });
			} else {
				this.removeInvalid(entity, {
					field: 'Code',
					result: this.validationService.createSuccessObject(),
				});
			}
		}

		return entity;
	}

	public override createUpdateEntity(modified: IInvHeaderEntity | null): InvComplete {
		const complete = new InvComplete();

		complete.InvHeader = modified;

		return complete;
	}

	public override canDelete(): boolean {
		if (!super.canDelete()) {
			return false;
		}

		const selection = this.getSelectedEntity();
		if (selection?.Version !== 0) {
			return false;
		}

		return this.isEntityReadonly();
	}

	public override async delete(entities: IInvHeaderEntity[] | IInvHeaderEntity) {
		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			throw new Error('Please select a record first');
		}
		const result = await this.cascadeDeleteHelperService.openDialog({
			filter: '',
			mainItemId: selectedItem.Id,
			moduleIdentifier: ProcurementInternalModule.Invoice,
			searchLevel: ProcurementOverviewSearchlevel.RootContainer,
		});
		if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
			try {
				await super.delete(entities);
			} catch (e) {
				await this.msgDialogService.showErrorDialog(e as IExceptionResponse);
			}
		}
	}

	public async createBlankItem() {
		this.isCreateBlankItem = true;
		return this.create();
	}

	private getReadOnlyFields(createdInvoice: IInvHeaderEntity): IReadOnlyField<IInvHeaderEntity>[] {
		const hasToGenerate = this.numberGenerationService.hasNumberGenerateConfig(createdInvoice.RubricCategoryFk);

		return [
			{ field: 'Code', readOnly: hasToGenerate },
			{ field: 'BankFk', readOnly: true },
		];
	}

	public shouldGenerateNumber(createdInvoice: IInvHeaderEntity): boolean {
		return this.numberGenerationService.hasNumberGenerateConfig(createdInvoice.RubricCategoryFk);
	}

	public getNumberDefaultText(createdInvoice: IInvHeaderEntity): string {
		return this.numberGenerationService.provideNumberDefaultText(createdInvoice.RubricCategoryFk);
	}

	public async generateDescription(entity: IInvHeaderEntity, options?: { bpFk?: number; progressId?: number }) {
		const businessPartnerFk = options?.bpFk ?? entity.BusinessPartnerFk;
		const progressId = options?.progressId ?? entity.ProgressId;
		const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		const billSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		const maxlength = await this.getDomainMaxLength('Description');

		const builder = new BasicsSharedStringBuilder({
			separator: ' ',
			maxLength: maxlength,
		});

		if (invType) {
			if (billSchema?.IsChained) {
				if (invType.Isprogress && progressId > 0) {
					builder.append(progressId + '.');
				}
				builder.append(invType.Abbreviation2);
			}

			builder.append(invType.Abbreviation);
		}

		if (businessPartnerFk) {
			const partnerItem = await firstValueFrom(this.bpLookupService.getItemByKey({ id: businessPartnerFk }));
			builder.append(partnerItem?.BusinessPartnerName1);
		}

		return builder.toString();
	}

	private async getDomainMaxLength(key: keyof IInvHeaderEntity) {
		const schema = await this.schemaService.getSchema(PROCUREMENT_INVOICE_HEADER_SCHEME_ID);
		return (schema.properties[key] as IEntitySchemaStringProperty).domainmaxlen;
	}

	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly billingSchemaChanged$ = new Subject<number>();
	public readonly vatGroupChanged$ = new Subject<number>();
	//pes
	public readonly autoCreateInvoiceToPES$ = new Subject<number>(); //the value is PesHeaderFk

	public updateTotalLeadTime(value: number): void {}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Invoice;
	}

	public isValidForSubModule(): boolean {
		const invHeaderEntity = this.getSelectedEntity()!;
		return invHeaderEntity !== null && invHeaderEntity.Id !== undefined;
	}

	public getStatus(entity?: IInvHeaderEntity): PrcInvoiceStatusEntity | undefined {
		const selectedEntity = entity ?? this.getSelectedEntity();
		if (!selectedEntity) {
			return undefined;
		}

		const status = this.statusLookupService.cache.getItem({ id: selectedEntity.InvStatusFk });
		return status || undefined;
	}

	public isEntityReadonly(entity?: IInvHeaderEntity): boolean {
		const status = this.getStatus(entity);
		if (!status) {
			return true;
		}
		const editable = this.invStatusRightSvc.isEditableInvoiceStatus(status.Id);
		return status.IsReadOnly || !editable;
	}

	public getSelectedProjectId() {
		return this.getSelectedEntity()?.ProjectFk;
	}

	public getConfigurationFk() {
		return this.getSelectedEntity()?.PrcConfigurationFk;
	}

	public override getModificationsFromUpdate(complete: InvComplete): IInvHeaderEntity[] {
		// Check for stock transaction save error and show dialog
		if (complete.StocktransactionSaveError) {
			this.msgDialogService.showMsgBox('procurement.common.stocktransactionSaveErrorMessage', 'procurement.invoice.moduleName', 'ico-error');
		}
		this.showCalculateMessage(complete);
		if (!complete.InvHeaders) {
			complete.InvHeaders = [];
		}

		// Handle the case when InvHeaders is present
		if (complete.InvHeaders.length > 0) {
			this.onUpdateSucceeded$.next(true);
			this.fireAmountNetValueChanged(complete.InvHeaders);
			return complete.InvHeaders;
		}

		// Handle the case when only InvHeader is present
		if (complete.InvHeader) {
			this.onUpdateSucceeded$.next(true);
			complete.InvHeaders.push(complete.InvHeader);
			this.fireAmountNetValueChanged(complete.InvHeaders);
			return [complete.InvHeader];
		}

		return [];
	}

	public fireAmountNetValueChanged(invoices: IInvHeaderEntity[]) {
		invoices.forEach((invoice) => {
			this.onAmountNetValueChanged$.next(invoice);
		});
	}

	public recalcuteContract(netOc: number, net: number, grossOc: number, gross: number) {
		const invoice = this.getSelectedEntity();
		if (!invoice || !invoice.Id) {
			return;
		}
		const vatOc = this.calculationService.roundTo(math.bignumber(grossOc).sub(netOc));
		const vat = this.calculationService.roundTo(math.bignumber(gross).sub(net));
		invoice.AmountNetContractOc = this.calculationService.roundTo(netOc);
		invoice.AmountVatContractOc = this.calculationService.roundTo(vatOc);
		invoice.AmountGrossContractOc = this.calculationService.roundTo(grossOc);

		invoice.AmountNetContract = this.calculationService.roundTo(net);
		invoice.AmountVatContract = this.calculationService.roundTo(vat);
		invoice.AmountGrossContract = this.calculationService.roundTo(gross);
		this.recalculateAmountBalance(invoice);
		this.setModified(invoice);
	}

	public recalcuteInvoiceReject(netOc: number, vatOc: number) {
		const invoiceHeader = this.getSelectedEntity();
		if (!invoiceHeader || !invoiceHeader.Id) {
			return;
		}
		invoiceHeader.AmountNetRejectOc = this.roundTo(netOc);
		invoiceHeader.AmountVatRejectOc = this.roundTo(vatOc);
		invoiceHeader.AmountGrossRejectOc = this.calculationService.roundTo(math.bignumber(invoiceHeader.AmountNetRejectOc).add(invoiceHeader.AmountVatRejectOc));

		invoiceHeader.AmountNetReject = this.convertToNonOc(netOc, invoiceHeader.ExchangeRate);
		invoiceHeader.AmountVatReject = this.convertToNonOc(vatOc, invoiceHeader.ExchangeRate);
		invoiceHeader.AmountGrossReject = this.roundTo(math.bignumber(invoiceHeader.AmountNetReject).add(invoiceHeader.AmountVatReject));
	}

	public recalculateOther(netOc: number, net: number, grossOc: number, gross: number) {
		const invoice = this.getSelectedEntity();
		if (!invoice || !invoice.Id) {
			return;
		}
		const vatOc = this.calculationService.roundTo(math.bignumber(grossOc).sub(netOc));
		const vat = this.calculationService.roundTo(math.bignumber(gross).sub(net));
		invoice.AmountNetOtherOc = this.calculationService.roundTo(netOc);
		invoice.AmountVatOtherOc = this.calculationService.roundTo(vatOc);
		invoice.AmountGrossOtherOc = this.calculationService.roundTo(grossOc);

		invoice.AmountNetOther = this.calculationService.roundTo(net);
		invoice.AmountVatOther = this.calculationService.roundTo(vat);
		invoice.AmountGrossOther = this.calculationService.roundTo(gross);
		this.recalculateAmountBalance(invoice);
		this.setModified(invoice);
	}

	public async recalculateAmountBalance(entity: IInvHeaderEntity) {
		await this.recalculateAmountReconciliation(entity);
		// This field is always calculated as AMOUNT_GROSS - AMOUNT_NET – AMOUNT_VATPES
		// – AMOUNT_VATCONTRACT – AMOUNT_VATOTHER – AMOUNT_VATREJECT

		if (entity.AmountVatOcReconciliation && entity.FromBillingSchemaVatOc) {
			entity.AmountVatBalanceOc = this.roundTo(math.subtract(entity.AmountVatOcReconciliation, entity.FromBillingSchemaVatOc + entity.AmountVatPesOc + entity.AmountVatContractOc + entity.AmountVatOtherOc + entity.AmountVatRejectOc));
		}

		if (entity.AmountVatReconciliation && entity.FromBillingSchemaVat) {
			entity.AmountVatBalance = this.roundTo(math.subtract(entity.AmountVatReconciliation, entity.FromBillingSchemaVat + entity.AmountVatPes + entity.AmountVatContract + entity.AmountVatOther + entity.AmountVatReject));
		}

		if (entity.AmountVatBalanceOc) {
			entity.AmountVatBalanceOc = this.roundTo(entity.AmountVatBalanceOc);
		}

		if (entity.AmountVatBalance) {
			entity.AmountVatBalance = this.roundTo(entity.AmountVatBalance);
		}

		// This field is calculated as AMOUNT_NET – AMOUNT_NETPES – AMOUNT_NETCONTRACT
		// – AMOUNT_NETOTHER – AMOUNT_NETREJECT
		if (entity.AmountNetOcReconciliation && entity.FromBillingSchemaNetOc) {
			entity.AmountNetBalanceOc = this.roundTo(math.subtract(entity.AmountNetOcReconciliation, entity.FromBillingSchemaNetOc + entity.AmountNetPesOc + entity.AmountNetContractOc + entity.AmountNetOtherOc + entity.AmountNetRejectOc));
		}

		if (entity.AmountNetReconciliation && entity.FromBillingSchemaNet) {
			entity.AmountNetBalance = this.roundTo(math.subtract(entity.AmountNetReconciliation, entity.FromBillingSchemaNet + entity.AmountNetPes + entity.AmountNetContract + entity.AmountNetOther + entity.AmountNetReject));
		}

		if (entity.AmountNetBalanceOc) {
			entity.AmountNetBalanceOc = this.roundTo(entity.AmountNetBalanceOc);
		}

		if (entity.AmountNetBalance) {
			entity.AmountNetBalance = this.roundTo(entity.AmountNetBalance);
		}

		if (entity.AmountNetBalanceOc && entity.AmountVatBalanceOc) {
			entity.AmountGrossBalanceOc = entity.AmountNetBalanceOc + entity.AmountVatBalanceOc;
		}

		if (entity.AmountNetBalance && entity.AmountVatBalance) {
			entity.AmountGrossBalance = entity.AmountNetBalance + entity.AmountVatBalance;
		}
		// notify change to refresh Reconciliation
		this.onAmountNetValueChanged$.next(entity);

		this.setModified(entity);
	}

	public convertToNonOc(ocValue: number, exchangeRate?: number): number {
		if (!exchangeRate) {
			return 0;
		}
		return this.calculationService.roundTo(math.bignumber(ocValue).div(exchangeRate));
	}

	public convertToOc(nonOc: number, exchangeRate?: number): number {
		if (!exchangeRate) {
			return 0;
		}
		return this.calculationService.roundTo(math.bignumber(nonOc).mul(exchangeRate));
	}

	public calculateNetFromGross(afterTax: number, vatPercent?: number): number {
		const vp = vatPercent ? math.bignumber(100).add(vatPercent).div(100).toNumber() : 1;
		return this.calculationService.roundTo(math.bignumber(afterTax).div(vp));
	}

	public getVatPercentWithTaxCodeMatrix(taxCodeFk?: number, vatGroupFk?: number) {
		const item = this.getSelectedEntity();
		vatGroupFk = vatGroupFk ?? (item?.BpdVatGroupFk as number | undefined);
		return this.getVatPercentService.getVatPercent(taxCodeFk, vatGroupFk);
	}

	public async recalculateAmountReconciliation(entity: IInvHeaderEntity) {
		const billSchema = await firstValueFrom(this.prcConfig2BSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		entity.BillSchemeIsChained = billSchema?.IsChained ?? false;
		if (billSchema?.IsChained) {
			entity.AmountGrossReconciliation = entity.TotalPerformedGross;
			entity.AmountNetReconciliation = entity.TotalPerformedNet;
			entity.AmountVatReconciliation = entity.TotalPerformedGross - entity.TotalPerformedNet;

			entity.AmountGrossOcReconciliation = entity.TotalPerformedGross * entity.ExchangeRate;
			entity.AmountNetOcReconciliation = entity.TotalPerformedNet * entity.ExchangeRate;
			entity.AmountVatOcReconciliation = this.roundTo(this.roundTo(entity.TotalPerformedGross * entity.ExchangeRate) - this.roundTo(entity.TotalPerformedNet * entity.ExchangeRate));
		} else {
			entity.AmountGrossReconciliation = entity.AmountGross;
			entity.AmountNetReconciliation = entity.AmountNet;
			entity.AmountVatReconciliation = entity.AmountGross - entity.AmountNet;

			entity.AmountGrossOcReconciliation = entity.AmountGross * entity.ExchangeRate;
			entity.AmountNetOcReconciliation = entity.AmountNet * entity.ExchangeRate;
			entity.AmountVatOcReconciliation = (entity.AmountGross - entity.AmountNet) * entity.ExchangeRate;
		}
		this.setModified(entity);
	}

	public roundTo(value: numberNBigNumber): number {
		return this.calculationService.roundTo(value);
	}

	public async updatePaymentTermFkAndRelatedProperties(entity: IInvHeaderEntity, contract: IContractLookupEntity) {
		const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		if (invType && contract && entity.PrcConfigurationFk) {
			const paymentTermFk = invType.Isprogress ? contract.PaymentTermPaFk : contract.PaymentTermFiFk;
			await this.updatePaymentTermAndRelatedProperties(entity, paymentTermFk);
		}
	}

	public async generateNarrative(entity: IInvHeaderEntity) {
		const descResult = this.http.post<string>('procurement/invoice/narrative', entity);
		return descResult;
	}

	public async initPaymentTermFkWhenInvoiceIsNewlyCreteated(entity: IInvHeaderEntity, configuration: ProcurementConfigurationEntity) {
		const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		if (invType && configuration) {
			const paymentTermFk = invType.Isprogress ? configuration.PaymentTermPaFk : configuration.PaymentTermFiFk;
			await this.updatePaymentTermAndRelatedProperties(entity, paymentTermFk);
		}
	}

	private async updatePaymentTermAndRelatedProperties(entity: IInvHeaderEntity, paymentTermFk?: number) {
		if (paymentTermFk) {
			await this.setDateDiscount(entity, true, paymentTermFk);
			entity.PaymentTermFk = paymentTermFk;
			this.setModified(entity);
		}
	}

	public async setDateDiscount(entity: IInvHeaderEntity, recuclateDiscount: boolean, paymentTermFk?: number | null) {
		if (!paymentTermFk) {
			return true;
		}
		const paymentTerm = await firstValueFrom(this.paymentTermLookupService.getItemByKey({ id: paymentTermFk }));
		if (paymentTerm) {
			entity.PercentDiscount = paymentTerm.DiscountPercent;
		}

		if (recuclateDiscount) {
			this.recalculateAmountDiscountSimple(entity);
		}
		this.paymentTermCalculationService.calculateDate(new Date(entity.DateReceived), paymentTerm);
		return true;
	}

	public updateDiscountBasics(entity: IInvHeaderEntity) {
		entity.AmountDiscountBasis = entity.AmountGross;
		entity.AmountDiscountBasisOc = entity.AmountGrossOc;
		this.recalculateAmountDiscount(entity);
	}

	public async recalculateAmountDiscount(entity: IInvHeaderEntity) {
		if (!entity.PaymentTermFk) {
			return true;
		}
		const paymentTerm = await firstValueFrom(this.paymentTermLookupService.getItemByKey({ id: entity.PaymentTermFk }));
		if (paymentTerm) {
			this.recalculateAmountDiscountSimple(entity);
			this.setModified(entity);
		}
		return true;
	}

	public recalculateAmountDiscountSimple(entity: IInvHeaderEntity) {
		entity.AmountDiscountOc = this.calculationService.roundTo(math.bignumber(entity.AmountDiscountBasisOc).mul(entity.PercentDiscount).div(100));
		entity.AmountDiscount = this.convertToNonOc(entity.AmountDiscountOc, entity.ExchangeRate);
	}

	public onItemStatusChanged(entity: IInvHeaderEntity) {
		this.processor.process(entity);
		this.readonlyProcessor.process(entity);
	}

	/**
	 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
	 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
	 */
	public getResultsSet() {
		const invoices = this.getList();
		return this.createInquiryResultSet(invoices);
	}

	public wizardIsActivate() {
		const invStatus = this.getStatus();
		const selectedInv = this.getSelectedEntity();
		if (!invStatus || !selectedInv) {
			return false;
		}

		const isActivate = invStatus.Islive;
		if (!isActivate) {
			this.msgDialogService.showMsgBox('procurement.invoice.wizard.isActiveMessage', 'procurement.invoice.wizard.isActivateCaption', 'ico-question');
		}
		return isActivate;
	}

	public isEditableToPes(statusId: number): boolean {
		return this.invStatusRightSvc.isEditableToPes(statusId);
	}

	public async correctInvoice(type: CorrectInvoiceType) {
		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			return false;
		}
		const headerTextKey = CorrectInvoiceType.Correct ? 'procurement.invoice.toolbarCorrectInvoiceCorrect' : 'procurement.invoice.toolbarCorrectInvoiceCancel';
		const modalOptions: ICustomDialogOptions<void, ProcurementInvoiceHeaderCorrectComponent> = {
			width: '10%',
			headerText: headerTextKey,
			resizeable: true,
			id: 'bb4508b4c63e418abe0db4786c387ba7',
			showCloseButton: true,
			bodyComponent: ProcurementInvoiceHeaderCorrectComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					fn(evt, info) {
						info.dialog.body.onOKBtnClicked();
					},
					isVisible: (info) => {
						return info.dialog.body.okBtnVisible();
					},
					isDisabled: (info) => info.dialog.body.okBtnDisabled(),
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
					fn(evt, info) {
						info.dialog.body.canCelBtnClicked();
					},
					isVisible: (info) => {
						return info.dialog.body.cancelBtnVisible();
					},
					isDisabled: (info) => info.dialog.body.cancelBtnDisabled(),
				},
			],
			bodyProviders: [
				{
					provide: CORRECT_TYPE_TOKEN,
					useValue: type,
				},
			],
		};
		return this.dialogService.show(modalOptions);
	}

	public async updateReconciliation() {
		const selectedInv = this.getSelectedEntity();
		if (!selectedInv) {
			return;
		}

		this.update(selectedInv);

		const result = await this.http.get<object>('procurement/invoice/pes/list', { params: { mainItemId: selectedInv.Id } });
		const dto = new MainDataDto<IInv2PESEntity>(result);
		const inv2Pes = dto.Main;
		const vatValues = this.calculateInvoiceVatValues(inv2Pes, selectedInv.Id);

		const needUpdate = selectedInv.AmountNetPesOc !== vatValues.amountNetPesOc || selectedInv.AmountNetPes !== vatValues.amountNetPes || selectedInv.AmountVatPesOc !== vatValues.amountVatPesOc || selectedInv.AmountVatPes !== vatValues.amountVatPes;

		if (needUpdate) {
			const pesValueOc = sumBy(inv2Pes, (item) => item.PesValueOc ?? 0);
			const pesVatOc = sumBy(inv2Pes, (item) => item.PesVatOc ?? 0);
			this.recalculateFromPes(selectedInv, pesValueOc, pesVatOc);
			this.update(selectedInv);
		}
	}

	public recalculateFromPes(selectedInv: IInvHeaderEntity, pesValueOc: number, pesVatOc: number) {
		if (!selectedInv) {
			return;
		}
		selectedInv.AmountNetPesOc = this.calculationService.roundTo(pesValueOc);
		selectedInv.AmountVatPesOc = this.calculationService.roundTo(pesVatOc);
		selectedInv.AmountGrossPesOc = this.calculationService.roundTo(math.bignumber(pesValueOc).add(pesVatOc));

		selectedInv.AmountNetPes = this.convertToNonOc(pesValueOc, selectedInv.ExchangeRate);
		selectedInv.AmountVatPes = this.convertToNonOc(pesVatOc, selectedInv.ExchangeRate);
		selectedInv.AmountGrossPes = this.calculationService.roundTo(math.bignumber(selectedInv.AmountNetPes).add(selectedInv.AmountVatPes));
		this.recalculateAmountBalance(selectedInv);
		this.setModified(selectedInv);
	}

	public getAfterTaxByPreTax(preTax: number, vatPercent?: number): number {
		const vp = vatPercent ? math.bignumber(100).add(vatPercent).div(100).toNumber() : 1;
		return this.calculationService.roundTo(math.bignumber(preTax).mul(vp));
	}

	private calculateInvoiceVatValues(inv2PesList: IInv2PESEntity[], exchangeRate: number) {
		let amountNetPesOc = 0;
		let amountVatPesOc = 0;
		let amountNetPes = 0;
		let amountVatPes = 0;

		inv2PesList.forEach((p) => {
			amountNetPesOc += this.calculationService.roundTo(p.PesValueOc || 0);
			amountVatPesOc += this.calculationService.roundTo(p.PesVatOc || 0);
			amountNetPes += this.calculationService.roundTo(exchangeRate === 0 ? 0 : math.bignumber(p.PesValueOc).div(exchangeRate));
			amountVatPes += this.calculationService.roundTo(exchangeRate === 0 ? 0 : math.bignumber(p.PesVatOc).div(exchangeRate));
		});

		return { amountNetPesOc, amountVatPesOc, amountNetPes, amountVatPes };
	}

	private createInquiryResultSet(entities: IInvHeaderEntity[]) {
		const noname = this.translationService.instant('businesspartner.main.inquiry.noname').text;
		const nosubsidiarydesc = this.translationService.instant('businesspartner.main.inquiry.nosubsidiarydesc').text;
		const resultArr = entities.map((item: IInvHeaderEntity) => ({
			id: item.Id,
			name: item.Code || noname,
			description: item.Description || nosubsidiarydesc,
		}));
		return resultArr;
	}

	private showCalculateMessage(complete: InvComplete) {
		if (complete.CalculateErrorMesssage) {
			if (complete.CalculateErrorMesssage === ProcurementCalculateErrorMessage.BillingSchemaErrorStatusMiss) {
				this.msgDialogService.showMsgBox('procurement.invoice.error.billingSchemaErrorStatusMiss', 'procurement.invoice.error.errorMessage', 'warning');
			} else {
				this.msgDialogService.showMsgBox(complete.CalculateErrorMesssage, 'procurement.invoice.error.billingSchemaCalculateErrorTitle', 'warning');
			}
		}

		if (complete.NotEqualWarn) {
			this.msgDialogService.showMsgBox('procurement.common.notEqualWarnMessage', 'procurement.invoice.moduleName', 'warning');
		}
	}

	private exportOptions = {
		moduleName: 'procurement.invoice',
		mainContainer: {
			id: 'prc.inv.header.grid',
			label: 'procurement.invoice.title.header',
			gridId: 'da419bc1b8ee4a2299cf1dde81cf1884',
		},
		subContainers: [],
		permission: '',
		excelProfileContexts: [],
		exportOptionsCallback(ex: ExportOptions) {},
	};

	public exportRecord() {
		const invList = this.getList();
		if (!invList) {
			return;
		}
		this.exportOptions.exportOptionsCallback = (exportOption: ExportOptions) => {
			//todo-if the framework advanced search is ready, modify the below code
			exportOption.filter = {
				...(exportOption.filter as object),
				ExecutionHints: false,
				IncludeNonActiveItems: false,
				Pattern: this.pattern,
			};
		};
		this.basicsExportService.showExportDialog(this.exportOptions);
	}
}
