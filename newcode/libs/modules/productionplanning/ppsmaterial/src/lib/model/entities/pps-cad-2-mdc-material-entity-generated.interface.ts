/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';
import { IEntityBase } from '@libs/platform/common';

export interface IPpsCad2mdcMaterialEntityGenerated extends IEntityBase {

  /**
   * CadAddSpecifier
   */
  CadAddSpecifier?: string | null;

  /**
   * CadProducttype
   */
  CadProducttype?: string | null;

  /**
   * CommentTxt
   */
  CommentTxt?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialEntity
   */
  MaterialEntity?: IMaterialEntity | null;

  /**
   * MdcContextFk
   */
  MdcContextFk: number;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;
}
