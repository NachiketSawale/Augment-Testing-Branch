/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ProcurementCommonOverallDiscountService } from '@libs/procurement/common';

/**
 * Procurement Package Overall Discount Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageOverallDiscountService extends ProcurementCommonOverallDiscountService<IPrcPackageEntity> {
	private readonly package2HeaderService = inject(Package2HeaderDataService);

	protected constructor() {
		const packageHeaderService = inject(ProcurementPackageHeaderDataService);
		super(packageHeaderService);
	}

	protected override getPrcHeaderFks(): number[] {
		const package2HeaderList = this.package2HeaderService.getList();
		return package2HeaderList.map(e => e.PrcHeaderFk);
	}
}