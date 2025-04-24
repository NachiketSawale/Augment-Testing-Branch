/*
 * Copyright(c) RIB Software GmbH
 */

import { LineItemBaseComplete } from '@libs/estimate/shared';
import { IEstLineItemSelStatementEntity } from '@libs/estimate/interfaces';

export class EstLineItemSelectionStatementComplete extends LineItemBaseComplete {
	public EstimatePriceAdjustmentToSave?:IEstLineItemSelStatementEntity[] = [];
}