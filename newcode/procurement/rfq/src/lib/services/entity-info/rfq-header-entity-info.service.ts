/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityInfo, IFormContainerSettings, IGridContainerSettings } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IRfqHeaderEntityInfoOptions } from '../../model/interfaces/rfq-header-entity-info-options.interface';
import { RFQ_HEADER_ENTITY_CONFIG } from '../../model/classes/rfq-header-entity-config.class';

/**
 * The factory to create entity info according to the custom option.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqHeaderEntityInfoFactory {
	/**
	 * Create the entity info instance according to the options.
	 * @param options
	 */
	public static create(options: IRfqHeaderEntityInfoOptions) {
		return EntityInfo.create<IRfqHeaderEntity>(
			{
				...RFQ_HEADER_ENTITY_CONFIG,
				grid: {...(RFQ_HEADER_ENTITY_CONFIG.grid as IGridContainerSettings<IRfqHeaderEntity>), behavior: options.behavior},
				form: {...(RFQ_HEADER_ENTITY_CONFIG.form as IFormContainerSettings<IRfqHeaderEntity>), containerUuid: options.formContainerUuid},
				dataService: options.dataService,
				validationService: options.validationService,
				permissionUuid: options.permissionUuid
			});
	}
}