/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { IPrcWarrantyEntity } from '../../model/entities';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ProcurementCommonWarrantyDataService } from '../procurement-common-warranty-data.service';

/**
 * Procurement warranty entity processor
 */
export class ProcurementCommonWarrantyProcessor<T extends IPrcWarrantyEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityProcessor<T> {

	/**
	 * Construct with data service
	 * @param dataService
	 */
	public constructor(protected dataService: ProcurementCommonWarrantyDataService<T, PT, PU>) {
	}

	/**
	 *
	 * @param toProcess
	 */
	public process(toProcess: T): void {
		toProcess.HandoverDate=zonedTimeToUtc(toProcess.HandoverDate,'UTC').toISOString();
		toProcess.WarrantyEnddate=zonedTimeToUtc(toProcess.WarrantyEnddate,'UTC').toISOString();
	}

	/**
	 *
	 * @param toProcess
	 */
	public revertProcess(toProcess: T): void {
	}
}