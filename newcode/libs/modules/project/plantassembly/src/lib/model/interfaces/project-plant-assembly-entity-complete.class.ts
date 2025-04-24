/*
 * Copyright(c) RIB Software GmbH
 */
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { ProjectPlantAssemblyResourceComplete } from './project-plant-assembly-resource-complete.class';
import { CompleteIdentification } from '@libs/platform/common';

export class ProjectPlantAssemblyEntityComplete extends CompleteIdentification<IEstLineItemEntity>{
	/**
	 * Main item ID.
	 */
	public MainItemId?: number;

	/**
	 * project assembly entity
	 */
	public PrjPlantAssembly?: IEstLineItemEntity;

	/**
	 * project assembly resources to save
	 */
	public PrjPlantAssemblyResourceToSave?: ProjectPlantAssemblyResourceComplete[];

	/**
	 * project assembly resources to delete
	 */
	public PrjPlantAssemblyResourceToDelete?: IEstResourceEntity[];

	public constructor(entity: IEstLineItemEntity | null) {
		super();
		if (entity && entity.Id) {
			this.MainItemId = entity.Id;
			this.PrjPlantAssembly = entity;
		}
	}
}