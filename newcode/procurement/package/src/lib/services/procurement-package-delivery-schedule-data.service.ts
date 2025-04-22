/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity, ProcurementCommonDeliveryScheduleDataService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { ProcurementPackageItemDataService } from './procurement-package-item-data.service';
import { ProcurementPackageDeliveryScheduleProcessor } from './processors/procurement-package-delivery-schedule-readonly-processor.service';

/**
 * DeliverySchedule service in package
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageDeliveryScheduleDataService extends ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity, IPackageItemEntity, PackageItemComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPackageItemDataService);
		super(parentService, ProcurementInternalModule.Package);
	}

	protected getMainItemId(parent: IPackageItemEntity): number {
		return parent.Id;
	}

	protected getMainItemStatus(parent: IPackageItemEntity): number {
		return parent.PrcItemstatusFk;
	}

	protected createReadonlyProcessor() {
		return new ProcurementPackageDeliveryScheduleProcessor(this);
	}
}
