import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IContactEntity } from '@libs/businesspartner/interfaces';


export class BusinesspartnerCommonContactValidation extends BaseValidationService<IContactEntity> {

    protected dataService: IEntityRuntimeDataRegistry<IContactEntity>;
    protected translateService = inject(PlatformTranslateService);
    protected http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);

    public constructor(service: IEntityRuntimeDataRegistry<IContactEntity>) {
        super();
        this.dataService = service;
    }

    public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IContactEntity> {
        return this.dataService;
    }

    protected generateValidationFunctions(): IValidationFunctions<IContactEntity> {
        return {};
    }


}