/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import { IPrcSubreferenceEntity } from '../../model/entities';
import {
	EntityReadonlyProcessorBase,
	ReadonlyFunctions
} from '@libs/basics/shared';
import { ProcurementCommonSubcontractorDataService } from '../procurement-common-subcontractor-data.service';

/**
 * Procurement common subcontractor entity readonly processor
 */
export class ProcurementCommonSubcontractorReadonlyProcessor<T extends IPrcSubreferenceEntity,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonSubcontractorDataService<T, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			BpdSubsidiaryFk: e => !e.item.BpdBusinesspartnerFk,
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.dataService.prcHeaderContext.readonly;
	}

}