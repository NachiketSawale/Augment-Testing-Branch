/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonPrj2bpGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMainPrj2BusinessPartnerEntity>, IProjectMainPrj2BusinessPartnerEntity> {

}