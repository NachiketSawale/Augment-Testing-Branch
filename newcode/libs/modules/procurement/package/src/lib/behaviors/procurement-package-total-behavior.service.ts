import { Injectable, inject } from '@angular/core';
import { ProcurementCommonTotalBehavior } from '@libs/procurement/common';
import { IPrcCommonTotalEntity, IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageTotalDataService } from '../services/package-total-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageTotalBehavior extends ProcurementCommonTotalBehavior<IPrcCommonTotalEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		super(inject(ProcurementPackageTotalDataService));
	}
}
