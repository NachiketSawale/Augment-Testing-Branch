/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvOtherEntity } from './entities/inv-other-entity.interface';
import { IControllingUnitGroupSetComplete, IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';

export class InvOtherComplete extends CompleteIdentification<IInvOtherEntity> implements IControllingUnitGroupSetComplete {
	/*
	 * InvOther
	 */
	public InvOther?: IInvOtherEntity | null;

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
