import { IInitializationContext } from '@libs/platform/common';
import { ICommonWizard, ProcurementCommonBidderSearchWizardService } from '@libs/procurement/common';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ProcurementRfqBusinessPartnerDataService } from '../services/rfq-business-partner-data.service';

export class ProcurementRfqBidderSearchWizard implements ICommonWizard {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(ProcurementRfqHeaderMainDataService);
		const bidderService = context.injector.get(ProcurementRfqBusinessPartnerDataService);
		const selected = dataService.getSelectedEntity();

		const requestOptions = {
			savePortalBizPartnerUrl: 'procurement/rfq/wizard/saveportalbizpartner',
			currentBidderList: bidderService.getList(),
			isParentSelected: !!selected,
			mainItemId: selected ? selected.Id : undefined,
			additionalInquiryParams: selected
				? {
					'rfqProjectFk': selected.CompanyFk,
					'rfqCompanyFk': selected.ProjectFk,
				}
				: undefined,
			onCreatedSucceeded: () => {
				bidderService.loadSubEntities({ id: -1 });
			},
		};

		await context.injector.get(ProcurementCommonBidderSearchWizardService).execute(requestOptions);
	}
}