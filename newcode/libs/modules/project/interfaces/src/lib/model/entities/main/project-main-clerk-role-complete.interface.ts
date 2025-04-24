/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProjectRoleEntity } from './project-main-clerk-role-entity.interface';
import { IProjectClerkSiteEntity } from './project-main-clerk-site-entity.interface';

export interface IProjectClerkRoleComplete extends CompleteIdentification<IProjectRoleEntity>{

  /**
   * ClerkRoles
   */
  ClerkRoles?: IProjectRoleEntity | null;

  /**
   * ClerkSitesToDelete
   */
  ClerkSitesToDelete?: IProjectClerkSiteEntity[] | null;

  /**
   * ClerkSitesToSave
   */
  ClerkSitesToSave?: IProjectClerkSiteEntity[] | null;

  /**
   * EntitiesCount
   */
  EntitiesCount: number;

  /**
   * MainItemId
   */
  MainItemId: number;
}
