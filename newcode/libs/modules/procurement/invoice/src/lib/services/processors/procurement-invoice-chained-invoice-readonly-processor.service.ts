/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IInvHeader2InvHeaderEntity } from '../../model';
import { ProcurementInvoiceChainedInvoiceDataService } from '../procurement-invoice-chained-invoice-data.service';

export class ProcurementInvoiceChainedInvoiceReadonlyProcessor extends EntityReadonlyProcessorBase<IInvHeader2InvHeaderEntity>{
	public constructor(protected dataService: ProcurementInvoiceChainedInvoiceDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInvHeader2InvHeaderEntity>{
		return {};
	}

	protected override readonlyEntity(entity: IInvHeader2InvHeaderEntity): boolean {
		const invHeader = this.dataService.getSelectedEntity();
		if(!invHeader) {
			return true;
		}
		return invHeader.Version !== 0;
	}
}