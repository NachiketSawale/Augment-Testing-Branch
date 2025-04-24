/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IMntRequisitionEntity } from './mnt-requisition-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMntRequisitionFormdataEntityGenerated extends IEntityBase {

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
   * MntRequisitionEntity
   */
  MntRequisitionEntity?: IMntRequisitionEntity | null;
}
