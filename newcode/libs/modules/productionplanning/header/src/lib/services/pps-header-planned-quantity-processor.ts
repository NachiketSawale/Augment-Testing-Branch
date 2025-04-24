/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';
import { PpsHeaderPlannedQuantityBaseDataService } from './pps-header-planned-quantity-base-data-service';
import { PpsPlannedQuantityTypes } from '../model/constants/pps-planned-quantity-types';

/**
 * Planned Quantity entity readonly processor
 */
export class PpsPlannedQuantityReadonlyProcessor<T extends IPpsPlannedQuantityEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: PpsHeaderPlannedQuantityBaseDataService) {
	}

	/**
	 * Process item
	 * @param item
	 */
	public process(item: T) {
		const readOnly = item.PpsPlannedQuantityTypeFk === PpsPlannedQuantityTypes.Userdefined;
		const readonlyFields: IReadOnlyField<IPpsPlannedQuantityEntity>[] = [
			{ field: 'BasUomFk', readOnly: readOnly },
			{ field: 'PropertyMaterialCostcodeFk', readOnly: readOnly },
			{ field: 'MdcProductDescriptionFk', readOnly: item.PpsPlannedQuantityTypeFk !== PpsPlannedQuantityTypes.Material },
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
