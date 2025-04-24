/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { PpsHeaderParentPlannedQuantityDataService } from './pps-header-parent-planned-quantity-data.service';
import { PpsHeaderPlannedQuantityBaseValidationService } from './pps-header-planned-quantity-base-validation.service';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderParentPlannedQuantityValidationService extends PpsHeaderPlannedQuantityBaseValidationService {
	public constructor(dataService: PpsHeaderParentPlannedQuantityDataService) {
		super(dataService);
	}
}