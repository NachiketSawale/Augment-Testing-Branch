/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {
	IPropertyKeyTagCategoryEntity,
	IPropertyKeyTagEntity
} from './entities';

/**
 * Represents a property key (attribute) tag category with attached data.
 */
export interface IPropertyKeyTagCategoryComplete extends CompleteIdentification<IPropertyKeyTagCategoryEntity>{

 /*
  * The ID of the property key tag category.
  */
  MainItemId?: number | null;

 /*
  * The property key tag category.
  */
  PropertyKeyTagCategories?: IPropertyKeyTagCategoryEntity | null;

 /*
  * Property key tags to delete.
  */
  PropertyKeyTagsToDelete?: IPropertyKeyTagEntity[] | null;

 /*
  * Property key tags to save.
  */
  PropertyKeyTagsToSave?: IPropertyKeyTagEntity[] | null;
}
