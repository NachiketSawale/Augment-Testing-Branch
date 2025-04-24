/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonSuggestBiddersDataService } from '../../services/procurement-common-suggest-bidders-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonSuggestedBidderReadonlyProcessorService<T extends IPrcSuggestedBidderEntity,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	public constructor(protected dataService: ProcurementCommonSuggestBiddersDataService<T, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			SubsidiaryFk: e => true,
			ContactFk: e => true,
			BpName2: e => true,
			Street: e => true,
			City: e => true,
			Zipcode: e => true,
			Email: e => true,
			CountryFk: e => true,
			Telephone: e => true,
			UserDefined1: e => true,
			UserDefined2: e => true,
			UserDefined3: e => true,
			UserDefined4: e => true,
			UserDefined5: e => true,
			CommentText: e => true,
			Remark: e => true,
		};
	}
}
