/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { ProcurementCommonCompanyContextService, ProcurementCommonContextService } from '@libs/procurement/common';
import { ProcurementInvoiceContractItemDataService } from './procurement-invoice-contract-item-data.service';
import { IInv2ContractEntity } from '../model';

export class ProcurementInvoiceContractItemReadonlyProcessor extends EntityReadonlyProcessorBase<IInv2ContractEntity> {
	protected readonly companyContext = inject(ProcurementCommonCompanyContextService);
	protected readonly prcCommonContext = inject(ProcurementCommonContextService);

	public constructor(protected dataService: ProcurementInvoiceContractItemDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInv2ContractEntity> {
		return {
			IsAssetManagement: (e) => e.item.PrcBoqFk !== null,
		};
	}

	protected override readonlyEntity(entity: IInv2ContractEntity): boolean {
		return this.dataService.isStatusReadonly();
	}

	protected readonlyByVersion(info: ReadonlyInfo<IInv2ContractEntity>) {
		return info.item.Version === undefined || info.item.Version <= 0;
	}
}
