/*
 * Copyright(c) RIB Software GmbH
 */

import { IBillingSchemaEntity } from './billing-schema-entity.interface';
import { RubricCategoryTreeComplete } from './rubric-category-tree-complete.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BillingSchemaComplete implements CompleteIdentification<IBillingSchemaEntity>{

  /**
   * BillingSchema
   */
  public BillingSchema?: IBillingSchemaEntity | null;

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * RubricCategoryTreeItemToSave
   */
  public RubricCategoryTreeItemToSave?: RubricCategoryTreeComplete[] | null = [];
}
