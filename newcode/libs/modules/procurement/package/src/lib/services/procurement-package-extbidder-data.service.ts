/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonExtBidderEntity, ProcurementCommonExtBidderDataService } from '@libs/procurement/common';
import { Injectable } from '@angular/core';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * ExtBidder service in package
 */
export class ProcurementPackageExtBidderDataService extends ProcurementCommonExtBidderDataService<IProcurementCommonExtBidderEntity, IPrcPackageEntity, PrcPackageCompleteEntity>{

	public constructor(protected override parentService: ProcurementPackageHeaderDataService) {
		super(parentService);
	}

	protected getPackageFk(parent: IPrcPackageEntity): number {
		if(parent) {
			return parent.Id!;
		}
		throw new Error('Should have selected parent entity');
	}

	public isReadonly(): boolean {
		return this.parentService.getHeaderContext().readonly;
	}

	public override isParentFn(parentKey: IPrcPackageEntity, entity: IProcurementCommonExtBidderEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}
}