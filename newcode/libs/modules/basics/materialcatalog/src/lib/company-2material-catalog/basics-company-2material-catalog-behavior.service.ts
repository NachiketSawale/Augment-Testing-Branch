/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsCompany2MaterialCatalogDataService } from './basics-company-2material-catalog-data.service';
import { ICompanies2MaterialCatalogEntity } from '../model/entities/companies-2-material-catalog-entity.interface';

export const BASICS_COMPANY_2MATERIAL_CATALOG_BEHAVIOR_TOKEN = new InjectionToken<BasicsCompany2MaterialCatalogBehavior>('basicsCompany2MaterialCatalogBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsCompany2MaterialCatalogBehavior implements IEntityContainerBehavior<IGridContainerLink<ICompanies2MaterialCatalogEntity>, ICompanies2MaterialCatalogEntity> {
	private dataService: BasicsCompany2MaterialCatalogDataService;

	public constructor() {
		this.dataService = inject(BasicsCompany2MaterialCatalogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICompanies2MaterialCatalogEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}
