import { IInitializationContext } from '@libs/platform/common';
import { ICommonWizard, ProcurementCommonBidderSearchWizardService } from '@libs/procurement/common';
import { Package2HeaderDataService } from '../../services/package-2header-data.service';

export class ProcurementPackageBidderSearchWizard implements ICommonWizard {
	public async execute(context: IInitializationContext) {
		const subPackageService = context.injector.get(Package2HeaderDataService);
		// const bidderService = // todo chi: service is not available
		const selected = subPackageService.getSelectedEntity();

		const requestOptions = {
			savePortalBizPartnerUrl: 'procurement/package/wizard/saveportalbizpartner',
			currentBidderList: [],
			isParentSelected: !!selected,
			mainItemId: selected ? selected.PrcHeaderFk : undefined,
			onCreatedSucceeded: () => {
				// bidderService.loadSubEntities(); // todo chi: service is not available
			},
		};

		await context.injector.get(ProcurementCommonBidderSearchWizardService).execute(requestOptions);
	}
}