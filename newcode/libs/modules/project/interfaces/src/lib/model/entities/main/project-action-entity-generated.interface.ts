/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from './project-main-entity.interface';

export interface IProjectActionEntityGenerated {

/*
 * Action
 */
  Action?: number | null;

/*
 * AlternativeComment
 */
  AlternativeComment?: string | null;

/*
 * AlternativeDescription
 */
  AlternativeDescription?: string | null;

/*
 * CloseProject
 */
  CloseProject?: boolean | null;

/*
 * CopyIdentifier
 */
  CopyIdentifier?: string[] | null;

/*
 * CopyIdentifierFilteredById
 */
  //CopyIdentifierFilteredById?: IInt32[] | null;

/*
 * CopyIdentifierFilteredByIdString
 */
  CopyIdentifierFilteredByIdString?: string | null;

/*
 * NewProjectGroup
 */
  NewProjectGroup?: number | null;

/*
 * NewProjectNumber
 */
  NewProjectNumber?: string | null;

/*
 * Project
 */
  Project?: IProjectEntity | null;

/*
 * ProjectName
 */
  ProjectName?: string | null;

/*
 * ProjectName2
 */
  ProjectName2?: string | null;
}
