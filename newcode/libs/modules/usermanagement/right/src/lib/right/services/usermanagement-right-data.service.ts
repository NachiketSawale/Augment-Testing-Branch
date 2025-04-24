/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, DataServiceHierarchicalLeaf } from '@libs/platform/data-access';
import { IAccessRoleEntity } from '../../roles/model/entities/access-role-entity.interface';
import { UsermanagementRoleComplete } from '../../roles/model/usermanagement-role-complete.class';
import { UsermanagementRoleDataService } from '../../roles/services/usermanagement-role-data.service';

import { IDescriptorStructureEntity } from '../model/entities/descriptor-structure-entity.interface';


/**
 * Usermanagement Right Entity DataService
 */
@Injectable({
	providedIn: 'root',
})

export class UsermanagementRightDataService extends DataServiceHierarchicalLeaf<IDescriptorStructureEntity, IAccessRoleEntity, UsermanagementRoleComplete> {
	
	public constructor(usermanagementRoleDataService: UsermanagementRoleDataService) {
		const options: IDataServiceOptions<IDescriptorStructureEntity> = {
			apiUrl: 'usermanagement/main/right',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
				prepareParam(ident) {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IDescriptorStructureEntity, IAccessRoleEntity, UsermanagementRoleComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DescriptorStructurePresenter',
				parent: usermanagementRoleDataService,
			},
		};

		super(options);
		this.processor.addProcessor({
			process: (descriptorStructureRight) => {
				const parent = this.flatList().find((wg) => wg.Id === descriptorStructureRight.Id);
				descriptorStructureRight.DescriptorStructureRightParent = parent === undefined ? null : parent;
				if (descriptorStructureRight.Nodes === null) {
					descriptorStructureRight.Nodes = [];
				}
			},
			revertProcess() {},
		});
	}
	/**
	 * This function return the child node item array
	 * 
	 * @param {IDescriptorStructureEntity} descriptorStructureRight 
	 * @returns {IDescriptorStructureEntity[]}
	 */
	public override childrenOf(descriptorStructureRight: IDescriptorStructureEntity): IDescriptorStructureEntity[] {
		return descriptorStructureRight.Nodes ?? [];
	}

	/**
	 * This function return the parent item details 
	 * 
	 * @param {IDescriptorStructureEntity} descriptorStructureRight 
	 * @returns {IDescriptorStructureEntity | null}
	 */
	public override parentOf(descriptorStructureRight: IDescriptorStructureEntity): IDescriptorStructureEntity | null {
		return descriptorStructureRight.DescriptorStructureRightParent ?? null;
	}
}
