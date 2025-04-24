import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { inject, Injectable } from '@angular/core';
import { Rubric } from '@libs/basics/shared';
import { ProcurementRequisitionHeaderValidationService } from '../services/validations/requisition-header-validation.service';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		super({
			moduleNameTranslationKey: 'cloud.common.entityRequisition.group',
			moduleInternalName: ProcurementInternalModule.Requisition,
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			rootValidationService: inject(ProcurementRequisitionHeaderValidationService),
			getConfigurationFK: (entity) => entity.PrcHeaderEntity?.ConfigurationFk,
			isUpdateHeaderTexts: true,
			showBillingSchema: true,
			rubricFk: Rubric.Requisition,
		});
	}
}
