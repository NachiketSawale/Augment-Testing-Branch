/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceMasterResource2etmPlantEntity } from '@libs/resource/interfaces';

export class ResourceMasterResource2etmPlantUpdate implements CompleteIdentification<IResourceMasterResource2etmPlantEntity> {
	public MainItemId: number = 0;
	public Resource2etmPlants: IResourceMasterResource2etmPlantEntity[] | null = [];
}