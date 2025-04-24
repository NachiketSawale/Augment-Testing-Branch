/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICostGroupCatEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * LineItemContextFk
   */
  LineItemContextFk?: number | null;

  /**
   * PRJCostGrpCatAssignId
   */
  PRJCostGrpCatAssignId: number;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;
}
