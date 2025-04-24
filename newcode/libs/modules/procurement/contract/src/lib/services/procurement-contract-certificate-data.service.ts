/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonCertificateDataService } from '@libs/procurement/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { ProcurementContractTotalDataService } from './procurement-contract-total-data.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Certificate data service
 */
export class ProcurementContractCertificateDataService extends ProcurementCommonCertificateDataService<IPrcCertificateEntity, IConHeaderEntity, ContractComplete> {

    public constructor(protected parentDataService:ProcurementContractHeaderDataService) {
        const contractDataService = inject(ProcurementContractHeaderDataService);
        const totalDataService = inject(ProcurementContractTotalDataService);
        super(contractDataService, {},totalDataService);
    }

	public override onReloadSuccessed(loaded: IPrcCertificateEntity[]) {
		const netTotalItem = this.totalDataService!.getNetTotalItem();
		if (!netTotalItem) {
			return;
		}
		const existingCertificates = new Set(this.getList().map(x => x.BpdCertificateTypeFk));

		const netTotalValueNet = netTotalItem.ValueNet;
		loaded.forEach(e => {
			if (!existingCertificates.has(e.BpdCertificateTypeFk)) {
				if (e.GuaranteeCostPercent) {
					e.RequiredAmount = e.GuaranteeCostPercent * netTotalValueNet / 100;
				}
			}
		});
	}

	public override getHeaderContext(){
			return this.parentDataService.getHeaderContext();
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcCertificateEntity): boolean {
		return entity.PrcHeaderFk === parentKey.Id;
	}
}