/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPrcInventoryHeaderEntity } from './entities/prc-inventory-header-entity.interface';

export class ProcurementInventoryHeaderGridComplete implements CompleteIdentification<IPrcInventoryHeaderEntity>{

	public Id: number = 0;

	public InventoryHeader?: IPrcInventoryHeaderEntity[] | null = [];

	
}
