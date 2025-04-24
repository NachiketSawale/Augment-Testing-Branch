/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { PaymentTermDataService } from '../services/basics-payment-main.service';
import { PaymentTermLayoutService } from '../services/basics-payment-term-layout.service';
import { IPaymentTermEntity } from '../model/entities/payment-term-entity.interface';
import { BasicsPaymentTermValidationService } from '../services/basics-payment-term-validation.service';

export const BASICS_PAYMENT_TERM_ENTITY_INFO = EntityInfo.create<IPaymentTermEntity>({
	grid: {
		title: { text: 'Payment Term', key: 'basics.payment.listPaymentTitle' },
	},
	form: {
		containerUuid: '997d0546dca4406dae95ab214aae9d0d',
		title: { text: 'Payment Term Detail', key: 'basics.payment.detailPaymentTitle' },
	},
	dataService: (ctx) => ctx.injector.get(PaymentTermDataService),
	validationService: (context) => context.injector.get(BasicsPaymentTermValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Payment', typeName: 'PaymentTermDto' },
	permissionUuid: '24790afafd35416595ef14527d0ba021',
	layoutConfiguration: (context) => {
		return context.injector.get(PaymentTermLayoutService).generateConfig();
	},
});
