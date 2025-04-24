/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceSkillChainEntity extends IEntityBase,IEntityIdentification{
	 SkillFK: number;
	 ChainedSkillFk: number;
}