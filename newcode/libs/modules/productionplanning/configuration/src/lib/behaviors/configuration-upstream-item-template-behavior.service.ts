/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsUpstreamItemTemplateEntity } from '../model/entities/pps-upstream-item-template-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class ConfigurationUpstreamItemTemplateBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsUpstreamItemTemplateEntity>, IPpsUpstreamItemTemplateEntity> {

}