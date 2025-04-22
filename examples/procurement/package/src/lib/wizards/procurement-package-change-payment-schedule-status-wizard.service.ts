/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonChangePaymentScheduleStatusWizardService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackagePaymentScheduleDataService } from '../services/procurement-package-payment-schedule-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Package change payment schedule status wizard service
 */
export class ProcurementPackageChangePaymentScheduleStatusWizardService extends ProcurementCommonChangePaymentScheduleStatusWizardService<IPrcPaymentScheduleEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {

	public constructor( mainService:ProcurementPackageHeaderDataService, dataService:ProcurementPackagePaymentScheduleDataService){
		super(mainService, dataService);
	}
}
