/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsClerkGroupEntity } from './basics-clerk-group-entity.interface';
import { IBasicsClerkMemberEntity } from './basics-clerk-member-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';

export interface IBasicsClerkGroupComplete extends CompleteIdentification<IBasicsClerkGroupEntity> {
	MainItemId: number;
	Groups: IBasicsClerkGroupEntity | null;
	MembersToSave: IBasicsClerkMemberEntity[] | null;
	MembersToDelete: IBasicsClerkMemberEntity[] | null;
}
