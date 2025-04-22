/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IViewpointEntityGenerated extends IEntityBase {

/*
 * AccessRoleFk
 */
  AccessRoleFk?: number | null;

/*
 * Camera
 */

// commented 16-12-2024: Annotation camera not migrated
  // Camera?: IIAnnotationCameraEntity | null;

/*
 * Code
 */
  Code: string;

/*
 * Description
 */
  Description?: string | null;

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
  LegacyId?: number | null;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * Scope
 */
  Scope?: 'User' | 'Role' | 'Global' | null;

/*
 * UserFk
 */
  UserFk?: number | null;

/*
 * ViewpointTypeFk
 */
  ViewpointTypeFk: number;
}
