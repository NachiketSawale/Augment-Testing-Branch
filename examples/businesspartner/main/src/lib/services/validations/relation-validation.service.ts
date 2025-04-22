import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BusinessPartnerMainRelationDataService } from '../relation-data.service';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { IBusinessPartnerRelationEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class RelationValidationService extends BaseValidationService<IBusinessPartnerRelationEntity>{
	private relationDataService = inject(BusinessPartnerMainRelationDataService);
	private bpLookupService = inject(BusinessPartnerLookupService);
	private translate = inject(PlatformTranslateService);
	protected generateValidationFunctions(): IValidationFunctions<IBusinessPartnerRelationEntity> {
		return {
			BusinessPartner2Fk: this.validateBusinessPartner2Fk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartnerRelationEntity> {
		return this.relationDataService;
	}

	protected validateBusinessPartner2Fk(info: ValidationInfo<IBusinessPartnerRelationEntity>): ValidationResult{
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		if(this.validationFk(info.value)) {
			if(info.value === 0){
				this.bpLookupService.getItemByKey({
					id: info.value
				}).subscribe(bp=>{
					if(!bp) {
						result.valid = false;
						result.error = this.translate.instant({key: 'cloud.common.emptyOrNullValueErrorMessage', params:{ fieldName: info.field }}).text;
						info.entity.AddressLine = null;
					}
					return result;
				});
			}else{
				result.valid = false;
				result.error = this.translate.instant({key: 'cloud.common.emptyOrNullValueErrorMessage', params:{ fieldName: info.field }}).text;
				info.entity.AddressLine = null;
				return result;
			}
		}else{
			this.bpLookupService.getItemByKey({
				id: info.value as number
			}).subscribe(bp=>{
				if(bp){
					// info.entity.AddressLine = bp.AddressLine;
				}else{
					info.entity.AddressLine	= null;
				}
			});
		}
		return result;
	}

	private validationFk(value: PropertyType | undefined) {
		return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) || value === -1 || value === 0;
	}

}