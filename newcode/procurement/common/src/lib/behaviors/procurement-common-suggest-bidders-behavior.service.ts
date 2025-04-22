/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonSuggestBiddersDataService } from '../services/procurement-common-suggest-bidders-data.service';

/**
 * The common behavior for procurement suggest bidder entity containers
 */
export class ProcurementCommonSuggestBiddersBehaviorService<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: ProcurementCommonSuggestBiddersDataService<T, PT, PU>) {

	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
	}

}