/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvRejectEntity } from './entities/inv-reject-entity.interface';
import { IControllingUnitGroupSetComplete, IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';

export class InvRejectComplete extends CompleteIdentification<IInvRejectEntity> implements IControllingUnitGroupSetComplete {
	/*
	 * InvReject
	 */
	public InvReject?: IInvRejectEntity | null;

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
