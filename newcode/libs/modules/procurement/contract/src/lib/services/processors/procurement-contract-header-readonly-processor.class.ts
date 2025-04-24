/*
 * Copyright(c) RIB Software GmbH
 */
import { IConHeaderEntity } from '../../model/entities';
import { BasicsSharedNumberGenerationService, BasicsSharedProcurementConfigurationLookupService, EntityReadonlyProcessorBase, ProcurementConfigurationEntity, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { ProcurementContractHeaderDataService } from '../procurement-contract-header-data.service';
import { inject } from '@angular/core';
import { isNil } from 'lodash';

export class ProcurementContractHeaderReadonlyProcessor extends EntityReadonlyProcessorBase<IConHeaderEntity> {
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private genNumberSvc = inject(BasicsSharedNumberGenerationService);

	public constructor(protected dataService: ProcurementContractHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IConHeaderEntity> {
		return {
			ContractHeaderFk: (e) => this.readonlyContractHeaderFk(e),
			BusinessPartnerFk: {
				shared: ['SupplierFk'],
				readonly: this.readonlyBusinessPartnerFk,
			},
			ContactFk: (e) => this.readonlyContactFk(e),
			SubsidiaryFk: (e) => this.readonlySubsidiaryFk(e),
			BusinessPartner2Fk: {
				shared: ['Contact2Fk', 'Subsidiary2Fk', 'Supplier2Fk', 'TaxCodeFk'],
				readonly: this.readonlyBusinessPartner2Fk,
			},
			PaymentTermPaFk: {
				shared: ['PaymentTermFiFk', 'PaymentTermAdFk', 'PaymentTermAdFk', 'PackageFk', 'ProjectFk', 'ContracttypeFk', 'CompanyInvoiceFk'],
				readonly: this.readonlyPaymentTermPaFk,
			},
			ExchangeRate: (e) => this.readonlyExchangeRate(e),
			Code: (e) => this.readonlyCode(e),
			ProjectChangeFk: (e) => this.readonlyProjectChangeFk(e),
			BasCurrencyFk: {
				shared: ['PrcCopyModeFk'],
				readonly: this.readonlyBasCurrencyFk,
			},
			MaterialCatalogFk: (e) => this.readonlyMaterialCatalogFk(e),
			BankFk: (e) => !e.item.BusinessPartnerFk,
			BoqWicCatFk: (e) => this.readonlyBoqWicCatFk(e),
			BoqWicCatBoqFk: (e) => this.readonlyBoqWicCatBoqFk(e),
			// PrcHeaderEntity.ConfigurationFk: (info) => { return info.item.Version !== 0; } todo: framework not support this case now.
		};
	}

	protected override readonlyEntity(entity?: IConHeaderEntity): boolean {
		return this.dataService.isEntityReadonly(entity) ?? false;
	}

	protected readonlyContractHeaderFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return item.HasItems || !isNil(item.MaterialCatalogFk) || !isNil(item.BoqWicCatFk) || item.IsFramework;
	}

	protected readonlyBusinessPartnerFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return !isNil(item.MaterialCatalogFk) || !isNil(item.ConHeaderFk) || !isNil(item.BoqWicCatFk);
	}

	protected readonlyContactFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return !isNil(item.ConHeaderFk) && !isNil(item.ProjectChangeFk);
	}

	protected readonlySubsidiaryFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return !isNil(item.MaterialCatalogFk) || !item.BusinessPartnerFk || !isNil(item.ConHeaderFk) || !isNil(item.BoqWicCatFk);
	}

	protected readonlyBusinessPartner2Fk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return !isNil(item.MaterialCatalogFk) || !isNil(item.BoqWicCatFk);
	}

	protected readonlyPaymentTermPaFk(info: ReadonlyInfo<IConHeaderEntity>) {
		return !isNil(info.item.ConHeaderFk);
	}

	protected readonlyExchangeRate(info: ReadonlyInfo<IConHeaderEntity>) {
		const context = this.dataService.getHeaderContext(info.item);
		return context.currencyFk === info.item.BasCurrencyFk;
	}

	protected readonlyCode(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		const rubricIndex = this.dataService.getRubricIndex(info.item);
		return !item.CanChangeCode || item.Version !== 0 || this.genNumberSvc.hasNumberGenerateConfig(info.item.RubricCategoryFk, rubricIndex);
	}

	protected readonlyProjectChangeFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		return item.HasItems || item.IsFramework;
	}

	protected readonlyBasCurrencyFk(info: ReadonlyInfo<IConHeaderEntity>) {
		return this.dataService.isCallOff(info.item);
	}

	protected readonlyMaterialCatalogFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		if (item.IsFramework) {
			return true;
		}

		const prcConfig = this.getConfiguration(item);
		if (prcConfig && prcConfig.IsMaterial) {
			return !isNil(item.ContractHeaderFk) || this.dataService.isCallOff(info.item);
		}
		return true;
	}

	protected readonlyBoqWicCatFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		if (item.IsFramework) {
			return true;
		}

		const prcConfig = this.getConfiguration(item);
		if (prcConfig && prcConfig.IsService) {
			return !isNil(item.ContractHeaderFk);
		}
		return true;
	}

	protected readonlyBoqWicCatBoqFk(info: ReadonlyInfo<IConHeaderEntity>) {
		const item = info.item;
		if (item.IsFramework) {
			return true;
		}
		return !isNil(item.BoqWicCatFk) || !isNil(item.ContractHeaderFk);
	}

	private getConfiguration(entity: IConHeaderEntity): ProcurementConfigurationEntity | null | undefined {
		if (!entity.PrcHeaderEntity) {
			return null;
		}
		return this.configurationLookupService.cache.getItem({ id: entity.PrcHeaderEntity!.ConfigurationFk });
	}
}
