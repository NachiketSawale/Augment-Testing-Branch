/*
 * Copyright(c) RIB Software GmbH
 */

import { IAddressEntity } from '@libs/ui/map';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IRegionEntityGenerated extends IEntityBase {

  /**
   * AddressDto
   */
  AddressDto?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * Description
   */
  Description?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsActive
   */
  IsActive: boolean;

  /**
   * SubsidiaryEntity
   */
  SubsidiaryEntity?: ISubsidiaryEntity | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk: number;
}
