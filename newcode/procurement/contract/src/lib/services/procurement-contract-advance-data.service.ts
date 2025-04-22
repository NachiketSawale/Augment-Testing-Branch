/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { BasicsSharedContractAdvanceDataService } from '@libs/basics/shared';
import { IConAdvanceEntity } from '../model/entities/con-advance-entity.interface';
import { ContractComplete } from '../model/contract-complete.class';

/**
 * Advance  service in contract
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractAdvanceDataService extends BasicsSharedContractAdvanceDataService<IConAdvanceEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor(protected dataService: ProcurementContractHeaderDataService) {
		super(dataService, {
			apiUrl: 'procurement/contract/advance',
			itemName: 'Advance',
			endReadFn: 'list',
			usePostForRead: false,
		});
	}

	protected getMainItemId(parent: IConHeaderEntity) {
		return parent.Id;
	}

	public override canCreate() {
		if (this.dataService.getHeaderContext()) {
			return super.canCreate() && !this.dataService.getHeaderContext().readonly;
		}
		return false;
	}

	public override canDelete(): boolean {
		if (this.dataService.getHeaderContext()) {
			return super.canDelete() && !this.dataService.getHeaderContext().readonly;
		}
		return false;
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConAdvanceEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}
}
