/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IResReservationFormdataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormDataEntity
   */
  FormDataEntity?: IFormDataEntity | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * ResReservationEntity
   */
  ResReservationEntity?: IResReservationEntity | null;
}
