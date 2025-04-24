/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstCrewMixAfEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
export class BasicsEfbsheetsCrewMixAfComplete extends CompleteIdentification<IEstCrewMixAfEntity> {
	
	/*
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/*
	 * EstCrewMixAf
	 */
	public EstCrewMixAf: IEstCrewMixAfEntity[] | null = null;

	/*
	 * Id
	 */
	public Id: number = 0;
}
