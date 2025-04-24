/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementModule } from '@libs/procurement/shared';
import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleDataService } from '@libs/procurement/common';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

/**
 * Procurement package payment schedule data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackagePaymentScheduleDataService extends ProcurementCommonPaymentScheduleDataService<IPrcPaymentScheduleEntity,
	IPackage2HeaderEntity, PrcPackage2HeaderComplete, IPrcPackageEntity, PrcPackageCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const rootService = inject(ProcurementPackageHeaderDataService);
		const parentService= inject(Package2HeaderDataService);
		const totalSourceUrl = 'procurement/package/total';
		super(ProcurementModule.Package, totalSourceUrl, parentService, rootService);
	}

	public override isParentMainEntity(parent:IPackage2HeaderEntity): boolean {
		return true;
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcPaymentScheduleEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
