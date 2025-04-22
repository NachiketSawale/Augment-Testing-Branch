import { IInitializationContext } from '@libs/platform/common';
import { ProcurementCommonCreateBusinessPartnerWizardService } from '@libs/procurement/common';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ProcurementRfqSuggestBidderDataService } from '../services/rfq-suggest-bidders-data.service';
import { ProcurementRfqBusinessPartnerDataService } from '../services/rfq-business-partner-data.service';
import { IRfqHeaderEntity, IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

export class ProcurementRfqCreateBusinessPartnerWizard extends ProcurementCommonCreateBusinessPartnerWizardService<IPrcSuggestedBidderEntity, IRfqHeaderEntity, RfqHeaderEntityComplete, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	public constructor(public context: IInitializationContext) {
		super({
			moduleName: context.moduleManager.activeModule?.internalModuleName ?? '',
			rootService: context.injector.get(ProcurementRfqHeaderMainDataService),
			suggestedBidderService: context.injector.get(ProcurementRfqSuggestBidderDataService),
		});
	}

	protected override onCreatedSuccess() {
		const rfqBidderService = this.context.injector.get(ProcurementRfqBusinessPartnerDataService);
		rfqBidderService.loadSubEntities({ id: -1 });
	}

	protected override getPrcHeaderFk(entity: IRfqHeaderEntity) {
		return entity.PrcHeaderFk;
	}
}