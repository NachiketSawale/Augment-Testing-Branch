import {Injectable, inject} from '@angular/core';
import {
	BasicsSharedCompanyContextService,
	BasicsSharedProcurementConfigurationLookupService,
	EntityReadonlyProcessorBase,
	ReadonlyFunctions
} from '@libs/basics/shared';
import {ProcurementRequisitionHeaderDataService} from '../requisition-header-data.service';
import {IReqHeaderEntity} from '../../model/entities/reqheader-entity.interface';
import {has} from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionHeaderReadonlyProcessorService extends EntityReadonlyProcessorBase<IReqHeaderEntity> {

	private readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);

	public constructor(protected dataService: ProcurementRequisitionHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IReqHeaderEntity> {
		return {
			ExchangeRate: info => {
				const editable = this.companyContext.loginCompanyEntity.CurrencyFk !== info.item.BasCurrencyFk && !info.item.ReqHeaderFk;
				return !editable;
			},
			IncotermFk: {
				shared: ['BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'BasPaymentTermAdFk', 'TaxCodeFk', 'BusinessPartnerFk', 'SupplierFk'], // todo chi: need? 'Subsidiary2Fk', 'BusinessPartner2Fk', 'Supplier2Fk'
				readonly: (info) => {
					const editable = info.item.MaterialCatalogFk === null && !info.item.BoqWicCatFk && !info.item.ReqHeaderFk;
					return !editable;
				}
			},
			PackageFk: {
				shared: ['ProjectFk', 'ProjectChangeFk'],
				readonly: (info) => {
					return !!info.item.ReqHeaderFk;
				}
			},
			SubsidiaryFk: info => {
				const editable = !info.item.MaterialCatalogFk && !!info.item.BusinessPartnerFk && !info.item.ReqHeaderFk && !info.item.BoqWicCatFk;
				return !editable;
			},
			Code: info => {
				let editable = info.item.Version === 0;
				if (info.item.Version === 0 && info.item.PrcHeaderEntity?.ConfigurationFk) {
					const prcConfigurations = this.configurationLookupService.syncService?.getListSync(); // todo chi: right? to get data in cache?
					const prcConfig = prcConfigurations?.find(e => e.Id === info.item.PrcHeaderEntity?.ConfigurationFk);
					if (prcConfig) {
						editable = !this.dataService.numberGenerator.hasNumberGenerateConfig(prcConfig.RubricCategoryFk);
					}
				}
				if (info.item.Version !== 0) {
					editable = !info.item.ReqHeaderFk;
				}
				return !editable;
			},
			BoqWicCatFk: info => {
				const prcConfigurations = this.configurationLookupService.syncService?.getListSync();
				const prcConfig = prcConfigurations?.find(e => e.Id === info.item.PrcHeaderEntity?.ConfigurationFk);

				const editable = !!(has(info.item, 'PrcHeaderEntity.ConfigurationFk') && prcConfig?.IsService);
				return !editable;
			},
			BoqWicCatBoqFk: info => {
				return !info.item.BoqWicCatFk;
			},
			// PrcHeaderEntity.ConfigurationFk: (info) => { const editable = info.item.Version === 0 && !info.item.ReqHeaderFk; return !editable; }

		};
	}

	protected override readonlyEntity() {
		if (!this.dataService.getSelectedEntity()) {
			return true;
		}
		return this.dataService.getHeaderContext().readonly;
	}
}