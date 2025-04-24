import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { BusinessPartnerMainGuaranteeUsedDataService } from '../guarantee-used-data.service';
import { IGuaranteeUsedEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainGuaranteeUsedValidationService extends BaseValidationService<IGuaranteeUsedEntity> {
	private guaranteeUsedDataService = inject(BusinessPartnerMainGuaranteeUsedDataService);
	protected override generateValidationFunctions(): IValidationFunctions<IGuaranteeUsedEntity> {
		return {

		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IGuaranteeUsedEntity> {
		return this.guaranteeUsedDataService;
	}

}