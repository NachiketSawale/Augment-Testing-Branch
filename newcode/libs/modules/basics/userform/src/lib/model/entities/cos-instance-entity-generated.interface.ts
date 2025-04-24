/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInstanceEntity } from './cos-instance-entity.interface';
import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosInstanceEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * CosInsHeaderFk
   */
  CosInsHeaderFk: number;

  /**
   * CosInsHeaderOldFk
   */
  CosInsHeaderOldFk?: number | null;

  /**
   * CosInstanceEntities_CosInsHeaderOldFk_CosInstanceOldFk
   */
  CosInstanceEntities_CosInsHeaderOldFk_CosInstanceOldFk?: ICosInstanceEntity[] | null;

  /**
   * CosInstanceEntity_CosInsHeaderOldFk_CosInstanceOldFk
   */
  CosInstanceEntity_CosInsHeaderOldFk_CosInstanceOldFk?: ICosInstanceEntity | null;

  /**
   * CosInstanceOldFk
   */
  CosInstanceOldFk?: number | null;

  /**
   * CosTemplateFk
   */
  CosTemplateFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * EstLineItemEntities
   */
  EstLineItemEntities?: IEstLineItemEntity[] | null;

  /**
   * FormDataEntity
   */
  FormDataEntity?: IFormDataEntity | null;

  /**
   * FormdataFk
   */
  FormdataFk?: number | null;

  /**
   * HeaderFk
   */
  HeaderFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsUserModified
   */
  IsUserModified?: boolean | null;

  /**
   * Ischecked
   */
  Ischecked: boolean;

  /**
   * ItemFk
   */
  ItemFk?: number | null;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * Sortcode01Fk
   */
  Sortcode01Fk?: number | null;

  /**
   * Sortcode02Fk
   */
  Sortcode02Fk?: number | null;

  /**
   * Sortcode03Fk
   */
  Sortcode03Fk?: number | null;

  /**
   * Sortcode04Fk
   */
  Sortcode04Fk?: number | null;

  /**
   * Sortcode05Fk
   */
  Sortcode05Fk?: number | null;

  /**
   * Sortcode06Fk
   */
  Sortcode06Fk?: number | null;

  /**
   * Sortcode07Fk
   */
  Sortcode07Fk?: number | null;

  /**
   * Sortcode08Fk
   */
  Sortcode08Fk?: number | null;

  /**
   * Sortcode09Fk
   */
  Sortcode09Fk?: number | null;

  /**
   * Sortcode10Fk
   */
  Sortcode10Fk?: number | null;

  /**
   * Status
   */
  Status: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
