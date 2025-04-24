/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccount2MdcContrCostEntity } from './entities/account-2mdc-contr-cost-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class Account2MdcContrCostComplete implements CompleteIdentification<IAccount2MdcContrCostEntity>{

 /*
  * Account2MdcContrCost
  */
  public Account2MdcContrCost!: IAccount2MdcContrCostEntity | null;

 /*
  * EntitiesCount
  */
  public EntitiesCount!: number | null;

 /*
  * MainItemId
  */
  public MainItemId!: number | null;
}
