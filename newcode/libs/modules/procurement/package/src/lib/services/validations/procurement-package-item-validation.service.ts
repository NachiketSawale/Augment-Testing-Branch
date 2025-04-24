import { Injectable } from '@angular/core';
import {
	ProcurementCommonItemValidationService
} from '@libs/procurement/common';
import { IPackageItemEntity } from '../../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../../model/entities/package-item-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../../model/entities/package-2header-complete.class';
import { ProcurementPackageItemDataService } from '../procurement-package-item-data.service';
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageItemValidationService extends ProcurementCommonItemValidationService<IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	public constructor(procurementPackageItemDataService: ProcurementPackageItemDataService) {
		super(procurementPackageItemDataService);
	}
	// todo package item Validation
	// asyncValidateQuantity
	// setBulkPriceConditionInformation
}
