/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDocumentProjectEntity } from './document-project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDocument2mdlObjectEntityGenerated extends IEntityBase {

/*
 * DocumentEntity
 */
  DocumentEntity?: IDocumentProjectEntity | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdlModelFk
 */
  MdlModelFk?: number | null;

/*
 * MdlObjectFk
 */
  MdlObjectFk?: number | null;

/*
 * PrjDocumentFk
 */
  PrjDocumentFk?: number | null;
}
