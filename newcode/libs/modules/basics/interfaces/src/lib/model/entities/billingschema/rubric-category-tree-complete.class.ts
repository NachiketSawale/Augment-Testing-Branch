/*
 * Copyright(c) RIB Software GmbH
 */

import { IBillingSchemaDetailEntity } from './billing-schema-detail-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';
import { IRubricCategoryTreeItemEntity } from './rubric-category-tree-item-entity.interface';

export class RubricCategoryTreeComplete implements CompleteIdentification<IRubricCategoryTreeItemEntity>{

  /**
   * BillingSchemaDetailToDelete
   */
  public BillingSchemaDetailToDelete?: IBillingSchemaDetailEntity[] | null = [];

  /**
   * BillingSchemaDetailToSave
   */
  public BillingSchemaDetailToSave?: IBillingSchemaDetailEntity[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
