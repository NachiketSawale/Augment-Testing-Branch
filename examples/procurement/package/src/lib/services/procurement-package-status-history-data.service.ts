/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedSatusHistoryDataService, IStatusHistoryEntity } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
/**
 * Represents the data service to handle Procurement Package Status History Data Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageStatusHistoryDataService extends BasicsSharedSatusHistoryDataService<IStatusHistoryEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor( public packageHeaderService:ProcurementPackageHeaderDataService) {
		super(packageHeaderService);
	}
	protected getModuleName(): string {
        return 'package';
    }
}
