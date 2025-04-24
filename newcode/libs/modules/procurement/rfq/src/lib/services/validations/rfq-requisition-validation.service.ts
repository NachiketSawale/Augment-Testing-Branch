/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { IRfqRequisitionEntity } from '../../model/entities/rfq-requisition-entity.interface';
import { ProcurementRfqHeaderMainDataService } from '../procurement-rfq-header-main-data.service';
import { ProcurementRfqRequisitionDataService } from '../rfq-requisition-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { PrcSharedPrcConfigLookupService } from '@libs/procurement/shared';
import { HttpClient } from '@angular/common/http';
import { UiCommonFormDialogService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class RfqRequisitionValidationService extends BaseValidationService<IRfqRequisitionEntity> {

	private readonly headerDataService: ProcurementRfqHeaderMainDataService = inject(ProcurementRfqHeaderMainDataService);
	private readonly rfqRequisitionDataService: ProcurementRfqRequisitionDataService = inject(ProcurementRfqRequisitionDataService);
	private readonly validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly prcConfigLookupService = inject(PrcSharedPrcConfigLookupService);
	private readonly http = inject(HttpClient);
	private readonly config = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRfqRequisitionEntity> {
		return this.rfqRequisitionDataService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IRfqRequisitionEntity> {
		return {
			ReqHeaderFk: [this.validateReqHeaderFk],
		};
	}

	public validateReqHeaderFk(info: ValidationInfo<IRfqRequisitionEntity>, apply?: boolean): ValidationResult {
		// TODO: validate ReqHeaderFk
		const list = this.rfqRequisitionDataService.getList();
		const result = this.validationService.isUniqueAndMandatory(info, list, 'cloud.common.code');
		if (apply) {
			result.apply = true;
		}
		return result;
	}
}