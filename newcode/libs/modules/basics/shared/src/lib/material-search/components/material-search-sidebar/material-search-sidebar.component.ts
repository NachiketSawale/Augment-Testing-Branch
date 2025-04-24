/*
 * Copyright(c) RIB Software GmbH
 */

import { isEmpty, find, isNil, isArray } from 'lodash';
import { Component, inject, Input } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { MaterialSearchScope } from '../../model/material-search-scope';
import { IMaterialSearchCatalog, IMaterialSearchPriceVersion } from '../../model/interfaces/material-search-catalog.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

/**
 * Sidebar component inside material search view, handle filter
 */
@Component({
	selector: 'basics-shared-material-search-sidebar',
	templateUrl: './material-search-sidebar.component.html',
	styleUrls: ['./material-search-sidebar.component.scss'],
})
export class BasicsSharedMaterialSearchSidebarComponent {
	/**
	 * Search scope
	 */
	@Input()
	public scope!: MaterialSearchScope;

	/**
	 * Translation service
	 */
	public translateService = inject(PlatformTranslateService);

	/**
	 * Price version title getter
	 * @param catalog
	 */
	public getPriceVersionTitle(catalog: IMaterialSearchCatalog) {
		const priceVersionTitle = this.scope.translateService.instant('basics.material.priceList.materialPriceVersion').text;

		if (isNil(catalog.MaterialPriceVersionFk)) {
			return priceVersionTitle;
		}

		if (catalog.PriceVersions && catalog.PriceVersions.length) {
			const priceVersion = find(catalog.PriceVersions, { Id: catalog.MaterialPriceVersionFk }) as IMaterialSearchPriceVersion;
			return priceVersion.DescriptionInfo.Translated;
		}

		return priceVersionTitle;
	}

	/**
	 * Get price version list
	 * @param catalog
	 */
	public getPriceVersionList(catalog: IMaterialSearchCatalog) {
		return catalog.PriceVersions.concat({
			Id: 0,
			DescriptionInfo: {
				Description: 'null',
				DescriptionTr: 0,
				DescriptionModified: false,
				Translated: 'null',
				VersionTr: 1,
				Modified: false,
				OtherLanguages: null,
			},
		});
	}

	/**
	 * select price version
	 * @param catalog
	 * @param priceVersionId
	 */
	public selectPriceVersion(catalog: IMaterialSearchCatalog, priceVersionId: number) {
		if (catalog.MaterialPriceVersionFk !== priceVersionId) {
			catalog.MaterialPriceVersionFk = priceVersionId > 0 ? priceVersionId : undefined;
			if (catalog.MaterialPriceVersionFk && !isEmpty(this.scope.response.items)) {
				const relativeMaterials = this.scope.response.items.filter((i) => {
					return (i.MdcMaterialCatalogFk = catalog.Id);
				});
				if (!isEmpty(relativeMaterials)) {
					relativeMaterials.forEach((m) => {
						if (m.PriceLists && m.PriceLists.length) {
							const priceList = m.PriceLists.find((p) => {
								return p.MaterialPriceVersionFk === priceVersionId;
							});
							if (priceList) {
								this.scope.loading = true;
								this.scope.overrideMaterialByPriceList(m, priceList).subscribe(() => {
									this.scope.loading = false;
								});
							}
						}
					});
				}
			}
		}
	}

	/**
	 * get structure count text
	 */
	public get getStructuresHeaderText(): string {
		if (this.scope.request.StructureId) {
			const structure = this.findStructureNode(this.scope.response.structures, this.scope.request.StructureId);
			if (structure) {
				return structure.Code + '(' + structure.MatrialCount + ')';
			}
		}
		return this.translateService.instant('basics.material.materialSearchLookup.htmlTranslate.all').text + '(' + this.scope.response.matchedCount + ')';
	}

	/**
	 * get showing structures list
	 */
	public get getStructuresList() {
		if (this.scope.request.StructureId) {
			const structure = this.findStructureNode(this.scope.response.structures, this.scope.request.StructureId);
			if (!isNil(structure)) {
				return structure.ChildItems || [];
			}
		}
		return this.scope.response.structures;
	}

	/**
	 * find current Structure node
	 * @param structures
	 * @param structureId
	 * @private
	 */
	private findStructureNode(structures?: IPrcStructureEntity[], structureId?: number | null): IPrcStructureEntity | null {
		if (!structureId) {
			return null;
		}
		if (isArray(structures)) {
			for (let i = 0; i < structures.length; i++) {
				if (structures[i].Id === structureId) {
					return structures[i];
				} else if (structures[i].ChildItems) {
					const childItems = structures[i].ChildItems;

					if (Array.isArray(childItems)) {
						const result = this.findStructureNode(childItems, structureId);
						if (result) {
							return result;
						}
					}
				}
			}
		}
		return null;
	}
}
