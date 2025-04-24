/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterProvidedResourceSkillEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 SkillFk: number;
	 ValidTo?: Date | null;
	 CommentText?: string | null;
	 RefreshDate?: Date | null;
	 UserDefinedText01?: string | null;
	 UserDefinedText02?: string | null;
	 UserDefinedText03?: string | null;
	 UserDefinedText04?: string | null;
	 UserDefinedText05?: string | null;
	 UserDefinedNumber01?: number | null;
	 UserDefinedNumber02?: number | null;
	 UserDefinedNumber03?: number | null;
	 UserDefinedNumber04?: number | null;
	 UserDefinedNumber05?: number | null;
	 UserDefinedDate01?: Date | null;
	 UserDefinedDate02?: Date | null;
	 UserDefinedDate03?: Date | null;
	 UserDefinedDate04?: Date | null;
	 UserDefinedDate05?: Date | null;
}