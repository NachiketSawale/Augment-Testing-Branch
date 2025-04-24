/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
export interface IProjectEfbsheetsCrewMixAfsnComplete extends CompleteIdentification<IEstCrewMixAfsnEntity> {
	Id: number;

    EstCrewMixAfsn: IEstCrewMixAfsnEntity[] | null;
}
