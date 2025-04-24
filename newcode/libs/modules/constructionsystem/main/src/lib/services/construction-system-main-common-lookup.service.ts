/*
 * Copyright(c) RIB Software GmbH
 */
import { IBasicsCustomizeSystemOptionEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';

/**
 * constructionsystemMainCommonLookupService is the common functions for script result constructionsystem line item and resource related functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainCommonLookupService {
	private sysOpts: IBasicsCustomizeSystemOptionEntity[] = [];
	private considerDisabledDirect: boolean = false;
	private readonly isConsiderDisableDirectOptionId = 10073;

	public setSysOpts(opts: IBasicsCustomizeSystemOptionEntity[]) {
		this.sysOpts = opts;
	}

	/**
	 * get Consider Disabled Direct value
	 */
	public getConsiderDisabledDirect() {
		if (!this.considerDisabledDirect) {
			this.sysOpts.forEach((option) => {
				if (option.Id === this.isConsiderDisableDirectOptionId) {
					this.considerDisabledDirect = option.ParameterValue.toLowerCase() === 'true' || option.ParameterValue === '1';
				}
			});
		}
		return this.considerDisabledDirect;
	}
}
