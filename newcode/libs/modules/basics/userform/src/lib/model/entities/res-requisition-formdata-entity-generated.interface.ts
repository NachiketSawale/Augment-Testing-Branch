/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IResRequisitionFormdataEntityGenerated extends IEntityBase {

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
   * ResRequisitionEntity
   */
  ResRequisitionEntity?: IResRequisitionEntity | null;
}
