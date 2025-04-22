/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonEventsEntity, ProcurementCommonEventsDataService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

/**
 * events service in package
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEventDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPackageHeaderDataService);
		super(parentService);
	}

	protected getPackageFk(parent: IPrcPackageEntity): number {
		if (parent) {
			return parent.Id;
		}
		throw new Error('Should have selected package entity');
	}

	//TODO: readonly is not working as expected
	protected isReadonly(): boolean {
		return false;
	}

	public override isParentFn(parentKey: IPrcPackageEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}
}
