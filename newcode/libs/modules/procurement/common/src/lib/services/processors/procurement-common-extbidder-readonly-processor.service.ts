/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	EntityReadonlyProcessorBase, ReadonlyFunctions
} from '@libs/basics/shared';
import { ProcurementCommonExtBidderDataService } from '../procurement-common-extbidder-data.service';
import { IProcurementCommonExtBidderEntity } from '../../model/entities/procurement-common-extbidder-entity.interface';

/**
 * Procurement extbidder entity readonly processor
 */
export class ProcurementCommonExtBidderReadonlyProcessor<T extends IProcurementCommonExtBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonExtBidderDataService<T, PT, PU>, protected isReadonly: boolean,protected isReadonlyByBP:boolean) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			SubsidiaryFk: e=>!this.isReadonlyByBP,
			ContactFk:e=>!this.isReadonlyByBP,
			BpName2:e=>this.isReadonlyByBP,
			Street:e=>this.isReadonlyByBP,
			City:e=>this.isReadonlyByBP,
			Zipcode:e=>this.isReadonlyByBP,
			Email:e=>this.isReadonlyByBP,
			CountryFk:e=>this.isReadonlyByBP,
			Telephone:e=>this.isReadonlyByBP,
			UserDefined1:e=>this.isReadonlyByBP,
			UserDefined2:e=>this.isReadonlyByBP,
			UserDefined3:e=>this.isReadonlyByBP,
			UserDefined4:e=>this.isReadonlyByBP,
			UserDefined5:e=>this.isReadonlyByBP,
			CommentText:e=>this.isReadonlyByBP,
			Remark:e=>this.isReadonlyByBP
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.isReadonly;
	}
}