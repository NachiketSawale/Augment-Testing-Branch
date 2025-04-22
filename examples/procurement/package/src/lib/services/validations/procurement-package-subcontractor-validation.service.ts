/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorValidationService} from '@libs/procurement/common';
import { ProcurementPackageSubcontractorDataService } from '../procurement-package-subcontractor-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../../model/entities/package-2header-complete.class';

/**
 * Package subcontractor validation service
 */
export class ProcurementPackageSubcontractorValidationService extends ProcurementCommonSubcontractorValidationService<IPrcSubreferenceEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	public constructor() {
		const dataService = inject(ProcurementPackageSubcontractorDataService);
		super(dataService);
	}
}