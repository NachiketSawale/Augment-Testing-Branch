/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsItemFormdataEntity } from './pps-item-formdata-entity.interface';
import { IPpsUpstreamItemEntity } from './pps-upstream-item-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPpsItemEntityGenerated extends IEntityBase {

  /**
   * ClerkTecFk
   */
  ClerkTecFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EngDrawingDefFk
   */
  EngDrawingDefFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLeaf
   */
  IsLeaf: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcMaterialGroupFk
   */
  MdcMaterialGroupFk: number;

  /**
   * PpsHeaderFk
   */
  PpsHeaderFk: number;

  /**
   * PpsItemFk
   */
  PpsItemFk?: number | null;

  /**
   * PpsItemFormdataEntities
   */
  PpsItemFormdataEntities?: IPpsItemFormdataEntity[] | null;

  /**
   * PpsItemOriginFk
   */
  PpsItemOriginFk?: number | null;

  /**
   * PpsItemStatusFk
   */
  PpsItemStatusFk: number;

  /**
   * PpsItemTypeFk
   */
  PpsItemTypeFk: number;

  /**
   * PpsProductdescriptionFk
   */
  PpsProductdescriptionFk?: number | null;

  /**
   * PpsReprodReasonFk
   */
  PpsReprodReasonFk?: number | null;

  /**
   * PpsUpstreamItemEntities_PpsUpstreamItemFk
   */
  PpsUpstreamItemEntities_PpsUpstreamItemFk?: IPpsUpstreamItemEntity[] | null;

  /**
   * ProductionOrder
   */
  ProductionOrder?: string | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Reference
   */
  Reference: string;

  /**
   * SiteFk
   */
  SiteFk: number;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * UserDefinedIcon
   */
  UserDefinedIcon?: number | null;

  /**
   * Userflag1
   */
  Userflag1: boolean;

  /**
   * Userflag2
   */
  Userflag2: boolean;
}
