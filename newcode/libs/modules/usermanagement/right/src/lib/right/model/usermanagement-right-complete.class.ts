/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IDescriptorStructureEntity } from './entities/descriptor-structure-entity.interface';


/**
 * Usermanagement Right Complete Entity Class
 */
export class UsermanagementRightComplete implements CompleteIdentification<IDescriptorStructureEntity> {
	/**
	 * Main Itme Id
	 */
	public MainItemId: number = 0;

	/**
	 * Role
	 */
	public Role: IDescriptorStructureEntity[] | null = [];
}
