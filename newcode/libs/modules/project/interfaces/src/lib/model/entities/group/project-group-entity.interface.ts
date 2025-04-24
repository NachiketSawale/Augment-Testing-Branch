/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IProjectGroupEntity extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * CustomizeGroupFk
 */
  CustomizeGroupFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * ITwoBaselineServerFk
 */
  ITwoBaselineServerFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * InstanceAction
 */
  InstanceAction?: number | null;

/*
 * IsActive
 */
  IsActive?: boolean | null;

/*
 * IsAutoIntegration
 */
  IsAutoIntegration?: boolean | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsDefaultHasBeenChecked
 */
  IsDefaultHasBeenChecked?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * ProjectGroupChildren
 */
  ProjectGroupChildren?: IProjectGroupEntity[] | null;

/*
 * ProjectGroupFk
 */
  ProjectGroupFk?: number | null;

/*
 * ProjectGroupStatusFk
 */
  ProjectGroupStatusFk?: number | null;

/*
 * UncPath
 */
  UncPath?: string | null;
}
