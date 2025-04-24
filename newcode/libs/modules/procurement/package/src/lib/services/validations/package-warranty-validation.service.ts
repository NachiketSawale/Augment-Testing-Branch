/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcWarrantyEntity, ProcurementCommonWarrantyValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageWarrantyDataService } from '../package-warranty-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../../model/entities/package-2header-complete.class';

/**
 * Procurement Package warranty validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageWarrantyValidationService extends ProcurementCommonWarrantyValidationService<IPrcWarrantyEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	public constructor() {
		const dataService = inject(ProcurementPackageWarrantyDataService);
		super(dataService);
	}

}