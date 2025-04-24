/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstMainRefBaseEntityGenerated {

/*
 * EstBaseItem
 */
  EstBaseItem?: IEstLineItemEntity | null;

/*
 * EstBaseItemUserDefinedColVal
 */
  // EstBaseItemUserDefinedColVal?: IUserDefinedcolValEntity | null;

/*
 * EstBaseResources
 */
  EstBaseResources?: IEstResourceEntity[] | null;

/*
 * EstLineItem2EstRule
 */
  // EstLineItem2EstRule?: IEstLineItem2EstRuleEntity[] | null;

/*
 * EstLineItemParam
 */
  // EstLineItemParam?: IEstLineItemParamEntity[] | null;

/*
 * ResourceUserDefinedColVal
 */
  // ResourceUserDefinedColVal?: IUserDefinedcolValEntity[] | null;

/*
 * RootEstBaseItem
 */
  RootEstBaseItem?: IEstLineItemEntity | null;

/*
 * RootEstBaseItemUserDefinedColVal
 */
  // RootEstBaseItemUserDefinedColVal?: IUserDefinedcolValEntity | null;
}
