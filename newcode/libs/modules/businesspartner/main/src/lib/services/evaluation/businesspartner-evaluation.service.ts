import { Injectable } from '@angular/core';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import {ServiceLocator} from '@libs/platform/common';
import { BusinesspartnerSharedEvaluationDataService, EvaluationBaseService } from '@libs/businesspartner/shared';
import { IBusinessPartnerEntity, IEvaluationGetTreeResponse, IExtendCreateOptions } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerEvaluationService extends EvaluationBaseService<IBusinessPartnerEntity, IBusinessPartnerEntity> {
	public permissionUuid: string = '953895e120714ab4b6d7283c2fc50e14';

	public constructor() {
		super();
	}

	public override getModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName;
	}

	public override getMainService(): IEntitySelection<IBusinessPartnerEntity> {
		return ServiceLocator.injector.get(BusinesspartnerMainHeaderDataService);
	}

	public override getParentService(): IEntitySelection<IBusinessPartnerEntity> {
		return ServiceLocator.injector.get(BusinesspartnerMainHeaderDataService);
	}

	public override extendCreateOptions(
		createOptions: IExtendCreateOptions,
		parentService?: IEntitySelection<IBusinessPartnerEntity>,
		evaluationTreeService?: BusinesspartnerSharedEvaluationDataService<object, object>,
	): IExtendCreateOptions {
		if (!parentService) {
			return createOptions;
		}

		const selectEntities = parentService.getSelection() ?? null;
		createOptions.businessPartnerId = selectEntities && selectEntities.length > 0 ? selectEntities[0].Id : undefined;
		return createOptions;
	}

	public override onDataReadComplete(readItems: IEvaluationGetTreeResponse, parentService: IEntitySelection<IBusinessPartnerEntity>, evaluationTreeService: BusinesspartnerSharedEvaluationDataService<object, object>) {
		const businessPartnerItem = parentService.getSelectedEntity();
		const businessPartnerMainHeaderDataService = ServiceLocator.injector.get(BusinesspartnerMainHeaderDataService);
		if (businessPartnerItem) {
			evaluationTreeService.disableDelete(businessPartnerMainHeaderDataService.isBpStatusHasRight(businessPartnerItem,  'statusWithDeleteRight'));
		}
	}
}
