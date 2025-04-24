/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ProcurementRfqSendEmailOrFaxService } from '../../wizards/procurement-rfq-send-email-or-fax.service';


export class ProcurementRfqWizard {
	public sendEmail(context: IInitializationContext) {
		const service = context.injector.get(ProcurementRfqSendEmailOrFaxService);
		service.showEmailFaxDialog('email');
	}

	public sendFax(context: IInitializationContext) {
		const service = context.injector.get(ProcurementRfqSendEmailOrFaxService);
		service.showEmailFaxDialog('fax');
	}
}
