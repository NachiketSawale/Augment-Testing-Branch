/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IControllingUnitApiEntityGenerated {

/*
 * AccountAssignElement
 */
  AccountAssignElement?: boolean | null;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * IsBillingElement
 */
  IsBillingElement?: boolean | null;

/*
 * IsPlanningElement
 */
  IsPlanningElement?: boolean | null;

/*
 * ParentCode
 */
  ParentCode?: string | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * UoM
 */
  UoM?: string | null;
}
