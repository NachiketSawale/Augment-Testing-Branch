/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import {
    IPrcItemInfoBLEntity,
    ProcurementCommonItemInfoBlDataService
} from '@libs/procurement/common';
import { ProcurementPackageItemDataService } from './procurement-package-item-data.service';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';

/**
 * BaseLine service in contract
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementPackageItemInfoBlDataService extends ProcurementCommonItemInfoBlDataService<IPrcItemInfoBLEntity,IPackageItemEntity, PackageItemComplete> {
    
    public constructor(protected override readonly parentService: ProcurementPackageItemDataService) {
        super(parentService);
    }

    public override isParentFn(parentKey: IPackageItemEntity, entity: IPrcItemInfoBLEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}