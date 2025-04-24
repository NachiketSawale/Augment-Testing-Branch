import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { BusinessPartnerMainUpdateRequestDataService } from '../update-request-data.service';
import { IUpdaterequestEntity } from '@libs/businesspartner/interfaces';

export class UpdateRequestValidationService extends BaseValidationService<IUpdaterequestEntity>{
	private updateRequestDataService = inject(BusinessPartnerMainUpdateRequestDataService);
	protected generateValidationFunctions(): IValidationFunctions<IUpdaterequestEntity> {
		return {

		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IUpdaterequestEntity> {
		return this.updateRequestDataService;
	}

}