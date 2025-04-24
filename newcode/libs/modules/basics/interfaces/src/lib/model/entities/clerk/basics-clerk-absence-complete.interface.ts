/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBasicsClerkAbsenceProxyEntity } from './basics-clerk-absence-proxy-entity.interface';
import { IBasicsClerkAbsenceEntity } from './basics-clerk-absence-entity.interface';

export interface IBasicsClerkAbsenceComplete extends CompleteIdentification<IBasicsClerkAbsenceEntity> {
	MainItemId: number;

	Absences: IBasicsClerkAbsenceEntity | null;

	ClerkAbsenceProxiesToSave: IBasicsClerkAbsenceProxyEntity[] | null;

	ClerkAbsenceProxiesToDelete: IBasicsClerkAbsenceProxyEntity[] | null;
}
