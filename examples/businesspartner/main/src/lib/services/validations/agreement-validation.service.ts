import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import * as _ from 'lodash';
import { AgreementDataService } from '../agreement-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IAgreementEntity } from '@libs/businesspartner/interfaces';

export class AgreementValidationService extends BaseValidationService<IAgreementEntity>{
	private agreementDataService = inject(AgreementDataService);
	private basicsValidation = inject(BasicsSharedDataValidationService);
	protected generateValidationFunctions(): IValidationFunctions<IAgreementEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IAgreementEntity> {
		return this.agreementDataService;
	}

	protected validateValidFrom(info: ValidationInfo<IAgreementEntity>):ValidationResult{
		if(_.isNull(info.entity.ValidTo)){
			return this.basicsValidation.createSuccessObject();
		}
		const validFrom = _.isUndefined(info.value)?'':info.value.toString();
		const validTo = _.isUndefined(info.entity.ValidTo)?'':info.entity.ValidTo.toString();
		return this.basicsValidation.validatePeriod(this.getEntityRuntimeData(), info, validFrom , validTo, 'ValidTo');
	}

	protected validateValidTo(info: ValidationInfo<IAgreementEntity>):ValidationResult{
		if(_.isNull(info.entity.ValidFrom)){
			return this.basicsValidation.createSuccessObject();
		}
		const validTo = _.isUndefined(info.value)?'':info.value.toString();
		const validFrom = _.isUndefined(info.entity.ValidFrom)?'':info.entity.ValidFrom.toString();
		return this.basicsValidation.validatePeriod(this.getEntityRuntimeData(), info, validFrom , validTo, 'ValidTo');
	}

}