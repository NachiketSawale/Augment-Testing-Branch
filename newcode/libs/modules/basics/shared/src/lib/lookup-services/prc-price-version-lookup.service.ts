/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { IEntityContext, PlatformTranslateService } from '@libs/platform/common';
import { IMaterialPriceVersionEntity } from '../interfaces/entities';
import { BasicsSharedPriceListLookupService } from './customize';
import { BasicsSharedMaterialCatalogLookupService } from './basics/material/basics-material-catalog-lookup.service';

/**
 * Procurement price version lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class PrcSharedPriceVersionLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IMaterialPriceVersionEntity, TEntity> {
	private translateService = inject(PlatformTranslateService);

	/**
	 * The constructor
	 */
	public constructor() {
		super(
			{
				httpRead: {
					route: 'procurement/common/UpdateItemPrice/',
					endPointRead: 'getPriceVersionListByCatalog',
					usePostForRead: true,
				},
				filterParam: true,
			},
			{
				uuid: '12fb50b1287548038c82dbf469aabba8',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig: {
					columns: [
						{
							id: 'description',
							model: 'PriceVersionDescription',
							type: FieldType.Description,
							label: {
								text: 'Description',
								key: 'basics.material.priceList.materialPriceVersion',
							},
							width: 200,
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							id: 'priceListFk',
							model: 'PriceListFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPriceListLookupService,
							}),
							label: {
								text: 'Price List',
								key: 'basics.material.priceList.priceList',
							},
							width: 120,
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							id: 'catalogFk',
							model: 'CatalogFk',
							type: FieldType.Lookup,
							label: {
								text: 'Material Catalog',
								key: 'basics.material.materialCatalog',
							},
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedMaterialCatalogLookupService,
							}),
							width: 120,
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							id: 'validFrom',
							model: 'ValidFrom',
							type: FieldType.Date,
							label: {
								text: 'Valid From',
								key: 'basics.materialcatalog.validFrom',
							},
							width: 120,
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							id: 'validTo',
							model: 'ValidTo',
							type: FieldType.Date,
							label: {
								text: 'Valid To',
								key: 'basics.materialcatalog.validTo',
							},
							width: 120,
							visible: true,
							sortable: false,
							readonly: true,
						},
					],
				},
			},
		);
	}

	protected override prepareListFilter(context?: IEntityContext<TEntity>): string | object | undefined {
		if (context) {
		const tempEntity = context.entity as unknown as { materialIds: number[]; businessPartnerId: number | null | undefined; isCheckNeutralMaterial: boolean };
			return {
				materialIds: tempEntity ? tempEntity.materialIds : [],
				queryNeutralMaterial: tempEntity ? tempEntity.isCheckNeutralMaterial : true,
				BusinessPartnerId: tempEntity ? tempEntity.businessPartnerId: null,
			};
		}
		return undefined;
	}

	public override getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<IMaterialPriceVersionEntity>> {
		const basePriceVersionStr = this.translateService.instant('basics.material.updatePriceWizard.updateMaterialPriceBasePrice').text;
		const latestPriceVersionStr = this.translateService.instant('procurement.common.wizard.updateItemPrice.latestPriceVersion').text;
		const baseAndPriceVersionStr = this.translateService.instant('basics.material.updatePriceWizard.baseAndPriceVersions').text;
		return new Observable((observer) => {
			this.getList(context).subscribe((list) => {
				//In Angular.js, additional conditions are needed for searching in the price version lookup list.
				const basePriceVersions: IMaterialPriceVersionEntity[] = [
					{
						Id: 0,
						DescriptionInfo: {
							Description: basePriceVersionStr,
							DescriptionTr: 0,
							DescriptionModified: false,
							Translated: basePriceVersionStr,
							VersionTr: 1,
							Modified: false,
							OtherLanguages: null,
						},
						PriceVersionDescription: basePriceVersionStr,
						MaterialCatalogFk: 0,
						PriceListFk: 0,
						Weighting: 0,
					},
					{
						Id: -1,
						DescriptionInfo: {
							Description: latestPriceVersionStr,
							DescriptionTr: 0,
							DescriptionModified: false,
							Translated: latestPriceVersionStr,
							VersionTr: 1,
							Modified: false,
							OtherLanguages: null,
						},
						PriceVersionDescription: latestPriceVersionStr,
						MaterialCatalogFk: 0,
						PriceListFk: 0,
						Weighting: 0,
					},
					{
						Id: -3,
						DescriptionInfo: {
							Description: baseAndPriceVersionStr,
							DescriptionTr: 0,
							DescriptionModified: false,
							Translated: baseAndPriceVersionStr,
							VersionTr: 1,
							Modified: false,
							OtherLanguages: null,
						},
						PriceVersionDescription: baseAndPriceVersionStr,
						MaterialCatalogFk: 0,
						PriceListFk: 0,
						Weighting: 0,
					},
				];
				list = list.concat(basePriceVersions);
				observer.next(new LookupSearchResponse(list));
				observer.complete();
			});
		});
	}
}
