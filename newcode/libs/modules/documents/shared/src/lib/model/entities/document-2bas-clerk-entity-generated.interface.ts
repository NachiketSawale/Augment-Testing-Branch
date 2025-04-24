/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDocumentProjectEntity } from './document-project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDocument2BasClerkEntityGenerated extends IEntityBase {

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * ClerkRoleFk
 */
  ClerkRoleFk?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DocumentEntity
 */
  DocumentEntity?: IDocumentProjectEntity | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PrjDocumentFk
 */
  PrjDocumentFk?: number | null;

/*
 * Validfrom
 */
  Validfrom?: string | null;

/*
 * Validto
 */
  Validto?: string | null;
}
