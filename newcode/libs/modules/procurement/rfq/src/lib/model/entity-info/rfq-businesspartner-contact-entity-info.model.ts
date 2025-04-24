import { CommonContactEntityInfoService, ContactSource, IContactEntityInfoSetting } from '@libs/businesspartner/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ServiceLocator } from '@libs/platform/common';
import { ContactDataService } from '@libs/businesspartner/contact';

const contactEntityInfoService = ServiceLocator.injector.get(CommonContactEntityInfoService);
const contactEntityInfoSetting: IContactEntityInfoSetting = {
	fromUuid: 'ea9dbcbba5104970a58142a5cce4e17f',
	gridUuid: 'd053e7c20a934b96854d612613ad5a69',
	permissionUuid:'d053e7c20a934b96854d612613ad5a69',
	dataServiceToken: (ctx) => ctx.injector.get(ContactDataService),
	source: ContactSource.Rfq
};

export const RFQ_BUSINESS_PARTNER_CONTRACT_INFO = EntityInfo.create(contactEntityInfoService.getContactEntityInfo(contactEntityInfoSetting));