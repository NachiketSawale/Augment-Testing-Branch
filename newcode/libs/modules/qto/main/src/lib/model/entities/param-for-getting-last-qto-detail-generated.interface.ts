/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoMainDetailGridEntity } from '../qto-main-detail-grid-entity.class';

export interface IParamForGettingLastQtoDetailGenerated {

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqSplitQuantityFk
 */
  BoqSplitQuantityFk?: number | null;

/*
 * IsBillingBoq
 */
  IsBillingBoq?: boolean | null;

/*
 * IsDrag
 */
  IsDrag?: boolean | null;

/*
 * IsFromUserForm
 */
  IsFromUserForm?: boolean | null;

/*
 * IsInsert
 */
  IsInsert?: boolean | null;

/*
 * IsNotCpoyCostGrp
 */
  IsNotCpoyCostGrp?: boolean | null;

/*
 * IsPesBoq
 */
  IsPesBoq?: boolean | null;

/*
 * IsPrcBoq
 */
  IsPrcBoq?: boolean | null;

/*
 * IsPrjBoq
 */
  IsPrjBoq?: boolean | null;

/*
 * IsQtoBoq
 */
  IsQtoBoq?: boolean | null;

/*
 * IsSearchCopy
 */
  IsSearchCopy?: boolean | null;

/*
 * IsWipBoq
 */
  IsWipBoq?: boolean | null;

/*
 * MultiLines
 */
  MultiLines?: IQtoMainDetailGridEntity[] | null;

/*
 * QtoDetailStatusFk
 */
  QtoDetailStatusFk?: number | null;

/*
 * QtoHeaderFk
 */
  QtoHeaderFk?: number | null;

/*
 * QtoSheetFk
 */
  QtoSheetFk?: number | null;

/*
 * QtoTypeFk
 */
  QtoTypeFk?: number | null;

/*
 * SelectItem
 */
  SelectItem?: IQtoMainDetailGridEntity | null;

/*
 * SelectedPageNumber
 */
  SelectedPageNumber?: string | null;

/*
 * items
 */
  items?: IQtoMainDetailGridEntity[] | null;
}
