/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';
import { CollectionHelper, PlatformConfigurationService } from '@libs/platform/common';
import { ICompanies2MaterialCatalogEntity } from '../model/entities/companies-2-material-catalog-entity.interface';
import { MaterialCatalogComplete } from '../model/material-catalog-complete.class';

export const BASICS_COMPANY_2MATERIAL_CATALOG_DATA_TOKEN = new InjectionToken<BasicsCompany2MaterialCatalogDataService>('basicsCompany2MaterialCatalogDataToken');

/**
 * Material catalog entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCompany2MaterialCatalogDataService extends DataServiceHierarchicalLeaf<ICompanies2MaterialCatalogEntity, IMaterialCatalogEntity, MaterialCatalogComplete> {
	private isLoadingForJustDeepCopyCatalog?: boolean;
	private readonly configurationService = inject(PlatformConfigurationService);

	public constructor(private catalogService: BasicsMaterialCatalogDataService) {
		super({
			apiUrl: 'basics/materialcatalog/tocompanies',
			roleInfo: <IDataServiceChildRoleOptions<ICompanies2MaterialCatalogEntity, IMaterialCatalogEntity, MaterialCatalogComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Company2MaterialCatalog',
				parent: catalogService,
			},
			readInfo: {
				endPoint: 'tree',
				usePost: false,
			},
		});
	}

	private getSelectedMaterialCatalogEntity(): IMaterialCatalogEntity {
		const catalog = this.getSelectedParent();

		if (!catalog) {
			throw new Error('There should be a selected parent catalog to load the company 2 catalog data');
		}

		return catalog;
	}

	protected override provideLoadPayload(): object {
		const catalog = this.getSelectedMaterialCatalogEntity();

		// update the flag which stands for current material catalog is just from deep copy
		this.isLoadingForJustDeepCopyCatalog = catalog.isJustDeepCopied;

		return {
			mdcContexId: catalog.MdcContextFk,
			materialCatalogId: catalog.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): ICompanies2MaterialCatalogEntity[] {
		const entities = loaded as ICompanies2MaterialCatalogEntity[];
		const catalog = this.getSelectedMaterialCatalogEntity();

		// When creating a catalog, at the element of the login client must get the appropriate defaults (Get all rights on the catalog).
		if (catalog.Version === 0 || this.isLoadingForJustDeepCopyCatalog) {
			this.setDefaultValue(entities);
		}

		return entities;
	}

	private setDefaultValue(entities: ICompanies2MaterialCatalogEntity[]) {
		const flatArray = CollectionHelper.Flatten(entities, this.childrenOf);

		flatArray.some((e) => {
			if (e.Id === this.configurationService.clientId) {
				CollectionHelper.Flatten(e, this.childrenOf).forEach((e2) => {
					e2.CanEdit = true;
					e2.CanLookup = true;
					e2.IsOwner = true;
					this.setModified(e2);
				});
				return true;
			}
			return false;
		});
	}

	public override childrenOf(element: ICompanies2MaterialCatalogEntity): ICompanies2MaterialCatalogEntity[] {
		return element.Companies ?? [];
	}

	public override parentOf(element: ICompanies2MaterialCatalogEntity): ICompanies2MaterialCatalogEntity | null {
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

	public override isParentFn(parentKey: IMaterialCatalogEntity, entity: ICompanies2MaterialCatalogEntity): boolean {
		return entity.MaterialCatalogFk === parentKey.Id;
	}
}
