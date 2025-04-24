/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcStructureLookupEntity } from './prc-structure-lookup-entity.interface';

export interface IPrcStructureLookupEntityGenerated {

  /**
   * AllowAssignment
   */
  AllowAssignment: boolean;

  /**
   * ChildCount
   */
  ChildCount: number;

  /**
   * ChildItems
   */
  ChildItems?: IPrcStructureLookupEntity[] | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsExistent
   */
  IsExistent: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsSelected
   */
  IsSelected?: boolean | null;

  /**
   * MdcContextFk
   */
  MdcContextFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PrcStructureTypeFk
   */
  PrcStructureTypeFk: number;
}
