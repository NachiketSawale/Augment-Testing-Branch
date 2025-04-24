/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { BusinessPartner2CompanyDataService } from '../businesspartner-2company-data.service';
import { IBusinessPartner2CompanyEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartner2CompanyReadonlyProcessorService extends EntityReadonlyProcessorBase<IBusinessPartner2CompanyEntity> {

	public constructor(protected dataService: BusinessPartner2CompanyDataService) {
		super(dataService);
	}

	private generalIsNoReadonly(currentItem: IBusinessPartner2CompanyEntity): boolean {
		//todo bp readonly judge
		const bpIsNoReadonly = true;
		const isNoReadonly = this.dataService.getCellEditable(currentItem);
		const finallResult = bpIsNoReadonly && isNoReadonly;
		return finallResult;
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IBusinessPartner2CompanyEntity> {
		return {
			BusinessPartnerFk: {
				shared: [
					'CompanyFk',
					'CompanyResponsibleFk',
					'Remark',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'BasClerkFk',
					'IsActive',
				],
				readonly: (info) => {
					const resulIsNoReadonly = this.generalIsNoReadonly(info.item);
					return !resulIsNoReadonly;
				},
			},
		};
	}
}
