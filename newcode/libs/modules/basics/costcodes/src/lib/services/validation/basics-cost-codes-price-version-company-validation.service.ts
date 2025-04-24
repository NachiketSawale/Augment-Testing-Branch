/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { ICostCodeCompanyEntity } from '../../model/models';

@Injectable({
  providedIn: 'root'
})
export class BasicsCostCodesPriceVersionCompanyValidationService extends BaseValidationService<ICostCodeCompanyEntity>  {
  protected generateValidationFunctions(): IValidationFunctions<ICostCodeCompanyEntity> {
    throw new Error('Method not implemented.');
  }
  protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICostCodeCompanyEntity> {
    throw new Error('Method not implemented.');
  }


}
