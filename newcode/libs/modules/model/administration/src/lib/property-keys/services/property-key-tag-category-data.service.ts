/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceHierarchicalNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IPropertyKeyTagCategoryComplete,
	IPropertyKeyTagCategoryEntity
} from '../model/entities/entities';
import {
	ModelAdministrationRootDataService,
	IModelAdministrationRootEntity,
	IModelAdministrationCompleteEntity
} from '../../root-info.model';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * The data service for the property key (attribute) tag category entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagCategoryDataService
	extends DataServiceHierarchicalNode<IPropertyKeyTagCategoryEntity, IPropertyKeyTagCategoryComplete, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/propkeytagcat',
			readInfo: {
				endPoint: 'list'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPropertyKeyTagCategoryEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'PropertyKeyTagCategories',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	public override parentOf(element: IPropertyKeyTagCategoryEntity): IPropertyKeyTagCategoryEntity | null {
		return element.PropertyKeyTagParentCategoryEntity ?? null;
	}

	public override childrenOf(element: IPropertyKeyTagCategoryEntity): IPropertyKeyTagCategoryEntity[] {
		return element.PropertyKeyTagChildCategoryEntities ?? [];
	}

	protected override onLoadSucceeded(loaded: object): IPropertyKeyTagCategoryEntity[] {
		const items = <IPropertyKeyTagCategoryEntity[]>loaded;

		const itemById: {
			[id: number]: IPropertyKeyTagCategoryEntity
		} = {};
		for (const item of items) {
			itemById[item.Id] = item;
			item.PropertyKeyTagChildCategoryEntities = [];
		}

		for (const item of items) {
			if (item.PropertyKeyTagParentCategoryFk) {
				const parent = itemById[item.PropertyKeyTagParentCategoryFk];

				if (parent) {
					item.PropertyKeyTagParentCategoryEntity = parent;
					parent.PropertyKeyTagChildCategoryEntities?.push(item);
				}
			}
		}

		return items.concat(this.createUntaggedParent());
	}

	private readonly translateSvc = inject(PlatformTranslateService);

	private createUntaggedParent(): IPropertyKeyTagCategoryEntity {
		const result: IPropertyKeyTagCategoryEntity = {
			Id: -100,
			DescriptionInfo: this.translateSvc.instantDesc({key: 'model.administration.propertyKeys.untagged'}),
			PropertyKeyTagChildCategoryEntities: []
		};

		this.entityRuntimeDataRegister.setEntityReadOnly(result, true);

		return result;
	}
}
