/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleValidationService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../../model/entities/package-complete-entity.class';
import { ProcurementPackagePaymentScheduleDataService } from '../procurement-package-payment-schedule-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../../model/entities/package-2header-complete.class';

/**
 * Procurement contract payment schedule validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackagePaymentScheduleValidationService extends ProcurementCommonPaymentScheduleValidationService<IPrcPaymentScheduleEntity,
	IPackage2HeaderEntity, PrcPackage2HeaderComplete, IPrcPackageEntity, PrcPackageCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const dataService = inject(ProcurementPackagePaymentScheduleDataService);
		super(dataService);
	}
}
