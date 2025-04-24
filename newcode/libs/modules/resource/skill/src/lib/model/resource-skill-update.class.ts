/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { IResourceSkillChainEntity } from '@libs/resource/interfaces';

export class ResourceSkillUpdate implements CompleteIdentification<IResourceSkillEntity> {
	public MainItemId: number = 0;
	public ResourceSkills: IResourceSkillEntity[] | null = [];
	public ResourceSkillChainsToSave: IResourceSkillChainEntity[] | null = [];
	public ResourceSkillChainsToDelete: IResourceSkillChainEntity[] | null = [];
}