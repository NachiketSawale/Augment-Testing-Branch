/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsExternalconfigEntity } from '../model/entities/pps-externalconfig-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ExternalConfigurationBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsExternalconfigEntity>, IPpsExternalconfigEntity> {

}