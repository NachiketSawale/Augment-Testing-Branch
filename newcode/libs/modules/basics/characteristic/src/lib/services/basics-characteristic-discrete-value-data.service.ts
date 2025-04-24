/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsCharacteristicCharacteristicDataService } from './basics-characteristic-characteristic-data.service';
import { BasicsCharacteristicType, ICharacteristicValueEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicComplete } from '../model/basics-characteristic-complete.class';

/**
 * The characteristic discrete value data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicDiscreteValueDataService extends DataServiceFlatLeaf<ICharacteristicValueEntity, ICharacteristicEntity, BasicsCharacteristicComplete> {
	public constructor(private parentService: BasicsCharacteristicCharacteristicDataService) {
		super({
			apiUrl: 'basics/characteristic/discretevalue',
			roleInfo: <IDataServiceChildRoleOptions<ICharacteristicValueEntity, ICharacteristicEntity, BasicsCharacteristicComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DiscreteValue',
				parent: parentService,
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						CharacteristicId: ident.pKey1!,
					};
				},
			},
			readInfo: {
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1!,
					};
				},
			},
		});
		this.subscribeToSelectedCharacteristicType();
		this.subscribeToSelectedCharacteristicDefaultValue();
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		throw new Error('There should be a selected parent Characteristic record to load the discrete value data');
	}
	/**
	 *When the default value and type of the parent container have been changed,
	 *the discrete value container need respond the changes.
	 */
	private subscribeToSelectedCharacteristicDefaultValue() {
		this.parentService.defaultValueChanged.subscribe((characteristicEntity) => {
			this.getList().forEach((item) => {
				if (item.Id !== characteristicEntity.DefaultValue) {
					if (item.IsDefault) {
						item.IsDefault = false;
						this.entitiesUpdated(item);
					}
				} else {
					item.IsDefault = true;
					this.entitiesUpdated(item);
				}
			});
			//this.gridRefresh();
		});
		// });
	}

	private subscribeToSelectedCharacteristicType() {
		this.parentService.characteristicTypeChanged.subscribe((characteristicEntity) => {
			if (characteristicEntity.CharacteristicTypeFk !== BasicsCharacteristicType.Lookup) {
				this.setList([]);
			}
			const currentParentItem = this.parentService.getSelectedEntity();
			if (currentParentItem) {
				this.loadSubEntities({ id: 0, pKey1: currentParentItem.Id });
			}
			//this.gridRefresh();
		});
	}

	/**
	 * 	When the is default field have been changed.
	 * 	the default value of the parent container need respond the changes.
	 * @param entity
	 */

	public isDefaultModified(entity: ICharacteristicValueEntity) {
		const currentParentItem = this.parentService.getSelectedEntity();
		if (currentParentItem) {
			if (entity.IsDefault) {
				currentParentItem.DefaultValue = entity.Id;
			}
			//TODO update it after basicsLookupdataLookupDescriptorService ready
			//basicsLookupdataLookupDescriptorService.updateData('CharacteristicValue', [currentItem]); \
			this.parentService.entitiesUpdated(currentParentItem);
		}
		//	this.parentService.gridRefresh();
		return true;
	}

	public override canCreate(): boolean {
		const parentItem = this.parentService.getSelectedEntity();
		return parentItem != null && parentItem.Id != undefined && parentItem.CharacteristicTypeFk == BasicsCharacteristicType.Lookup;
	}

	/**
	 * 	If we delete the item(the IsDefault field of this item is true).the default value of the parent container must set null.
	 * @param entities
	 */
	public override delete(entities: ICharacteristicValueEntity[] | ICharacteristicValueEntity) {
		super.delete(entities);
		let temEntity;
		if (Array.isArray(entities)) {
			temEntity = entities[0];
		} else {
			temEntity = entities;
		}

		// todo refresh list and selection
		// var tempentity = deleteParams ];
		// }
		// if (data.deleteFromSelections) {
		// 	data.deleteFromSelections(tempentity, data);
		// }
		// data.doClearModifications(tempentity, data);
		// data.itemList = _.filter(data.itemList, function (item) {
		// 	return item.Id !== tempentity.Id;
		// });
		//
		// if (data.rootOptions && data.rootOptions.mergeAffectedItems) {
		// 	data.rootOptions.mergeAffectedItems(response, data);
		// }
		//
		// data.listLoaded.fire();
		// platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
		this.onDeleteDiscreteValue(temEntity);
	}

	private onDeleteDiscreteValue(discreteValue: ICharacteristicValueEntity) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			if (discreteValue.IsDefault) {
				parentItem.DefaultValue = null;
			}
			this.parentService.entitiesUpdated(parentItem);
			//this.parentService.gridRefresh();
		}
	}

	public override isParentFn(parentKey: ICharacteristicEntity, entity: ICharacteristicValueEntity): boolean {
		return entity.CharacteristicFk === parentKey.Id;
	}
}
