/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IPackageEstimateResourceEntity} from '../../model/entities/package-estimate-resource-entity.interface';
import {ProcurementPackageEstimateResourceDataService} from '../package-estimate-resource-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateResourceReadonlyProcessorService extends EntityReadonlyProcessorBase<IPackageEstimateResourceEntity> {
	public constructor(protected resourceService: ProcurementPackageEstimateResourceDataService) {
		super(resourceService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPackageEstimateResourceEntity> {
		return {};
	}

	protected override readonlyEntity(): boolean {
		return true;
	}
}