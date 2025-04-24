/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { StandardDialogButtonId, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BusinessPartnerLookupComponent } from '../business-partner/components/lookup/business-partner-lookup.component';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedTeamsButtonService } from '@libs/basics/shared';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';


/**
 * BusinessPartner lookup  data service.
 */
@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBusinessPartnerSearchMainEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('BusinessPartner', {
			uuid: '000af9b0abd14af8b594f45800ae99de',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'BusinessPartnerName1',
			dialogComponent: BusinessPartnerLookupComponent,
			dialogOptions: {
				headerText: {
					text: 'Assign Business Partner',
					key: 'cloud.common.dialogTitleBusinessPartner'
				},
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						autoClose: true,
						isDisabled: (info) => {
							const searchScope = (info.dialog.body as BusinessPartnerLookupComponent<IBusinessPartnerSearchMainEntity>).scope;
							return !searchScope.selectedItem;
						},
						fn: (event, info) => {
							(info.dialog.body as BusinessPartnerLookupComponent<IBusinessPartnerSearchMainEntity>).apply();
						}
					},
					{id: StandardDialogButtonId.Cancel},
				]
			},
			buildSearchString: (searchText: string) => {
				if (!searchText) {
					return '';
				} else {
					const searchString = 'Code.Contains("%SEARCH%") Or TradeName.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchText);
				}
			}
		});
		this.paging.enabled = true;
		this.paging.pageCount = 100;
		this.addTeamsButton();
	}

	/**
	 * add teams button。
	 * @private
	 */
	private addTeamsButton() {
		const teamsButtonService = ServiceLocator.injector.get(BasicsSharedTeamsButtonService<IBusinessPartnerSearchMainEntity, TEntity>, null, {optional: true});
		if (teamsButtonService) {
			teamsButtonService.addTeamsButtonToLookup(this.config);
		}
	}
}
