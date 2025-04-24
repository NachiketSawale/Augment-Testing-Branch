/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ModuleNavBarService, NavBarIdentifier } from '@libs/ui/container-system';

/**
 * Rfq header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonRfqHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqHeaderEntity>, IRfqHeaderEntity> {
	private readonly navbarService = inject(ModuleNavBarService);

	public onInit(containerLink: IGridContainerLink<IRfqHeaderEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([
			EntityContainerCommand.CreationGroup,
			EntityContainerCommand.DeletionGroup
		]);

		this.navbarService.removeMenuItem(NavBarIdentifier.id.save);
	}
}