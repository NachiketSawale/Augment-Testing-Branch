/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import { IPrcSubreferenceEntity} from '../model/entities';
import { ProcurementCommonSubcontractorDataService } from '../services/procurement-common-subcontractor-data.service';

/**
 * The common behavior for procurement subcontractor entity containers
 */
export class ProcurementCommonSubcontractorBehaviorService<T extends IPrcSubreferenceEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {


	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: ProcurementCommonSubcontractorDataService<T, PT, PU>) {

	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
	}
}