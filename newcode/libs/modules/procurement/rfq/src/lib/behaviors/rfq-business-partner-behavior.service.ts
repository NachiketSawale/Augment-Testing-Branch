/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqBusinessPartnerEntity } from '../model/entities/rfq-businesspartner-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinessPartnerBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqBusinessPartnerEntity>, IRfqBusinessPartnerEntity> {
	/*
		// TODO-DRIZZLE: The drag/drop to be migrated.
		let myGridConfig = {
					type: 'rfqBusinessPartner',
					dragDropService: procurementRfqDragDropService,
				};
	 */
}