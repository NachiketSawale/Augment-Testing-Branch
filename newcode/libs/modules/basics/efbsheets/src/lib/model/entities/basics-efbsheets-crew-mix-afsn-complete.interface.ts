/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';


export interface IBasicsEfbsheetsCrewMixAfsnComplete extends CompleteIdentification<IEstCrewMixAfsnEntity> {
	/*
	 * MainItemId
	 */
	MainItemId: number;

	/*
	 * EstCrewMixAfsn
	 */
	EstCrewMixAfsn: IEstCrewMixAfsnEntity[] | null;

	/*
	 * Id
	 */
	Id: number;
}
