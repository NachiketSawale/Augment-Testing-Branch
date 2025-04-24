/*
 * Copyright(c) RIB Software GmbH
 */
import {
	AsyncReadonlyFunctions,
	BasicsSharedCompanyContextService,
	BasicsSharedInvoiceStatusLookupService, BasicsSharedNumberGenerationService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	EntityReadonlyProcessorBase,
	ReadonlyFunctions,
	ReadonlyInfo,
} from '@libs/basics/shared';
import { IInvHeaderEntity } from '../model';
import { ProcurementInvoiceHeaderDataService } from './procurement-invoice-header-data.service';
import { ProcurementInvoiceStatusPermissionService } from '../services/procurement-invoice-status-permission.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { isNil } from 'lodash';

export class ProcurementInvoiceHeaderReadonlyProcessor extends EntityReadonlyProcessorBase<IInvHeaderEntity> {
	private readonly invStatusRightSvc = inject(ProcurementInvoiceStatusPermissionService);
	private readonly invStatusLookupService = inject(BasicsSharedInvoiceStatusLookupService);
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	private readonly companyContext = inject(BasicsSharedCompanyContextService);
	private genNumberSvc = inject(BasicsSharedNumberGenerationService);

	public constructor(protected dataService: ProcurementInvoiceHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInvHeaderEntity> {
		return {
			BasAccassignBusinessFk: {
				shared: ['BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk'],
				readonly: this.readonlyBasAccassignBusiness,
			},
			CompanyDeferalTypeFk: {
				shared: ['DateDeferalStart'],
				readonly: this.readonlyCompanyDeferalType,
			},
			Description: {
				shared: [
					'InvTypeFk',
					'BusinessPartnerFk',
					'SupplierFk',
					'DateInvoiced',
					'Reference',
					'DateDelivered',
					'DateDeliveredFrom',
					'ReferenceStructured',
					'TaxCodeFk',
					'AmountNet',
					'AmountNetOc',
					'AmountGross',
					'AmountGrossOc',
					'TotalPerformedNet',
					'TotalPerformedGross',
				],
				readonly: this.readonlyByIsVirtual,
			},
			PesHeaderFk: (e) => this.readonlyPesHeaderFk(e),
			SalesTaxMethodFk: (e) => this.readonlySalesTaxMethodFk(e),
			ControllingUnitFk: {
				shared: ['PrcStructureFk'],
				readonly: this.readonlyByIsToToBeVerifiedBLStatus,
			},
			CurrencyFk: {
				shared: ['BillingSchemaFk'],
				readonly: this.readonlyByIsVirtualAndContractNotNull,
			},
			DateReceived: {
				shared: ['PrcConfigurationFk'],
				readonly: this.readonlyByIsVirtualAndNotNewItem,
			},
			ExchangeRate: (e) => this.readonlyByIsSameCurrency(e),
			Code: (e) => this.readonlyCode(e),
		};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IInvHeaderEntity> {
		return {
			ProgressId: async (e) => await this.readonlyProgressId(e),
		};
	}

	protected readonlyBasAccassignBusiness(info: ReadonlyInfo<IInvHeaderEntity>) {
		return this.readonlyByIsVirtual(info) || !(info.item && info.item.ConHeaderFk && info.item.IsInvAccountChangeable);
	}

	protected readonlyByIsVirtual(info: ReadonlyInfo<IInvHeaderEntity>) {
		return this.invStatusLookupService.cache.getItem(info.item.InvStatusFk)?.IsVirtual ?? false;
	}

	protected override readonlyEntity(entity: IInvHeaderEntity): boolean {
		return this.dataService.isEntityReadonly(entity) || !!entity.IsProtectedAllFields;
	}

	protected async readonlyProgressId(info: ReadonlyInfo<IInvHeaderEntity>): Promise<boolean> {
		const entity = info.item;
		const editable = this.invStatusRightSvc.isEditableInvoiceStatus(entity.InvStatusFk);
		if (!editable) {
			return true;
		}

		const bilSchemaConfig = await firstValueFrom(this.prcConfig2BSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		return bilSchemaConfig ? !bilSchemaConfig.IsChained : false;
	}

	protected readonlyByVersion(info: ReadonlyInfo<IInvHeaderEntity>) {
		return !info.item.Version;
	}

	protected readonlyCompanyDeferalType(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		const invType = this.dataService.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		return !!invType?.Isprogress;
	}

	protected readonlyPesHeaderFk(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		return !this.dataService.isEditableToPes(entity.InvStatusFk);
	}

	protected readonlySalesTaxMethodFk(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		return !isNil(entity.ConHeaderFk) || !isNil(entity.PesHeaderFk);
	}

	protected readonlyByIsToToBeVerifiedBLStatus(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		return !(this.invStatusLookupService.cache.getItem(info.item.InvStatusFk)?.ToBeVerifiedBl ?? true);
	}

	protected readonlyByIsVirtualAndContractNotNull(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		return this.readonlyByIsVirtual(info) || !isNil(info.item.ConHeaderFk);
	}

	protected readonlyByIsVirtualAndNotNewItem(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		return this.readonlyByIsVirtual(info) || info.item.Version !== 0;
	}

	protected readonlyByIsSameCurrency(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		return this.companyContext.loginCompanyEntity.CurrencyFk === info.item.CurrencyFk;
	}

	protected readonlyCode(info: ReadonlyInfo<IInvHeaderEntity>) {
		const item = info.item;
		return item.Version !== 0 || this.genNumberSvc.hasNumberGenerateConfig(info.item.RubricCategoryFk);
	}
}
