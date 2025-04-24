/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsCharacteristicUsedInCompanyDataService } from '../services/basics-characteristic-used-in-company-data.service';
import { ICompanyEntity } from '../model/entities/company-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicUsedInCompanyBehavior implements IEntityContainerBehavior<IGridContainerLink<ICompanyEntity>, ICompanyEntity> {
	private dataService: BasicsCharacteristicUsedInCompanyDataService;

	public constructor() {
		this.dataService = inject(BasicsCharacteristicUsedInCompanyDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICompanyEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<ICompanyEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
	}

	//todo: handle onCellChange, if parent company is selected, select all its child companies and mark all as modified.
}
