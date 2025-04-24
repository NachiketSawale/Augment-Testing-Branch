/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IProjectGroupLookupEntity {

	/*
	 * Id
	 */
	Id: number;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * ProjectGroupFk
	 */
	ProjectGroupFk?: number | null;

	/*
	 * ProjectGroupStatusFk
	 */
	ProjectGroupStatusFk: number;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo: IDescriptionInfo;

	/*
	 * UncPath
	 */
	UncPath?: string | null;

	/*
	 * ITwoBaselineServerFk
	 */
	ITwoBaselineServerFk?: number | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * IsActive
	 */
	IsActive: boolean;

	/*
	 * IsLive
	 */
	IsLive: boolean;

	/*
	 * CustomizeGroupFk
	 */
	CustomizeGroupFk?: number | null;
}