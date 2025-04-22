/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvTransactionEntity } from './entities/inv-transaction-entity.interface';
import { IControllingUnitGroupSetComplete, IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';

export class InvTransactionComplete extends CompleteIdentification<IInvTransactionEntity> implements IControllingUnitGroupSetComplete {
	/*
	 * InvTransaction
	 */
	public InvTransaction?: IInvTransactionEntity | null;

	/*
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/*
	 * controllingStructureGrpSetDTLToDelete
	 */
	public controllingStructureGrpSetDTLToDelete?: IControllingUnitdGroupSetEntity[] | null = [];

	/*
	 * controllingStructureGrpSetDTLToSave
	 */
	public controllingStructureGrpSetDTLToSave?: IControllingUnitdGroupSetEntity[] | null = [];
}
