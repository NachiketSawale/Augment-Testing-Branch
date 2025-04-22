
import { ProcurementCommonPriceConditionValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackagePriceConditionDataService } from '../procurement-package-price-condition-data.service';
import { IPackageItemEntity } from '../../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../../model/entities/package-item-complete.class';


@Injectable({
	providedIn: 'root'
})
export class ProcurementQuotePriceConditionValidationService extends ProcurementCommonPriceConditionValidationService<IPackageItemEntity, PackageItemComplete> {
	public constructor() {
		const dataService = inject(ProcurementPackagePriceConditionDataService);
		super(dataService);
	}
}