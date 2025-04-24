/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { BasicsMaterialPriceVersionDataService } from '../price-version/basics-material-price-version-data.service';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';
import { IPriceVersionUsedCompanyEntity } from '../model/entities/price-version-used-company-entity.interface';
import { MaterialPriceVersionComplete } from '../model/material-price-version-complete.class';
import { IMaterialPriceVersionEntity } from '../model/entities/material-price-version-entity.interface';
import { IMdcMatPricever2custEntity } from '../model/entities/mdc-mat-pricever-2-cust-entity.interface';

export const BASICS_MATERIAL_PRICE_VERSION_TO_COMPANIES_DATA_TOKEN = new InjectionToken<BasicsMaterialPriceVersionToCompaniesDataService>('basicsMaterialPriceVersionToCompaniesDataToken');

/**
 * Material price version to companies entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToCompaniesDataService extends DataServiceHierarchicalLeaf<IPriceVersionUsedCompanyEntity, IMaterialPriceVersionEntity, MaterialPriceVersionComplete> {

	public constructor(
		private priceVersionDataService: BasicsMaterialPriceVersionDataService,
		private catalogDataService: BasicsMaterialCatalogDataService,
	) {
		super({
			apiUrl: 'basics/materialcatalog/priceversion2company',
			roleInfo: <IDataServiceChildRoleOptions<IMdcMatPricever2custEntity, IMaterialPriceVersionEntity, MaterialPriceVersionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceVersionToCompanies',
				parent: priceVersionDataService,
			},
			readInfo: {
				endPoint: 'tree',
				usePost: false,
			},
		});
	}

	protected override provideLoadPayload(): object {
		const priceVersion = this.getSelectedParent();
		const catalog = this.catalogDataService.getSelectedEntity();
		if (priceVersion && catalog) {
			return {
				mainItemId: priceVersion.Id,
				mdcContextId: catalog.MdcContextFk,
			};
		} else {
			throw new Error('There should be a selected parent price version and catalog to load the price version to companies data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPriceVersionUsedCompanyEntity[] {
		return loaded as IPriceVersionUsedCompanyEntity[];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialPriceVersionComplete, modified: IPriceVersionUsedCompanyEntity[], deleted: IPriceVersionUsedCompanyEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.CompaniesToSave = modified;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialPriceVersionComplete): IPriceVersionUsedCompanyEntity[] {
		return complete?.CompaniesToSave ?? [];
	}

	public override childrenOf(element: IPriceVersionUsedCompanyEntity): IPriceVersionUsedCompanyEntity[] {
		return element.Companies || [];
	}

	public override parentOf(element: IPriceVersionUsedCompanyEntity): IPriceVersionUsedCompanyEntity | null {
		if (element.CompanyFk === undefined) {
			return null;
		}

		const parentId = element.CompanyFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	public override isParentFn(parentKey: IMaterialPriceVersionEntity, entity: IPriceVersionUsedCompanyEntity): boolean {
		return entity.MaterialPriceVersionFk === parentKey.Id;
	}
}
