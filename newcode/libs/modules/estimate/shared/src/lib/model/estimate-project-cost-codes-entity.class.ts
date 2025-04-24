/*
 * Copyright(c) RIB Software GmbH
 */

import {PrjCostCodesEntity} from '@libs/project/interfaces';
import {IDescriptionInfo} from '@libs/platform/common';

export class EstimateProjectCostCodesEntity extends PrjCostCodesEntity{
    public isMissingParentLevel?: boolean;
    public 	DescriptionInfo?: IDescriptionInfo | null;

}