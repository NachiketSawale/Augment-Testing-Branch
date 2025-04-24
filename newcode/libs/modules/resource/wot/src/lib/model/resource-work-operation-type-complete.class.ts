/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceWorkOperationTypeEntity, IResourceOperationPlantTypeEntity } from '@libs/resource/interfaces';


export class ResourceWorkOperationTypeComplete implements CompleteIdentification<IResourceWorkOperationTypeEntity> {
	public WorkOperationTypeId: number = 0;
	public WorkOperationTypes: IResourceWorkOperationTypeEntity[] | null = [];

	public Operation2PlantTypesToSave: IResourceOperationPlantTypeEntity[] | null = [];
	public Operation2PlantTypesToDelete: IResourceOperationPlantTypeEntity[] | null = [];
}