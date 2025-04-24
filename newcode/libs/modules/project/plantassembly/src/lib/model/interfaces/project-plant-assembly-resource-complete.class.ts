/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class ProjectPlantAssemblyResourceComplete extends CompleteIdentification<IEstResourceEntity>{
	/**
	 * Main item ID.
	 */
	public MainItemId?: number;

	public PrjPlantAssemblyResource?: IEstResourceEntity;

	/**
	 * Initializes the object with a ResourceBaseEntity.
	 *
	 * @param entity ResourceBaseEntity to initialize from, or null.
	 */
	public constructor(entity: IEstResourceEntity | null) {
		super();
		if (entity && entity.Id) {
			this.MainItemId = entity.Id;
			this.PrjPlantAssemblyResource = entity;
		}
	}
}