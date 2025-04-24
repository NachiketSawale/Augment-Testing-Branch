/*
 * Copyright(c) RIB Software GmbH
 */

/* tslint:disable */
import { CostGroupCompleteEntity/*, IBasicMainItem2CostGroup*/ } from '@libs/basics/shared';

// remark: IPpsCostGroupInfoEntity is similar to returned result of method GetCostGroupInfo of class CostGroupHelper in RIB.Visual.ProductionPlanning.Common.ServiceFacade.WebApi
export interface IPpsCostGroupInfoEntity {
	// MainItemId: number;
	// Object2CostGroups: IBasicMainItem2CostGroup[]; // may be Engineering2CostGroups/Drawing2CostGroups
	CostGroupCats: CostGroupCompleteEntity;
}


