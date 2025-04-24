/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterResourceValidationGeneratedService } from './generated/resource-master-resource-validation-generated.service';
import { inject, Injectable } from '@angular/core';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IResourceMasterResourceEntity, IResourceTypeEntity } from '@libs/resource/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService, PlatformHttpService, PropertyType } from '@libs/platform/common';
import { isNull } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterResourceValidationService extends ResourceMasterResourceValidationGeneratedService {
	private validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	protected override handwrittenValidators = {
		Code: [this.validateCode],
		CurrencyFk: [this.validateCurrencyFk],
		Validto: [this.validateValidateTo],
		Validfrom: [this.validateValidateFrom],
		Rate: [this.validateIsMandatory],
		Type: [this.validateTypeFk]
	};
	private validateTypeFk(info: ValidationInfo<IResourceMasterResourceEntity>) {
		const containerSpec = {Id: info.value};
		return this.http.
			post<IResourceTypeEntity[]>(this.configService.webApiBaseUrl + 'resource/type/list', containerSpec)
			.then((typs) => {
				if (typs.some(t => true)) {
					info.entity.DispatcherGroupFk = typs[0].DispatcherGroupFk;
				}
				return new ValidationResult();
			}
		);
	}
	private async validateCode(info : ValidationInfo<IResourceMasterResourceEntity>){
		return this.validationUtils.isAsyncUnique(info, 'resource/master/resource/isuniquecode');
	}
	private validateValidateTo(info : ValidationInfo<IResourceMasterResourceEntity>){
		if(!isNull(info.entity.Validfrom)){
			return this.validateIsValidTimeSpan(new ValidationInfo(info.entity,info.entity.Validfrom,'Validfrom'), info);
		} else {
			return new ValidationResult();
		}
	}
	private validateValidateFrom(info : ValidationInfo<IResourceMasterResourceEntity>){
		if(!isNull(info.entity.Validto)){
			return this.validateIsValidTimeSpan(info, new ValidationInfo(info.entity,info.entity.Validto,'Validto'));
		} else {
			return new ValidationResult();
		}

	}
	private validateCurrencyFk(info : ValidationInfo<IResourceMasterResourceEntity>){
		return this.validateIsMandatory(new ValidationInfo(info.entity,this.convertZeroToNull(info.value as number),info.field));
	}
	private convertZeroToNull(value: PropertyType | undefined) {
		return (value === 0) ? undefined : value;
	}
}