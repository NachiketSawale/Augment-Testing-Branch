import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {BasicsSharedStatusIconService} from '@libs/basics/shared';
import { BusinessPartnerStatusEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<BusinessPartnerStatusEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor(statusIconService: BasicsSharedStatusIconService<BusinessPartnerStatusEntity, TEntity>) {
		super('BusinessPartnerStatus', {
			displayMember: 'Description',
			uuid: 'e94dbbb900d440dea08b22819b4e2fea',
			valueMember: 'Id',
			imageSelector: statusIconService
		});

	}
}
