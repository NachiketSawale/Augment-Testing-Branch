/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import { ProcurementPackageItemDataService } from '../services/procurement-package-item-data.service';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementCommonChangeItemStatusWizardService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
/**
 * Procurement Package Change Status for Item wizard service
 */
export class ProcurementPackageChangeItemStatusWizardService extends ProcurementCommonChangeItemStatusWizardService<IPackageItemEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {

	public constructor( mainService:ProcurementPackageHeaderDataService, dataService:ProcurementPackageItemDataService){
		super(mainService, dataService);
	}
	protected getModuleName(): string {
        return 'procurement.package';
    }
}
