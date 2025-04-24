/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IGccAddExpenseItemEntity } from './entities/gcc-add-expense-item-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class GccAddExpenseComplete implements CompleteIdentification<IGccAddExpenseItemEntity>{

 /*
  * GccAddExpenseItemDtos
  */
  public GccAddExpenseItemDtos!: IGccAddExpenseItemEntity[] | null;

 /*
  * ProjectId
  */
  public ProjectId!: number | null;
}
