import { CommonContactEntityInfoService, ContactSource, IContactEntityInfoSetting } from '@libs/businesspartner/common';
import { BusinesspartnerContactDataService } from '../../services/businesspartner-contact-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { ServiceLocator } from '@libs/platform/common';
import { BusinesspartnerContactValidationService } from '../../services/validations/businesspartner-contact-validation.service';
import { BusinesspartnerContactGridBehavior } from '../../behaviors/businesspartner-contact-grid-behavior.service';

const contactEntityInfoService = ServiceLocator.injector.get(CommonContactEntityInfoService);
const contactEntityInfoSetting: IContactEntityInfoSetting = {
	dataServiceToken: (ctx) => ctx.injector.get(BusinesspartnerContactDataService),
	source: ContactSource.BusinesspartnerMain,
	validationService: (ctx) => ctx.injector.get(BusinesspartnerContactValidationService),
	behavior: (ctx) => ctx.injector.get(BusinesspartnerContactGridBehavior),
	gridUuid:'72f38c9d2f4b429bae5f70da33068ae3',
	fromUuid: '2bea71e2f2bf42eaa0ea2fc60f8f5615',
	permissionUuid :'73b6280b180149a09f3a97f142bfc3dc',
};

export const BUSINESS_PARTNER_CONTRACT_INFO = EntityInfo.create(contactEntityInfoService.getContactEntityInfo(contactEntityInfoSetting));
