import { Injectable } from '@angular/core';
import { ProcurementCommonItemBehavior } from '@libs/procurement/common';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { ProcurementPackageItemDataService } from '../services/procurement-package-item-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemBehavior extends ProcurementCommonItemBehavior<IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	public constructor(packageItemDataService: ProcurementPackageItemDataService) {
		super(packageItemDataService);
	}
}
