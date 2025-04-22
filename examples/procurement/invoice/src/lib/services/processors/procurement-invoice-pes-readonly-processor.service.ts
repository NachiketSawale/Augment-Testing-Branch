/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IInv2PESEntity } from '../../model';
import { ProcurementInvoicePesDataService } from '../procurement-invoice-pes-data.service';

export class ProcurementInvoicePesReadonlyProcessor extends EntityReadonlyProcessorBase<IInv2PESEntity> {

	public constructor(protected dataService: ProcurementInvoicePesDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IInv2PESEntity> {
		return {
			PesHeaderFk: e => e.item.Version! >=1
		};
	}

}