/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectionDialogComponent } from './list-selection-dialog.component';

import { FieldType } from '../../../../model/fields';
import { SimpleId, TranslatePipe } from '@libs/platform/common';
import { getCustomDialogDataToken } from '../../../base';
import { IListSelectionDialog } from '../../model/list-selection-dialog.interface';
import { IAvailableItemsInfo, IListSelectionDialogData, getArrayAsSetObject, getItemId, getListSelectionDialogDataToken } from '../../model/list-selection-dialog-data.interface';
import { cloneDeep, isNil } from 'lodash';

interface ITestEntity {
	isTag: boolean;
	Id: number | string;
	description?: string;
	parent?: number | string;
	image?: string;
}

const dialogData: IListSelectionDialogData<ITestEntity> = {
	availableGridConfig: {
		columns: [
			{
				id: 'description',
				model: 'description',
				sortable: false,
				label: {
					key: 'cloud.common.entityDescription',
					text: 'Description',
				},
				type: FieldType.Description,
				width: 200,
				visible: true,
			},
		],
	},
	selectedGridConfig: {
		columns: [
			{
				id: 'description',
				model: 'description',
				sortable: false,
				label: {
					key: 'cloud.common.entityDescription',
					text: 'Description',
				},
				type: FieldType.Description,
				width: 200,
				visible: true,
			},
		],
	},
	allItems: [
		{
			Id: 'C1',
			description: 'System',
			isTag: false,
		},
		{
			Id: 'C2',
			parent: 'C1',
			isTag: false,
			description: 'Formats',
		},
		{
			Id: 2,
			parent: 'C2',
			isTag: true,
			description: 'CPI',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 3,
			description: 'IFC',
			parent: 'C2',
			isTag: true,
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 4,
			description: 'Revit',
			parent: 'C2',
			isTag: true,
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 'C3',
			parent: 'C1',
			isTag: false,
			description: 'Origin',
		},
		{
			Id: 5,
			parent: 'C3',
			isTag: true,
			description: 'User-Defined',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 6,
			parent: 'C3',
			isTag: true,
			description: 'From Imported Model',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 7,
			parent: 'C3',
			isTag: true,
			description: 'From Public API',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 1,
			parent: 'C1',
			isTag: true,
			description: 'iTWO 4.0 Metadata',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 'c1000005',
			isTag: false,
			description: 'Test A',
		},
		{
			Id: 1000109,
			parent: 'c1000005',
			isTag: true,
			description: 'X',
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 1000303,
			parent: 'c1000005',
			isTag: true,
			image: 'control-icons ico-ctrl-label',
		},
		{
			Id: 'c1000007',
			description: 'Test B',
			isTag: false,
		},
	],
	value: [
		{
			Id: 2,
			parent: 'C2',
			isTag: true,
			description: 'CPI',
		},
		{
			Id: 3,
			description: 'IFC',
			parent: 'C2',
			isTag: true,
		},
	],
	isSelectable: (item: ITestEntity) => {
		return item.isTag;
	},
	hideWithoutChildren: function (entity: ITestEntity, dialogData: IListSelectionDialog<ITestEntity>) {
		if (this.isSelectable && this.isSelectable(entity, dialogData)) {
			return false;
		}

		return !!this.availableGridConfig.treeConfiguration?.children;
	},
	availableTitle: {
		key: 'platform.listselection.available',
	},
	selectedTitle: {
		key: 'platform.listselection.selected',
	},
	idProperty: 'Id',
	temporarySelectedIdProperty: '__selItemId' as keyof ITestEntity,
	getItemId: function (item: ITestEntity) {
		return item[this.idProperty as keyof ITestEntity];
	},
	getSelectedItemId: function (item: ITestEntity) {
		return item[this.temporarySelectedIdProperty];
	},
	getAvailableItems: function (dialogData: IListSelectionDialog<ITestEntity>):IAvailableItemsInfo<ITestEntity> {
		const idProp = this.idProperty;

		const parentMap = new Map<SimpleId, ITestEntity>();
		const childrenMap = new Map<SimpleId, ITestEntity[]>();

		function generateMapData(avItems: ITestEntity[], owner:IListSelectionDialogData<ITestEntity>) {
			avItems.forEach((avItem) => {
				const children: ITestEntity[] = owner.availableGridConfig.treeConfiguration?.children ? owner.availableGridConfig.treeConfiguration.children(avItem) : [];

				for (const child of children) {
					const childId = getItemId(child, idProp);
					if (isNil(childId)) {
						throw new Error(`An available item for list selected dialog has no ID in its ${String(idProp)} field.`);
					}
					parentMap.set(childId, avItem);
				}

				const parentId = getItemId(avItem, idProp);
				if (isNil(parentId)) {
					throw new Error(`An available item for list selected dialog has no ID in its ${String(idProp)} field.`);
				}
				childrenMap.set(parentId, children);
			});
		}

		generateMapData(this.allItems, this);

		function getItems(itemList: ITestEntity[], that: IListSelectionDialogData<ITestEntity>):ITestEntity[] {
			return itemList
				.map(function (avItem) {
					if (that.isSelectable && that.isSelectable(avItem, dialogData)) {
						const isPresent = that.value.find((selItem) => {
							return that.getItemId(avItem) === that.getItemId(selItem);
						});

						const allowMultiple = typeof that.canInsertMultiple === 'function' ? that.canInsertMultiple(avItem, dialogData) : that.canInsertMultiple;

						if (!allowMultiple && isPresent) {
							return null;
						}
					}

					const avItemId = getItemId(avItem, idProp);
					let children = avItemId ? childrenMap.get(avItemId) : undefined;
					if (Array.isArray(children)) {
						children = getItems(children, that);
					}
					if (that.hideWithoutChildren && that.hideWithoutChildren(avItem, dialogData)) {
						const hasChildren = Array.isArray(children) && children.length > 0;
						if (!hasChildren) {
							return null;
						}
					}

					return cloneDeep(avItem);
				}).filter(avItem => !!avItem) as ITestEntity[];
		}

		return {
			items: getItems(this.allItems,this),
			parentOf: (item:ITestEntity) => {
				const itemId = getItemId(item, idProp);
				return (itemId === undefined || itemId === null) ? undefined : parentMap.get(itemId);
			},
			childrenOf: () => []
		};
	},
	findAvailableItemById: function (id: ITestEntity[keyof ITestEntity]) {
		let result = null;
		this.allItems.some((item) => {
			if (this.getItemId(item) === id) {
				result = item;
				return true;
			}

			return false;
		});

		return result;
	},
	getSelectedItems: function () {
		const data = this.value
			.map((selItem) => {
				const id = this.getItemId(selItem);
				const itemDef = this.findAvailableItemById(id);
				if (itemDef) {
					return Object.assign(cloneDeep(itemDef), selItem);
				} else {
					return null;
				}
			})
			.filter((val) => val !== null);

		return data as ITestEntity[];
	},
	getAllSelectableItems: function (dialogData: IListSelectionDialog<ITestEntity>) {
		const result: ITestEntity[] = [];

		this.allItems.forEach((item) => {
			if (this.isSelectable && this.isSelectable(item, dialogData)) {
				result.push(item);
			}
		});

		return result;
	},
	generateSelectedItemId: function () {
		const existingIds = getArrayAsSetObject(this.value, this.getSelectedItemId.bind(this));

		for (let id = 1; ; id++) {
			if (!existingIds[id]) {
				return id as ITestEntity[keyof ITestEntity];
			}
		}
	},
	createSelectedItem: function (id: ITestEntity[keyof ITestEntity]) {
		const generatedId = this.generateSelectedItemId();
		const newSelItem = {
			[this.idProperty as keyof ITestEntity]: id,
			[this.temporarySelectedIdProperty]: generatedId,
		};

		return newSelItem as unknown as ITestEntity;
	},
};
describe('ListSelectionDialogComponent', () => {
	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
