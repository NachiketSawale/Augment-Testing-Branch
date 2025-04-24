/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcWarrantyEntity, ProcurementCommonWarrantyDataService } from '@libs/procurement/common';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { Package2HeaderDataService } from './package-2header-data.service';

/**
 * Procurement Package Warranty service in Package
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageWarrantyDataService extends ProcurementCommonWarrantyDataService<IPrcWarrantyEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(Package2HeaderDataService);
		super(parentService);
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcWarrantyEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
