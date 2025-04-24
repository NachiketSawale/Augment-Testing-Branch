/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';

import { IPrcDocumentEntity, ProcurementCommonDocumentDataService } from '@libs/procurement/common';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';

/**
 * Procurement Package Document Data Service
 */

@Injectable({
    providedIn: 'root'
})

export class ProcurementPackageDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IPrcPackageEntity, PrcPackageCompleteEntity>{
    public constructor() {
        const packageDataService = inject(ProcurementPackageHeaderDataService);
        super(packageDataService,{});
    }

    public override isParentFn(parentKey: IPrcPackageEntity, entity: IPrcDocumentEntity): boolean {
		return entity.PrcHeaderFk === parentKey.Id;
	}
}