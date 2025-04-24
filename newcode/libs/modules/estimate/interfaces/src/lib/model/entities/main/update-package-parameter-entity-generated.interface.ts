/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IUpdatePackageParameterEntityGenerated {

/*
 * AggregateProfileFlg
 */
  AggregateProfileFlg?: boolean | null;

/*
 * SameItemMergeFlg
 */
  SameItemMergeFlg?: boolean | null;

/*
 * UniqueFieldsProfile
 */
  //UniqueFieldsProfile?: IUniqueFieldEntity[] | null;

/*
 * estHeaderFk
 */
  estHeaderFk?: number | null;

/*
 * filterRequest
 */
 // filterRequest?: IInt32 | null;

/*
 * lineItemIds
 */
  lineItemIds?: number[] | null;

/*
 * packageIds
 */
  packageIds?: number[] | null;

/*
 * prjProjectFk
 */
  prjProjectFk?: number | null;

/*
 * resultSet
 */
  resultSet?: number | null;

/*
 * updateBudgetForExistedAssignmentFlg
 */
  updateBudgetForExistedAssignmentFlg?: boolean | null;
}
