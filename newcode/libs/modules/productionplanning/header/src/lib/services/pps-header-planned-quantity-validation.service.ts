/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { PpsHeaderPlannedQuantityDataService } from './pps-header-planned-quantity-data.service';
import { PpsHeaderPlannedQuantityBaseValidationService } from './pps-header-planned-quantity-base-validation.service';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderPlannedQuantityValidationService extends PpsHeaderPlannedQuantityBaseValidationService {
	public constructor(dataService: PpsHeaderPlannedQuantityDataService) {
		super(dataService);
	}
}