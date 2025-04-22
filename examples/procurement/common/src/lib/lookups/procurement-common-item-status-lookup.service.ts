/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable,} from '@angular/core';
import {IDescriptionInfo} from '@libs/platform/common';
import { UiCommonLookupTypeDataService} from '@libs/ui/common';
import { BasicsSharedStatusIconService } from '@libs/basics/shared';

/**
 * Procurement common item status entity
 */
export class ProcurementCommonItemStatusEntity {
	/**
	 * Description info
	 */
	public DescriptionInfo?: IDescriptionInfo;
	/**
	 * Is canceled
	 */
	public IsCanceled: boolean = false;
	/**
	 * Is default
	 */
	public IsDefault: boolean = false;
	/**
	 * Is live
	 */
	public IsLive: boolean = true;
	/**
	 * The constructor
	 * @param Id
	 * @param Icon
	 */
	public constructor(public Id: number, public Icon: number) {
	}
}

/**
 * Procurement common item status lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonItemStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ProcurementCommonItemStatusEntity, TEntity> {

	/**
	 * The constructor
	 */
	public constructor(statusIconService: BasicsSharedStatusIconService<ProcurementCommonItemStatusEntity, TEntity>) {
		super('prcitemstatus', {
			uuid: '49fdeca0efcc230e6f6d11929d14503b ',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			imageSelector: statusIconService
		});
	}
}