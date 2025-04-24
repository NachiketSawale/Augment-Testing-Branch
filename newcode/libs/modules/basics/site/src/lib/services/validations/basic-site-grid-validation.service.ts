/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSiteGridEntity } from '../../model/basics-site-grid-entity.class';
import { inject, Injectable } from '@angular/core';
import { BasicsSiteGridDataService } from '../basics-site-grid-data.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class BasicSiteGridValidationService extends BaseValidationService<BasicsSiteGridEntity> {
    private dataService = inject(BasicsSiteGridDataService);
    private translateService: PlatformTranslateService = inject(PlatformTranslateService);
    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);


    protected generateValidationFunctions(): IValidationFunctions<BasicsSiteGridEntity> {
        return {
            Code : this.asyncValidataionCode,
        };
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsSiteGridEntity> {
        return this.dataService;
    }
    protected  async asyncValidataionCode(info: ValidationInfo<BasicsSiteGridEntity>) : Promise<ValidationResult> {
        const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		const postData = { Id: info.entity.Id, Code: info.value };
		const res = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'basics/site/isuniquecode', postData));
		const isUnique = res as boolean;
		const uniqueResult = isUnique ? new ValidationResult()
			: new ValidationResult(this.translateService.instant('basics.site.errors.uniqCode').text);
		return uniqueResult;
    }

}