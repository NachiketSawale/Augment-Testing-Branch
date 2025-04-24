/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICrbPrdProductEntity } from './crb-prd-product-entity.interface';
import { ICrbBoqVariableEntity } from './crb-boq-variable-entity.interface';

export interface IBoqItemDocumentEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * CrbBoqVariableEntity
 */
  CrbBoqVariableEntity?: ICrbBoqVariableEntity | null;

/*
 * CrbBoqVariableFk
 */
  CrbBoqVariableFk?: number | null;

/*
 * CrbPrdProductEntity
 */
  CrbPrdProductEntity?: ICrbPrdProductEntity | null;

/*
 * CrbPrdProductFk
 */
  CrbPrdProductFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk: number;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk: number;

/*
 * Id
 */
  Id: number;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;
}
