/*.boqNotPositionFields
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BidderIdentities } from '../model/constants/bidder-identities';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonBidderIdentityService {
	private readonly _references = [
		BidderIdentities.targetKey,
		BidderIdentities.baseBoqKey,
		BidderIdentities.TargetPriceKey,
		BidderIdentities.MaterialKey,
		BidderIdentities.targetValue,
		BidderIdentities.baseBoqValue,
		BidderIdentities.TargetPriceValue,
		BidderIdentities.MaterialValue
	];

	public isBase(item: string | number) {
		return BidderIdentities.baseBoqKey === item || BidderIdentities.baseBoqValue === item;
	}

	public isTarget(item: string | number) {
		return BidderIdentities.targetKey === item || BidderIdentities.targetValue === item;
	}

	public isReference(item?: string | number | null) {
		return item !== null && item !== undefined ? this._references.indexOf(item) > -1 : false;
	}

	public isNotReference(item?: string | number) {
		return !this.isReference(item);
	}

	public isIncludedTargetCalculationColumn(item: string | number) {
		return this.isTarget(item) || this.isNotReference(item);
	}

	public isExcludedTargetCalculationColumn(item: string | number) {
		return this.isNotReference(item);
	}

	public isTargetPrice(item: string | number) {
		return BidderIdentities.TargetPriceKey === item || BidderIdentities.TargetPriceValue === item;
	}

	public isMaterialPrice(item: string | number) {
		return BidderIdentities.MaterialKey === item || BidderIdentities.MaterialValue === item;
	}
}