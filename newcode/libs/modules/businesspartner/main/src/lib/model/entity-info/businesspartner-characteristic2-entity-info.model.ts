import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';


export const BUSINESS_PARTNER_CHARACTERISTIC2_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: 'f5e138f988314470a36fe801883b4d2d',
	sectionId: BasicsCharacteristicSection.BusinessPartnerCharacteristic2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerMainHeaderDataService);
	}
});