/*
 * Copyright(c) RIB Software GmbH
 */

import { IAssetMasterEntity } from './asset-master-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IAssetMasterEntityGenerated extends IEntityBase {

  /**
   * AddressEntity
   */
  AddressEntity?: null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AllowAssignment
   */
  AllowAssignment: boolean;

  /**
   * AssetMasterChildren
   */
  AssetMasterChildren?: IAssetMasterEntity[] | null;

  /**
   * AssetMasterCount
   */
  AssetMasterCount: number;

  /**
   * AssetMasterLevel1Fk
   */
  AssetMasterLevel1Fk?: number | null;

  /**
   * AssetMasterLevel2Fk
   */
  AssetMasterLevel2Fk?: number | null;

  /**
   * AssetMasterLevel3Fk
   */
  AssetMasterLevel3Fk?: number | null;

  /**
   * AssetMasterLevel4Fk
   */
  AssetMasterLevel4Fk?: number | null;

  /**
   * AssetMasterLevel5Fk
   */
  AssetMasterLevel5Fk?: number | null;

  /**
   * AssetMasterParentFk
   */
  AssetMasterParentFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * DeliveryAddressDescription
   */
  DeliveryAddressDescription?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

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
   * MdcContextFk
   */
  MdcContextFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

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
}
