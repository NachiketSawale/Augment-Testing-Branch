import { ProcurementCommonCreateBusinessPartnerWizardService } from '@libs/procurement/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionSuggestedBidderDataService } from '../services/requisition-suggested-bidder-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

export class ProcurementRequisitionCreateBusinesspersonWizard extends ProcurementCommonCreateBusinessPartnerWizardService<IPrcSuggestedBidderEntity, IReqHeaderEntity, ReqHeaderCompleteEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(public context: IInitializationContext) {
		super({
			moduleName: context.moduleManager.activeModule?.internalModuleName ?? '',
			rootService: context.injector.get(ProcurementRequisitionHeaderDataService),
			parentService: context.injector.get(ProcurementRequisitionHeaderDataService),
			suggestedBidderService: context.injector.get(RequisitionSuggestedBidderDataService),
		});
	}

	protected override getPrcHeaderFk(entity: IReqHeaderEntity) {
		return entity.PrcHeaderFk;
	}
}
