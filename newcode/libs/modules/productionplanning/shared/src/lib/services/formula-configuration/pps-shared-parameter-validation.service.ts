import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IPpsParameterEntityGenerated} from '../../model/formula-configuration/pps-parameter-entity-generated.interface';
import {inject} from '@angular/core';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {PpsSharedParameterDataService} from './pps-shared-parameter-data.service';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';

export class PpsSharedParameterValidationService extends BaseValidationService<IPpsParameterEntityGenerated> {
    private readonly validateUtils = inject(BasicsSharedDataValidationService);
    private readonly dataService = inject(PpsSharedParameterDataService);

    protected generateValidationFunctions(): IValidationFunctions<IPpsParameterEntityGenerated> {
        return {
            PpsFormulaVersionFk: this.validatePpsFormulaVersionFk,
            BasDisplayDomainFk: this.validateBasDisplayDomainFk,
            VariableName: [this.validateVariableName, this.asyncValidateVariableName],
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsParameterEntityGenerated> {
        return this.dataService;
    }

    private validatePpsFormulaVersionFk(info: ValidationInfo<IPpsParameterEntityGenerated>): ValidationResult {
        return this.validateUtils.isMandatory(info);
    }

    private validateBasDisplayDomainFk(info: ValidationInfo<IPpsParameterEntityGenerated>): ValidationResult {
        if (info.entity.BasDisplayDomainFk === 0 && info.value === null) {
            return this.validateUtils.createSuccessObject();
        }
        return this.validateUtils.isMandatory(info);
    }

    private validateVariableName(info: ValidationInfo<IPpsParameterEntityGenerated>) : ValidationResult {
        const itemList = this.dataService.getList();
        return this.validateUtils.isUniqueAndMandatory(info, itemList);
    }

    private async asyncValidateVariableName(info: ValidationInfo<IPpsParameterEntityGenerated>): Promise<ValidationResult> {
        const http = ServiceLocator.injector.get(HttpClient);
        const configService = ServiceLocator.injector.get(PlatformConfigurationService);
        const postData = {FormulaVersionId: info.entity.Id, Name: info.value};
        const url = configService.webApiBaseUrl + 'productionplanning/header/isuniquecode';

        const isUnique = await firstValueFrom(http.post(url, postData)) as boolean;

        return isUnique
            ? this.validateUtils.createSuccessObject()
            : this.validateUtils.createErrorObject('productionplanning.common.errors.uniqName');
    }
}