/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectInfoRequestEntity, IProjectInfoRequestRelevantToEntity, IProjectInfoRequestReferenceEntity } from '@libs/project/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class ProjectInfoRequestUpdate implements CompleteIdentification<IProjectInfoRequestEntity> {
	public InfoRequestID: number = 0;
	public Requests: IProjectInfoRequestEntity[] | null = [];
	public RelevantsToSave: IProjectInfoRequestRelevantToEntity[] | null = [];
	public RelevantsToDelete: IProjectInfoRequestRelevantToEntity[] | null = [];
	public ProjectInfoRequestReferencesToSave: IProjectInfoRequestReferenceEntity[] | null = [];
	public ProjectInfoRequestReferencesToDelete: IProjectInfoRequestReferenceEntity[] | null = [];
	// public ProjectInfoRequest2ExternalToSave: IProjectInfoRequest2ExternalEntity[] | null = []; //create=false
	// public ProjectInfoRequest2ExternalToDelete: IProjectInfoRequest2ExternalEntity[] | null = []; //delete=false
	// public ContributionsToSave: IPlantGroupAccountEntity[] | null = [];
	// public ContributionsToDelete: IPlantGroupAccountEntity[] | null = [];

}