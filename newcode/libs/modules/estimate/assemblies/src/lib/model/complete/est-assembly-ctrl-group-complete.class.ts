/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IEstLineitem2CtrlGrpEntity } from '../entities/est-lineitem-2ctrl-grp-entity.interface';

/*
 * EstAssemblyCtrlGroupComplete
 */
export class EstAssemblyCtrlGroupComplete extends CompleteIdentification<IEstLineitem2CtrlGrpEntity> {
	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;
	/*
	 * EstAssembliesCtrlGrp
	 */

	public EstAssembliesCtrlGrp!: IEstLineitem2CtrlGrpEntity[] | null;

	/*
	 * Id
	 */
	public Id!: number | null;

	/*
	 * EntitiesCount
	 */
	public EntitiesCount!: number | null;
}
