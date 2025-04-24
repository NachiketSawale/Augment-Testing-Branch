/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IDescriptionInfo, IEntityBase } from '@libs/platform/common';


export interface IResourceSkillEntity extends IEntityBase,IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	SkillTypeFk: number;
	SkillGroupFk: number;
	UserDefinedText01?: string;
	UserDefinedText02?: string;
	UserDefinedText03?: string;
	UserDefinedText04?: string;
	UserDefinedText05?: string;
	Remark: string;
	IsLive: boolean;
	IsMandatory: boolean;
	Sorting: number;
	IsDefault: boolean;
	TypeFk?: number;
}