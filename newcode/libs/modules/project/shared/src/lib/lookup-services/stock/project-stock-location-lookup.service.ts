/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IProjectStockLocationEntity } from '@libs/project/interfaces';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ProjectStockLocationLookupService extends UiCommonLookupEndpointDataService<IProjectStockLocationEntity> {
	public constructor() {
		super({
			httpRead: {
				route: 'project/stock/location/',
				endPointRead: 'instances',
				usePostForRead: true
			},
			filterParam: true,
			prepareListFilter: (context) => {
				return {
					Pkey1: get(context?.entity, 'ProjectStockFk') || get(context?.entity, 'PrjStockFk') || get(context?.entity, 'StockFk') || get(context?.entity, 'PKey1'),
					PKey2: get(context?.entity, 'PrjProjectFk') || get(context?.entity, 'ProjectFk') || get(context?.entity, 'ProjectId') || get(context?.entity, 'PKey2')
				};
			},
			tree: {
				parentProp: 'StockLocationFk',
				childProp: 'SubLocations',
			}
		}, {
			uuid: 'b7872df0cbb5464f990237bc32685e5c',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						visible: true,
						readonly: true,
						sortable: true,
						width: 100

					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						visible: true,
						readonly: true,
						sortable: true,
						width: 150

					}
				]
			},
			dialogOptions: {
				headerText: {
					key: 'project.stock.stockListContainerTitle',
					text: 'Stock Locations',
				}
			}
		});
	}
}

