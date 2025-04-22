/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IInvRejectEntity } from '../../model';
import { ProcurementInvoiceRejectionDataService } from '../procurement-invoice-rejection-data.service';

export class ProcurementInvoiceRejectionReadonlyProcessor extends EntityReadonlyProcessorBase<IInvRejectEntity> {
	public constructor(protected dataService: ProcurementInvoiceRejectionDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInvRejectEntity> {
		return {};
	}

	protected override readonlyEntity(entity: IInvRejectEntity): boolean {
		const invHeader = this.dataService.parentEntity;
		return !invHeader || this.dataService.isParentStatusReadonly() || entity.InvRejectFk !== null;
	}
}
