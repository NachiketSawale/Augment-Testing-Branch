/*
 * Copyright(c) RIB Software GmbH
 */

import { ISortcodes } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IScriptCommonLookupEntity } from '@libs/constructionsystem/shared';
import { IConstructionSystemCommonScriptErrorEntity } from '@libs/constructionsystem/common';

export interface IScriptResponseEntityGenerated {

  /**
   * DoConsiderDisabledDirect
   */
  DoConsiderDisabledDirect: boolean;

  /**
   * ErrorList
   */
  ErrorList?: IConstructionSystemCommonScriptErrorEntity[] | null;

  /**
   * LineItems
   */
  LineItems?: IEstLineItemEntity[] | null;

  /**
   * LookupActivities
   */
  LookupActivities?: IScriptCommonLookupEntity[] | null;

  /**
   * LookupAssemblies
   */
  LookupAssemblies?: IScriptCommonLookupEntity[] | null;

  /**
   * LookupBoqItems
   */
  LookupBoqItems?: IScriptCommonLookupEntity[] | null;

  /**
   * LookupControllingUnits
   */
  LookupControllingUnits?: IScriptCommonLookupEntity[] | null;

  /**
   * LookupLineItems
   */
  LookupLineItems?: IScriptCommonLookupEntity[] | null;

  /**
   * LookupSchedules
   */
  LookupSchedules?: IScriptCommonLookupEntity[] | null;

  /**
   * ProjectSortCode01s
   */
  ProjectSortCode01s?: ISortcodes[] | null;

  /**
   * ProjectSortCode02s
   */
  ProjectSortCode02s?: ISortcodes[] | null;

  /**
   * ProjectSortCode03s
   */
  ProjectSortCode03s?: ISortcodes[] | null;

  /**
   * ProjectSortCode04s
   */
  ProjectSortCode04s?: ISortcodes[] | null;

  /**
   * ProjectSortCode05s
   */
  ProjectSortCode05s?: ISortcodes[] | null;

  /**
   * ProjectSortCode06s
   */
  ProjectSortCode06s?: ISortcodes[] | null;

  /**
   * ProjectSortCode07s
   */
  ProjectSortCode07s?: ISortcodes[] | null;

  /**
   * ProjectSortCode08s
   */
  ProjectSortCode08s?: ISortcodes[] | null;

  /**
   * ProjectSortCode09s
   */
  ProjectSortCode09s?: ISortcodes[] | null;

  /**
   * ProjectSortCode10s
   */
  ProjectSortCode10s?: ISortcodes[] | null;
}
