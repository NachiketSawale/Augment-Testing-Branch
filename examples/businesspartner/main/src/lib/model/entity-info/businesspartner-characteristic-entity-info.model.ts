import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';


export const BUSINESS_PARTNER_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '4f864faad8094b4c97b3e1edb28d21f8',
	sectionId: BasicsCharacteristicSection.BusinessPartnerCharacteristic,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerMainHeaderDataService);
	},
	isParentReadonlyFn: (parentService) => {
		const service = parentService as BusinesspartnerMainHeaderDataService;
		return service.isStatusReadonly();
	},
});