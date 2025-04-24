/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleBehaviorService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackagePaymentScheduleDataService } from '../services/procurement-package-payment-schedule-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

/**
 *
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackagePaymentScheduleBehaviorService extends ProcurementCommonPaymentScheduleBehaviorService<IPrcPaymentScheduleEntity,
	IPackage2HeaderEntity, PrcPackage2HeaderComplete, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		const dataService = inject(ProcurementPackagePaymentScheduleDataService);
		super(dataService);
	}
}
