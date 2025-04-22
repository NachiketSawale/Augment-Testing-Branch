/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcGeneralsEntity, ProcurementCommonGeneralsValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageGeneralsDataService } from '../procurement-package-generals-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../../model/entities/package-2header-complete.class';

/**
 * Package Generals validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageGeneralsValidationService extends ProcurementCommonGeneralsValidationService<IPrcGeneralsEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

    public constructor() {
        const dataService = inject(ProcurementPackageGeneralsDataService);
        super(dataService);
    }
}