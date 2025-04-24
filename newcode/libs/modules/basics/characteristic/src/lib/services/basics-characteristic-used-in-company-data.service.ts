/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, EntityArrayProcessor, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsCharacteristicGroupDataService } from './basics-characteristic-group-data.service';
import { BasicsCharacteristicGroupComplete } from '../model/basics-characteristic-group-complete.class';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '../model/entities/company-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicUsedInCompanyDataService extends DataServiceHierarchicalLeaf<ICompanyEntity, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete> {
	public constructor(private parentService: BasicsCharacteristicGroupDataService) {
		super({
			apiUrl: 'basics/characteristic/usedincompany',
			roleInfo: <IDataServiceChildRoleOptions<ICompanyEntity, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'UsedInCompany',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},
		});
		this.processor.addProcessor([
			new EntityArrayProcessor<ICompanyEntity>(['Companies']),
			/// todo basicsCompanyImageProcessor is not ready
		]);
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			let payload: object;
			const newGroup = parentEntity.Version === 0;
			if (newGroup && parentEntity.CharacteristicGroupFk !== null) {
				payload = {
					mainItemId: parentEntity.CharacteristicGroupFk,
				};
			} else {
				payload = {
					mainItemId: parentEntity.Id,
				};
			}
			return payload;
		} else {
			throw new Error('There should be a selected group to load the used in company data');
		}
	}

	protected override onLoadSucceeded(loaded: object): ICompanyEntity[] {
		if (loaded) {
			const entities = loaded as unknown as ICompanyEntity[];
			const parentEntity = this.getSelectedParent();
			if (parentEntity) {
				const newGroup = parentEntity.Version === 0;
				if (newGroup) {
					this.getList().forEach((item) => {
						if (item.Checked) {
							this.setModified(item);
						}
					});
				}
			}
			return entities;
		}
		return [];
	}

	public override childrenOf(element: ICompanyEntity): ICompanyEntity[] {
		return element.Companies ?? [];
	}

	public override parentOf(element: ICompanyEntity): ICompanyEntity | null {
		if (element.CompanyFk === undefined) {
			return null;
		}

		const parentId = element.CompanyFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
	public override isParentFn(parentKey: ICharacteristicGroupEntity, entity: ICompanyEntity): boolean {
		return true;
	}
	//todo: save modification to be added.
}
