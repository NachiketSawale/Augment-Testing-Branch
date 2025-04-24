/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrjCrewMix2CostCodeEntity } from './prj-crew-mix-2cost-code-entity.interface';
export interface IProjectEfbsheetsCrewMixCostCodeComplete extends CompleteIdentification<IPrjCrewMix2CostCodeEntity> {
	Id: number;

    PrjCrewMix2CostCode: IPrjCrewMix2CostCodeEntity[] | null;
}
