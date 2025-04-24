/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';


export interface IKeyFigureEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * KeyFigureFk
 */
  KeyFigureFk: number;

/*
 * KeyFigureValue
 */
  KeyFigureValue: number;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;
}
