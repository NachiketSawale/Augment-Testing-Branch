/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonDeliveryScheduleEntity, ProcurementCommonDeliveryScheduleProcessor } from '@libs/procurement/common';
import { ProcurementPackageDeliveryScheduleDataService } from '../procurement-package-delivery-schedule-data.service';
import { ReadonlyFunctions } from '@libs/basics/shared';
import { PackageItemComplete } from '../../model/entities/package-item-complete.class';
import { IPackageItemEntity } from '../../model/entities/package-item-entity.interface';

export class ProcurementPackageDeliveryScheduleProcessor extends ProcurementCommonDeliveryScheduleProcessor<IProcurementCommonDeliveryScheduleEntity, IPackageItemEntity, PackageItemComplete> {
	public constructor(protected deliveryScheduleDataService: ProcurementPackageDeliveryScheduleDataService) {
		super(deliveryScheduleDataService);
	}

	public isReadonly(): boolean {
		return false;
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IProcurementCommonDeliveryScheduleEntity> {
		return { ...super.generateReadonlyFunctions() };
	}
}
