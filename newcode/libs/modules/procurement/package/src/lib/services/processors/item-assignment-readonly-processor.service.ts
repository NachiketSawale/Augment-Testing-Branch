/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IPrcItemAssignmentEntity} from '@libs/procurement/interfaces';
import {ProcurementPackageItemAssignmentDataService} from '../item-assignment-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemAssignmentReadonlyProcessorService extends EntityReadonlyProcessorBase<IPrcItemAssignmentEntity> {
	public constructor(protected dataService: ProcurementPackageItemAssignmentDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPrcItemAssignmentEntity> {
		return {
			EstHeaderFk: () => {
				return this.dataService.isProtectContractedPackage();
			},
			EstLineItemFk: (info) => {
				const isProtected = this.dataService.isProtectContractedPackage();
				return isProtected || info.item.EstHeaderFk === -1 || info.item.EstHeaderFk === 0;
			},
			BoqItemFk: (info) => !!(info.item.PrcItemFk && info.item.PrcItemFk > 0),
			EstResourceFk: (info) => {
				const isProtected = this.dataService.isProtectContractedPackage();
				return isProtected || info.item.EstHeaderFk === -1 || info.item.EstHeaderFk === 0 || info.item.EstLineItemFk === -1 || info.item.EstLineItemFk === 0;
			},
			PrcItemFk: (info) => !!(info.item.BoqItemFk && info.item.BoqItemFk > 0),
		};
	}
}