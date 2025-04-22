import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import * as _ from 'lodash';
import { Bp2controllingGroupDataService } from '../bp2controlling-group-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IBp2controllinggroupEntity } from '@libs/businesspartner/interfaces';

export class Bp2controllingGroupValidationService extends BaseValidationService<IBp2controllinggroupEntity>{
	private bp2DataService = inject(Bp2controllingGroupDataService);
	private basicsValidation = inject(BasicsSharedDataValidationService);
	protected generateValidationFunctions(): IValidationFunctions<IBp2controllinggroupEntity> {
		return {
			ControllinggroupFk: this.validateControllinggroupFk,
			ControllinggrpdetailFk: this.validateControllinggrpdetailFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBp2controllinggroupEntity> {
		return this.bp2DataService;
	}

	protected validateControllinggroupFk(info:ValidationInfo<IBp2controllinggroupEntity>):ValidationResult{
		if(_.eq(info.value, 0)){
			info.entity.ControllinggroupFk = 0;
		}
		if(!_.isEqual(info.value, info.entity.ControllinggroupFk)){
			info.entity.ControllinggroupFk = info.value as number;
			info.entity.ControllinggrpdetailFk = 0;
			this.validateControllinggrpdetailFk(info);
		}
		return this.basicsValidation.isMandatory(info);
	}

	protected validateControllinggrpdetailFk(info:ValidationInfo<IBp2controllinggroupEntity>):ValidationResult{
		return this.basicsValidation.isMandatory(info);
	}

}