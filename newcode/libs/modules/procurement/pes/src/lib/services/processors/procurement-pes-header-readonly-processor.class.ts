/*
 * Copyright(c) RIB Software GmbH
 */
import { IPesHeaderEntity } from '../../model/entities';
import { BasicsSharedCompanyContextService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from '../procurement-pes-header-data.service';
import { inject } from '@angular/core';
import { ProcurementCommonContextService } from '@libs/procurement/common';
import { isNil } from 'lodash';

export class ProcurementPesHeaderReadonlyProcessor extends EntityReadonlyProcessorBase<IPesHeaderEntity> {
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	protected readonly prcCommonContext = inject(ProcurementCommonContextService);

	public constructor(protected dataService: ProcurementPesHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPesHeaderEntity> {
		return {
			SubsidiaryFk: (e) => this.readonlyBusinessPartnerFk(e),
			CurrencyFk: {
				shared: ['SalesTaxMethodFk'],
				readonly: this.readonlyByConHeaderFk,
			},
			ExchangeRate: (e) => e.item.CurrencyFk === this.companyContext.loginCompanyEntity.CurrencyFk,
			Code: {
				shared: ['PrcConfigurationFk'],
				readonly: this.readonlyByVersion,
			},
			ControllingUnitFk: {
				shared: ['SubsidiaryFk', 'SupplierFk'],
				readonly: this.readonlyByPortalUser,
			},
		};
	}

	protected override readonlyEntity(entity: IPesHeaderEntity): boolean {
		if (!entity || entity.PesHeaderFk !== null) {
			return true;
		}
		return this.dataService.isEntityReadonly(entity);
	}

	protected readonlyBusinessPartnerFk(info: ReadonlyInfo<IPesHeaderEntity>) {
		const item = info.item;
		return item.BusinessPartnerFk === null || item.BusinessPartnerFk === -1;
	}

	protected readonlyByConHeaderFk(info: ReadonlyInfo<IPesHeaderEntity>) {
		//Readonly if contract is assigned
		return !isNil(info.item.ConHeaderFk);
	}

	protected readonlyByPortalUser(_info: ReadonlyInfo<IPesHeaderEntity>) {
		return this.prcCommonContext.isPortalUser;
	}

	protected readonlyByVersion(info: ReadonlyInfo<IPesHeaderEntity>): boolean {
		return !isNil(info.item.Version) && info.item.Version > 0;
	}
}
