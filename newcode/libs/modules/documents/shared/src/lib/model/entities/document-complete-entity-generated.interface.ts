/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDocumentProjectEntity } from './document-project-entity.interface';
import { IDocument2mdlObjectEntity } from './document-2mdl-object-entity.interface';
import { IDocumentRevisionEntity } from './document-revision-entity.interface';

export interface IDocumentCompleteEntityGenerated {
//todo: clerk data

// /*
//  * ClerkDataToDelete
//  */
//   ClerkDataToDelete?: IClerkDataEntity[] | null;
//
// /*
//  * ClerkDataToSave
//  */
//   ClerkDataToSave?: IClerkDataEntity[] | null;

/*
 * Document
 */
  Document?: IDocumentProjectEntity[] | null;

/*
 * Document2mdlObjectToDelete
 */
  Document2mdlObjectToDelete?: IDocument2mdlObjectEntity[] | null;

/*
 * Document2mdlObjectToSave
 */
  Document2mdlObjectToSave?: IDocument2mdlObjectEntity[] | null;

/*
 * DocumentRevisionToDelte
 */
  DocumentRevisionToDelte?: IDocumentRevisionEntity[] | null;

/*
 * DocumentRevisionToSave
 */
  DocumentRevisionToSave?: IDocumentRevisionEntity[] | null;
}
