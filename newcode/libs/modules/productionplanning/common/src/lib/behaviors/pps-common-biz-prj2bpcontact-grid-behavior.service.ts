/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IProjectMainPrj2BPContactEntity } from '@libs/project/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonPrj2bpcontactGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMainPrj2BPContactEntity>, IProjectMainPrj2BPContactEntity> {

}