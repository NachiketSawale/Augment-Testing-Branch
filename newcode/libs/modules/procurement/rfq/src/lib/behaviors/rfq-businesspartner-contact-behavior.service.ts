/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementRfqBusinessPartnerContactDataService } from '../services/rfq-businesspartner-contact-data.service';
import { IRfqBusinessPartner2ContactEntity } from '../model/entities/rfq-businesspartner-2contact-entity.interface';

/**
 * Rfq contact behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinessPartnerContactGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqBusinessPartner2ContactEntity>, IRfqBusinessPartner2ContactEntity> {
	private readonly dataService: ProcurementRfqBusinessPartnerContactDataService;

	public constructor() {
		this.dataService = inject(ProcurementRfqBusinessPartnerContactDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IRfqBusinessPartner2ContactEntity>) {

	}
}