/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { BasicsSharedMaterialPriceListLookupService } from './basics-material-price-list-lookup.service';
import { IEntityContext, PlatformTranslateService } from '@libs/platform/common';
import { IMaterialPriceVersionEntity } from '../../../interfaces/entities/material-price-version-entity.interface';
/**
 * Material price version lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialPriceVersionLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IMaterialPriceVersionEntity, TEntity> {
	private translateService = inject(PlatformTranslateService);
	private basePriceStr = this.translateService.instant('basics.material.updatePriceWizard.updateMaterialPriceBasePrice').text;
	/**
	 * The constructor
	 */
	public constructor() {
		super(
			{
				httpRead: {
					route: 'basics/material/wizard/updatematerialprice/',
					endPointRead: 'getmatpricever',
					usePostForRead: false,
				},
				filterParam: true,
				prepareListFilter: (context) => {
					if (context) {
						const tempEntity = context.entity as unknown as { catalogId: number | null | undefined };
						const filterValue = JSON.stringify({ AdditionalParameters: { MaterialCatalogFk: tempEntity.catalogId } });
						return 'filterValue=' + filterValue;
					}
					return '';
				},
			},
			{
				uuid: '22b28b2d4b68456ab98c3cc2f719d696',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				/*todo default show basePriceVersion,require framework support formatter
            formatter:function(){
                if(ngModel === 0){
                    // display the default value from the front-end side, default id set zero
                    return basePriceStr;
                }
                return displayText;
            },
            */
				gridConfig: {
					columns: [
						{
							id: 'priceVersion',
							model: 'DescriptionInfo.Translated',
							type: FieldType.Translation,
							label: {
								text: 'Price Version',
								key: 'cloud.common.entityDescription',
							},
							width: 100,
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							id: 'priceList',
							model: 'PriceListFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedMaterialPriceListLookupService,
							}),
							label: {
								text: 'Price List',
								key: 'basics.materialcatalog.entityPriceList',
							},
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
		this.cache.enabled = false;
	}

	public override getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<IMaterialPriceVersionEntity>> {
		return new Observable((observer) => {
			this.getList(context).subscribe((list) => {
				const basePriceVersion: IMaterialPriceVersionEntity = {
					Id: 0,
					DescriptionInfo: {
						Description: this.basePriceStr,
						DescriptionTr: 0,
						DescriptionModified: false,
						Translated: this.basePriceStr,
						VersionTr: 1,
						Modified: false,
						OtherLanguages: null,
					},
					MaterialCatalogFk: 0,
					PriceListFk: 0,
					Weighting: 0,
				};
				list.unshift(basePriceVersion);
				observer.next(new LookupSearchResponse(list));
				observer.complete();
			});
		});
	}
}
