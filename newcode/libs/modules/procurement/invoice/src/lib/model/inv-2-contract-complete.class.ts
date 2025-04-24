/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IControllingUnitGroupSetComplete, IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';
import { IInv2ContractEntity } from './entities/inv-2-contract-entity.interface';

export class Inv2ContractComplete extends CompleteIdentification<IInv2ContractEntity> implements IControllingUnitGroupSetComplete {
	/*
	 * InvContract
	 */
	public InvContract?: IInv2ContractEntity | null;

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
