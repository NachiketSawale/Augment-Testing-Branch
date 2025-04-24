import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { get } from 'lodash';
import { IPpsCommonLocationInfoEntity } from '../model/entities/pps-common-location-info-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonLocationInfoLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPpsCommonLocationInfoEntity, TEntity> {

	public constructor() {
		super({
			httpRead: {
				route: 'productionplanning/common/locationinfo/',
				endPointRead: 'gettree',
				usePostForRead: true
			},
			filterParam: true,
			prepareListFilter: (context) => {
				if (context) {
					return {
						ProjectId: get(context?.entity, 'PrjProjectFk') ?? get(context?.entity, 'ProjectFk') ?? get(context?.entity, 'ProjectId'),
						PrjLocationId: get(context?.entity, 'PrjLocationFk')
					};
				}
				return {};
			},
		}, {
			uuid: '578de9cbe47845a39400219f986485a8',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'BranchPath',

		});
	}
}