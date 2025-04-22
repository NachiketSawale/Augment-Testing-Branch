/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IIdentificationData } from '@libs/platform/common';

export interface IModelAnnotationObjectLinkEntityGenerated extends IEntityBase {

/*
 * AnnotationFk
 */
  AnnotationFk: number;

/*
 * ContextModelId
 */
  ContextModelId?: number | null;

/*
 * ForeignParentId
 */
  ForeignParentId?: IIdentificationData | null;

/*
 * ForeignParentTypeId
 */
  ForeignParentTypeId?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsImportant
 */
  IsImportant: boolean;

/*
 * LegacyId
 */
  LegacyId?: IIdentificationData | null;

/*
 * LinkKind
 */
  LinkKind: 'Object' | 'ObjectSet';

/*
 * ModelFk
 */
  ModelFk?: number | null;

/*
 * ObjectFk
 */
  ObjectFk?: number | null;

/*
 * ObjectSetFk
 */
  ObjectSetFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * TemporaryId
 */
  TemporaryId?: string | null;
}
