import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { BusinessPartnerHelperService } from '../helper/businesspartner-helper.service';
import { BUSINESS_PARTNER_HELPER_TOKEN, ContactConditionKeyEnum, IBusinessPartnerHelperProvider } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IBusinessPartnerHelperProvider>({
	token: BUSINESS_PARTNER_HELPER_TOKEN,
	useAngularInjection: true,
})
export class BusinessPartnerHelperProviderService implements IBusinessPartnerHelperProvider {
	private readonly helperService = new BusinessPartnerHelperService();

	public async getDefaultContactByBranch(contactConditionKeyEnum: ContactConditionKeyEnum, businessPartnerFk?: number|null, branchFk?: number|null) {
		return await this.helperService.getDefaultContactByBranch(contactConditionKeyEnum, businessPartnerFk, branchFk);
	}
}
