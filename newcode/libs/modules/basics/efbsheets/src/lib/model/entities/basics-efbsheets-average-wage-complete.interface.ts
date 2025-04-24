/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsEfbsheetsAverageWageEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
export interface IBasicsEfbsheetsAverageWageComplete extends CompleteIdentification<IBasicsEfbsheetsAverageWageEntity> {
	Id: number | null
    EstAverageWage: IBasicsEfbsheetsAverageWageEntity[] | null;
}
