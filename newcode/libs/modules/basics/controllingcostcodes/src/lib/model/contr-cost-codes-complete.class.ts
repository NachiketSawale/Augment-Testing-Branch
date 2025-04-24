/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccount2MdcContrCostEntity } from './entities/account-2mdc-contr-cost-entity.interface';
import { Account2MdcContrCostComplete } from './account-2mdc-contr-cost-complete.class';
import { IContrCostCodeEntity } from './entities/contr-cost-code-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class ContrCostCodesComplete implements CompleteIdentification<IContrCostCodeEntity>{

 /*
  * Account2MdcContrCostToDelete
  */
  public Account2MdcContrCostToDelete!: IAccount2MdcContrCostEntity[] | null;

 /*
  * Account2MdcContrCostToSave
  */
  public Account2MdcContrCostToSave!: Account2MdcContrCostComplete[] | null;

 /*
  * Account2MdcContrCosts
  */
  public Account2MdcContrCosts!: IAccount2MdcContrCostEntity[] | null;

 /*
  * ContrCostCodes
  */
  public ContrCostCodes!: IContrCostCodeEntity[] | null;

 /*
  * EntitiesCount
  */
  public EntitiesCount!: number | null;

 /*
  * MainItemId
  */
  public MainItemId!: number | null;
}
