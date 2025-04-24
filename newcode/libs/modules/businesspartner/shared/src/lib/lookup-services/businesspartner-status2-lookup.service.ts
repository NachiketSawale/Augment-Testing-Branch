import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {BasicsSharedStatusIconService} from '@libs/basics/shared';
import { BusinessPartnerStatus2Entity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedStatus2LookupService<TEntity extends object> extends UiCommonLookupTypeDataService<BusinessPartnerStatus2Entity, TEntity> {
	/**
	 * constructor
	 */
	public constructor(tatusIconService: BasicsSharedStatusIconService<BusinessPartnerStatus2Entity, TEntity>) {
		super('BusinessPartnerStatus2', {
			displayMember: 'DescriptionInfo.Translated',
			uuid: 'be46474fb53d475ab58d67551c0cbd0e',
			valueMember: 'Id',
			imageSelector: tatusIconService
		});
	}
}
