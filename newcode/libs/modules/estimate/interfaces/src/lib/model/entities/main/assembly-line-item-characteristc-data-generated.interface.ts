/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IAssemblyLineItemCharacteristcDataGenerated {

/*
 * EstLineItems2EstRules
 */
  // EstLineItems2EstRules?: IEstLineItem2EstRuleEntity[] | null;

/*
 * EstLineItemsParams
 */
  // EstLineItemsParams?: IIEstimateRuleCommonParamEntity[] | null;

/*
 * EstPrjRules
 */
  // EstPrjRules?: IPrjEstRuleEntity[] | null;

/*
 * LineItem2CostGroups
 */
  // LineItem2CostGroups?: IMainItem2CostGroupEntity[] | null;

/*
 * LineItemsTotal
 */
  LineItemsTotal?: IEstLineItemEntity[] | null;

/*
 * UserDefinedcolsOfLineItemModified
 */
  // UserDefinedcolsOfLineItemModified?: IUserDefinedcolValEntity[] | null;

/*
 * UserDefinedcolsOfResourceModified
 */
  // UserDefinedcolsOfResourceModified?: IUserDefinedcolValEntity[] | null;

/*
 * copyBoqItem
 */
  //copyBoqItem?: IIBoqItemEntity | null;

/*
 * lineItemsNoNeedToUpdate
 */
  lineItemsNoNeedToUpdate?: IEstLineItemEntity[] | null;

/*
 * lineItemsUpdated
 */
  lineItemsUpdated?: IEstLineItemEntity[] | null;

/*
 * resourcesCharacteristics
 */
 // resourcesCharacteristics?: IICharacteristicDataEntity[] | null;
}
