/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectGroupEntity } from '@libs/project/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class ProjectGroupComplete implements CompleteIdentification<IProjectGroupEntity>{

 /*
  * MainItemId
  */
  public MainItemId: number = 0;

 /*
  * ProjectGroup
  */
  public ProjectGroup: IProjectGroupEntity | null = null;
}
