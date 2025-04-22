import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { BUSINESSPARTNER_DATA_PROVIDER, IBusinessPartnerEntity, IBusinesspartnerHeaderDataProvider } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IBusinesspartnerHeaderDataProvider<IBusinessPartnerEntity>>({
	token: BUSINESSPARTNER_DATA_PROVIDER,
	useAngularInjection: true,
})
export class BusinesspartnerHeaderDataProviderService implements IBusinesspartnerHeaderDataProvider<IBusinessPartnerEntity> {
	private readonly service = inject(BusinesspartnerMainHeaderDataService);

	public refreshOnlySelected(selected: IBusinessPartnerEntity[]): Promise<IBusinessPartnerEntity[]> {
		return this.service.refreshOnlySelected(selected);
	}
}