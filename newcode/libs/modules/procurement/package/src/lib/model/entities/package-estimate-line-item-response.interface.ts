/*
 * Copyright(c) RIB Software GmbH
 */

import {IPackageEstimateLineItemEntity} from './package-estimate-line-item-entity.interface';
import {IEstLineItem2CostGroupEntity} from '@libs/estimate/interfaces';
import {BasicsCostGroupComplete} from '@libs/basics/shared';

export interface IPackageEstimateLineItemResponse {
	Main: IPackageEstimateLineItemEntity[];
	LineItem2CostGroups?: IEstLineItem2CostGroupEntity[] | null;
	CostGroupCats?: BasicsCostGroupComplete | null;
}
