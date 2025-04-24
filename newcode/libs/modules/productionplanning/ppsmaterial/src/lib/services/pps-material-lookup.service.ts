import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IPpsMaterialLookupEntity } from '../model/entities/pps-material-lookup-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPpsMaterialLookupEntity, TEntity> {

	public constructor() {
		super({
			httpRead: {
				route: 'productionplanning/ppsmaterial/',
				endPointRead: 'lookupAll',
				usePostForRead: false
			},
		}, {
			uuid: '0512f973b46f476eb6a0b49d92630424',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',

		});
	}
}