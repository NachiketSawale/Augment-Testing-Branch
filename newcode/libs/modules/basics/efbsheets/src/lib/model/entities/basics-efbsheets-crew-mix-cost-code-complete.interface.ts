/*
 * Copyright(c) RIB Software GmbH
 */


import { IBasicsEfbsheetsCrewMixCostCodeEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
export interface IBasicsEfbsheetsCrewMixCostCodeComplete extends CompleteIdentification<IBasicsEfbsheetsCrewMixCostCodeEntity> {
	Id: number | null;
    EstCrewMix2CostCode: IBasicsEfbsheetsCrewMixCostCodeEntity[] | null;
}
