/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBasicsClerkAbsenceComplete } from './basics-clerk-absence-complete.interface';
import { IBasicsClerkGroupComplete } from './basics-clerk-group-complete.interface';
import { IBasicsClerkEntity } from './basics-clerk-entity.interface';
import { IBasicsClerkDocumentEntity } from './basics-clerk-document-entity.interface';
import { IBasicsClerkRoleDefaultValueEntity } from './basics-clerk-role-default-value-entity.interface';
import { IBasicsClerkForProjectEntity } from './basics-clerk-for-project-entity.interface';
import { IBasicsClerkForPackageEntity } from './basics-clerk-for-package-entity.interface';
import { IBasicsClerkForEstimateEntity } from './basics-clerk-for-estimate-entity.interface';
import { IBasicsClerkForScheduleEntity } from './basics-clerk-for-schedule-entity.interface';
import { IBasicsClerkForWicEntity } from './basics-clerk-for-wic-entity.interface';
import { IBasicsClerkGroupEntity } from './basics-clerk-group-entity.interface';
import { IBasicsClerkAbsenceEntity } from './basics-clerk-absence-entity.interface';

export interface IBasicsClerkComplete extends CompleteIdentification<IBasicsClerkEntity> {
	EntitiesCount: number;

	MainItemId: number;

	Clerk: IBasicsClerkEntity | null;

	AbsencesToSave: IBasicsClerkAbsenceComplete[] | null;

	AbsencesToDelete: IBasicsClerkAbsenceEntity[] | null;

	GroupsToSave: IBasicsClerkGroupComplete[] | null;

	GroupsToDelete: IBasicsClerkGroupEntity[] | null;

	ClerksForPackageToSave: IBasicsClerkForPackageEntity[] | null ;

	ClerksForPackageToDelete: IBasicsClerkForPackageEntity[] | null ;

	ClerksForProjectToSave: IBasicsClerkForProjectEntity[] | null ;

	ClerksForProjectToDelete: IBasicsClerkForProjectEntity[] | null ;

	ClerksForScheduleToSave: IBasicsClerkForScheduleEntity[] | null ;

	ClerksForScheduleToDelete: IBasicsClerkForScheduleEntity[] | null ;

	ClerksForWicToSave: IBasicsClerkForWicEntity[] | null ;

	ClerksForWicToDelete: IBasicsClerkForWicEntity[] | null ;

	ClerksForEstimateToSave: IBasicsClerkForEstimateEntity[] | null ;

	ClerksForEstimateToDelete: IBasicsClerkForEstimateEntity[] | null ;

	ClerkRoleDefaultValuesToSave: IBasicsClerkRoleDefaultValueEntity[] | null ;

	ClerkRoleDefaultValuesToDelete: IBasicsClerkRoleDefaultValueEntity[] | null ;

	ClerkDocumentsToSave: IBasicsClerkDocumentEntity[] | null ;

	ClerkDocumentsToDelete: IBasicsClerkDocumentEntity[] | null ;

}
