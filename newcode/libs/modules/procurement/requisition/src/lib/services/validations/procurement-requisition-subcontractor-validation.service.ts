/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorValidationService} from '@libs/procurement/common';
import { ProcurementRequisitionSubcontractorDataService } from '../procurement-requisition-subcontractor-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';

/**
 * Requisition subcontractor validation service
 */
export class ProcurementRequisitionSubcontractorValidationService extends ProcurementCommonSubcontractorValidationService<IPrcSubreferenceEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {

	public constructor(protected override readonly dataService: ProcurementRequisitionSubcontractorDataService) {
		super(dataService);
	}

}