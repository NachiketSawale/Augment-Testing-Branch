/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcContactEntity, ProcurementCommonContactDataService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
    providedIn: 'root'
})

/**
 * Contact data service
 */
export class ProcurementContractContactDataService extends ProcurementCommonContactDataService<IPrcContactEntity, IConHeaderEntity, ContractComplete> {

    public constructor() {
        const contractDataService = inject(ProcurementContractHeaderDataService);
        super(contractDataService, {});
    }

    public getSelectedParentEntity() {
        const parentItem = this.parentService.getSelectedEntity();
        return {
            BusinessPartnerFk: parentItem?.BusinessPartnerFk,
            BusinessPartner2Fk: parentItem?.BusinessPartner2Fk ?? undefined
        };
    }
    
	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcContactEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

}