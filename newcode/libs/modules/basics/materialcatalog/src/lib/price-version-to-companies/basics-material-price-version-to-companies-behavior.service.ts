/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPriceVersionUsedCompanyEntity } from '../model/entities/price-version-used-company-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToCompaniesBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPriceVersionUsedCompanyEntity>, IPriceVersionUsedCompanyEntity> {

	public onCreate(containerLink: IGridContainerLink<IPriceVersionUsedCompanyEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}
