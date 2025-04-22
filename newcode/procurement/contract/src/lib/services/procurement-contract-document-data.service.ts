import {inject, Injectable} from '@angular/core';
import {IPrcDocumentEntity, ProcurementCommonDocumentDataService} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';

@Injectable({
    providedIn: 'root'
})

export class ProcurementContractDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IConHeaderEntity, ContractComplete>{
    public constructor() {
        const contractDataService = inject(ProcurementContractHeaderDataService);
        super(contractDataService,{});
    }

	public override getSavedEntitiesFromUpdate(complete: ContractComplete): IPrcDocumentEntity[] {
		if (complete && complete.PrcDocumentToSave) {
			return complete.PrcDocumentToSave;
		}
		return [];
	}

    public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcDocumentEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}