/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BasicsSharedProcurementConfigurationLookupService, EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from '../package-header-data.service';
import { ProcurementCommonCompanyContextService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHeaderReadonlyProcessorService extends EntityReadonlyProcessorBase<IPrcPackageEntity> {
	private companyContext = inject(ProcurementCommonCompanyContextService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);

	public constructor(protected dataService: ProcurementPackageHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPrcPackageEntity> {
		return {
			ExchangeRate: (info) => {
				return this.companyContext.loginCompanyEntity.CurrencyFk !== info.item.CurrencyFk;
			},
			ConfigurationFk: (info) => {
				return !!(info.item.Version && info.item.Version > 0);
			},
			// MainEventDto.StartRelevant MainEventDto.EndRelevant // todo chi: custom column
			ActivityFk: (info) => !info.item.ScheduleFk,
			SubsidiaryFk: (info) => !info.item.BusinessPartnerFk,
			Code: (info) => {
				let editable = info.item.Version === 0;
				if (info.item.Version === 0 && info.item.ConfigurationFk) {
					const prcConfigurations = this.configurationLookupService.syncService?.getListSync(); // todo chi: right? to get data in cache?
					const prcConfig = prcConfigurations?.find((e) => e.Id === info.item.ConfigurationFk);
					if (prcConfig) {
						editable = !this.dataService.numberGenerator.hasNumberGenerateConfig(prcConfig.RubricCategoryFk);
					}
				}
				return !editable;
			},
		};
	}

	protected readonlyFields() {
		return false;
	}

	protected override readonlyEntity() {
		return this.dataService.getHeaderContext().readonly;
	}
}