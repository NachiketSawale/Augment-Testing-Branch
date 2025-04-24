/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification, ServiceLocator } from '@libs/platform/common';
import { ICharacteristicDataGroupServiceInitializeOptions } from '../model/interfaces/characteristic-data-entity-info-options.interface';
import { BasicsSharedCharacteristicPkeyHelperService } from './basics-shared-characteristic-pkey-helper.service';
import { get } from 'lodash';

/**
 * The basic data service for characteristic data group data entity
 */
export class BasicsSharedCharacteristicDataGroupDataService<T extends ICharacteristicGroupEntity,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceHierarchicalLeaf<T, PT, PU> {
	protected characteristicPkeyHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicPkeyHelperService<PT>);
	public constructor(private initOptions: ICharacteristicDataGroupServiceInitializeOptions<PT>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/characteristic/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treebydata',
				usePost:true,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'Group',
				parent: initOptions.parentService
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false
			}
		};
		super(options);
	}
	public override childrenOf(element: T): T[] {
		return element.Groups as T[] ?? [];
	}

	public override parentOf(element: T): T | null {
		if (element.CharacteristicGroupFk === undefined) {
			return null;
		}

		const parentId = element.CharacteristicGroupFk;
		const foundParent =  this.flatList().find(candidate => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return this.characteristicPkeyHelperService.prepareParameter(this.initOptions, this.getParentId());
		}
		throw new Error('There should be a selected parent record to load the characteristic group');
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as T[];
	}

	/**
	 * fresh characteristic group data
	 */
	public refreshGroup() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			this.load({ id: 0, pKey1: parentSelection.Id });
		}
	}

	private getParentId(): number | undefined {
		const parentItem = this.getSelectedParent();
		if (!parentItem) {
			throw new Error('There should be a selected parent record to load the characteristic group');
		}

		return this.initOptions.parentField
			? get(parentItem, this.initOptions.parentField) as number
			: parentItem.Id;
	}
}
