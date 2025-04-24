/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonItemDataProcessor } from '@libs/procurement/common';
import { IConHeaderEntity, IConItemEntity } from '../../model/entities';
import { ProcurementContractItemDataService } from '../procurement-contract-item-data.service';
import { ConItemComplete } from '../../model/con-item-complete.class';
import { ContractComplete } from '../../model/contract-complete.class';

export class ProcurementContractItemDataProcessor extends ProcurementCommonItemDataProcessor<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {

	/**
	 * The constructor
	 * @param conItemDataService
	 */
	public constructor(protected conItemDataService: ProcurementContractItemDataService) {
		super(conItemDataService);
	}

	protected override calculateQuantityRemaining(toProcess: IConItemEntity) {
		const isConsolidateChange = this.conItemDataService.isConsolidateChange();
		const quantityContracted = isConsolidateChange ? toProcess.ContractGrandQuantity : toProcess.Quantity;
		return this.conItemDataService.calculateQuantityRemaining(quantityContracted, toProcess.QuantityDelivered);
	}
}