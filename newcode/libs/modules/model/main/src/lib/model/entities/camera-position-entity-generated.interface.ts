/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IPoint3dEntity } from './point-3d-entity.interface';

export interface ICameraPositionEntityGenerated {

/*
 * id
 */
  id?: number | null;

/*
 * important
 */
  important?: boolean | null;

/*
 * name
 */
  name?: IDescriptionInfo | null;

/*
 * pos
 */
  pos?: IPoint3dEntity | null;

/*
 * scopeLevel
 */
  scopeLevel?: 'User' | 'Role' | 'Global' | null;

/*
 * trg
 */
  trg?: IPoint3dEntity | null;
}
