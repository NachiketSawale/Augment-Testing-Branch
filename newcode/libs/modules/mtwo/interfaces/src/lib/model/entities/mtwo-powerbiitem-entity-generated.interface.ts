/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';
import { IMtwoPowerbiEntity } from './mtwo-powerbi-entity.interface';

export interface IMtwoPowerbiItemEntityGenerated extends IEntityBase {

  /**
   * AccessToken
   */
  AccessToken?: string | null;

  /**
   * AzureadIntegrated
   */
  AzureadIntegrated: boolean;

  /**
   * BasClerkFk
   */
  BasClerkFk?: number | null;

  /**
   * ChildItems
   */
  ChildItems?: IMtwoPowerbiItemEntity[] | null;

  /**
   * ClientId
   */
  ClientId: number;

  /**
   * Embedurl
   */
  Embedurl?: string | null;

  /**
   * Groupid
   */
  Groupid?: number | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Itemid
   */
  Itemid?: string | null;

  /**
   * Itemtype
   */
  Itemtype?: number | null;

  /**
   * MtoPowerbiEntity
   */
  MtoPowerbiEntity?: IMtwoPowerbiEntity | null;

  /**
   * MtoPowerbiFk
   */
  MtoPowerbiFk: number;

  /**
   * MtoPowerbiitemChildren
   */
  MtoPowerbiitemChildren?: IMtwoPowerbiItemEntity[] | null;

  /**
   * MtoPowerbiitemParent
   */
  MtoPowerbiitemParent?: IMtwoPowerbiItemEntity | null;

  /**
   * Name
   */
  Name?: string | null;

  /**
   * Permissions
   */
  Permissions?: string | null;

  /**
   * PowerBIAccount
   */
  PowerBIAccount?: string | null;

  /**
   * PowerBIClientId
   */
  PowerBIClientId?: string | null;

}
