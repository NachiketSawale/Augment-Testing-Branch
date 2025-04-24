/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';

export interface IMtwoPowerbiEntityGenerated extends IEntityBase {

  /**
   * Accesslevel
   */
  Accesslevel: string;

  /**
   * Apiurl
   */
  Apiurl: string;

  /**
   * Authorized
   */
  Authorized?: boolean | null;

  /**
   * Authurl
   */
  Authurl: string;

  /**
   * AzureadAccessToken
   */
  AzureadAccessToken?: string | null;

  /**
   * AzureadIntegrated
   */
  AzureadIntegrated: boolean;

  /**
   * BasCompanyFk
   */
  BasCompanyFk?: number | null;

  /**
   * Clientid
   */
  Clientid: string;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Logonname
   */
  Logonname: string;

  /**
   * MtoPowerbiitemEntities
   */
  MtoPowerbiitemEntities?: IMtwoPowerbiItemEntity[] | null;

  /**
   * Password
   */
  Password?: string | null;

  /**
   * Resourceurl
   */
  Resourceurl: string;
}
