/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICrbPriceconditionScopeEntity } from './entities/crb-pricecondition-scope-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { ICrbPriceconditionEntity } from './entities/crb-pricecondition-entity.interface';

export class CrbPriceconditionComplete implements CompleteIdentification<ICrbPriceconditionEntity>{

 /*
  * CrbPricecondition
  */
  public CrbPricecondition?: ICrbPriceconditionEntity | null;

 /*
  * CrbPriceconditionScopeToDelete
  */
  public CrbPriceconditionScopeToDelete?: ICrbPriceconditionScopeEntity[] | null = [];

 /*
  * CrbPriceconditionScopeToSave
  */
  public CrbPriceconditionScopeToSave?: ICrbPriceconditionScopeEntity[] | null = [];

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
