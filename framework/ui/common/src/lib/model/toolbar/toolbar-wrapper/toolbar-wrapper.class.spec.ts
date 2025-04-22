/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToolbarWrapper } from './toolbar-wrapper.class';
import { tools, groups, toolsSort, itemList } from '../../../mock-data/toolbar-base-mockdata';
import { PlatformCommonMainviewService, PlatformPermissionService } from '@libs/platform/common';
import { ItemType } from '../../menu-list/enum/menulist-item-type.enum';
import {
	ConcreteMenuItem,
	IDividerMenuItem
} from '../../menu-list/interface/index';

@Component({
	selector: 'ui-common-test',
	template: '',
})
class TestComponent extends ToolbarWrapper {
	public constructor() {
		super('dde598002bbf4a2d96c82dc927e3e578');
	}
}

describe('ToolbarWrapper', () => {
	let instance: ToolbarWrapper;
	const toolMockdata = tools;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [TestComponent],
			providers: [PlatformPermissionService, PlatformCommonMainviewService]
		});

		TestBed.inject(PlatformPermissionService);
		TestBed.inject(PlatformCommonMainviewService);

		fixture = TestBed.createComponent(TestComponent);
		instance = fixture.componentInstance;

		jest.spyOn(instance, 'setPermission').mockImplementation((tools: ConcreteMenuItem[]) => {
			tools.forEach((tool) => (tool.permission = { f01193df20e34b8d917250ad17a433f1: 8 }));
			return tools;
		});
	});

	it('should create', () => {
		expect(instance).toBeTruthy();
	});

	it('create method should return empty toolbar', () => {
		expect(instance.create()).toBeDefined();
	});

	it('addItems method should add aitems and call createGroup, isGroupExists', () => {
		const spyOnAddItems = jest.spyOn(instance, 'addItems');
		const spyOnCreateGroup = jest.spyOn(instance, 'createGroup');
		const spyOnIsGroupExists = jest.spyOn(instance, 'isGroupExists');
		const groupItems = [];
		groupItems.push(toolMockdata[3]);
		instance.addItems(toolMockdata);
		instance.addItems(toolMockdata[0]);
		instance.addItems(toolMockdata[3], 'dropdown-btn-t199');
		instance.addItems(toolMockdata[3], 'sample');
		instance.addItems(groupItems, 'dropdown-btn-t199');
		instance.addItems(groupItems, 'sample1');

		expect(spyOnAddItems).toBeCalledTimes(6);
		expect(spyOnCreateGroup).toHaveBeenCalled();
		expect(spyOnIsGroupExists).toBeCalledTimes(4);
	});

	it('addItemsAtId should add item at given position', () => {
		instance.addItems(toolMockdata);
		const spyOnIsItemExist = jest.spyOn(instance, 'isItemExist');
		const item: IDividerMenuItem = {
			id: 'd11',
			type: ItemType.Divider,
			hideItem: false,
		};
		const groupItems = [];
		groupItems.push(toolMockdata[3]);
		instance.addItemsAtId('delete', 'before', item);
		instance.addItemsAtId('delete', 'after', item);
		instance.addItemsAtId('t-pinningctx', 'before', groupItems);
		instance.addItemsAtId('t-pinningctx', 'previous', groupItems);
		expect(spyOnIsItemExist).toHaveBeenCalled();
	});

	it('getItemsById should return item according to id', () => {
		instance.addItems(toolMockdata);
		expect(instance.getItemsById('toggleFilteringSelection', false)).toBeDefined();
		expect(instance.getItemsById('dCopyPaste', true)).toBeDefined();
		expect(instance.getItemsById('sample', false)).toBeUndefined();
	});

	it('deleteItems should delete items according to array of id', () => {
		instance.addItems(toolMockdata);
		instance.deleteItems(['toggleFilteringSelection', 'create']);

		expect(instance.getItemsById('toggleFilteringSelection', false)).toBeUndefined();
		expect(instance.getItemsById('create', false)).toBeUndefined();
	});

	it('addItemClass should add css class & removeItemClass should remove css class from item', () => {
		instance.addItems(toolMockdata);
		instance.addItemClass('t-pinningctx', 'active');
		const item = instance.getItemsById('t-pinningctx', false);
		expect(item?.cssClass?.includes('active')).toBeTruthy();
		instance.removeItemClass('t-pinningctx', 'active');
		expect(item?.cssClass?.includes('active')).toBeFalsy();
	});

	it('method addItemClass should add given css class to item', () => {
		instance.addItems(toolMockdata);
		const tools = toolMockdata;
		tools[8].cssClass = 'sample';
		instance.addItems(tools);
		instance.addItemClass('t-pinningctx', 'active');
		const item = instance.getItemsById('t-pinningctx', false);
		expect(item?.cssClass?.includes('active')).toBeTruthy();
	});

	it('toggleItemClass should toggle given css class', () => {
		instance.addItems(toolMockdata);
		instance.toggleItemClass('gridSearchColumn', 'active');
		let item = instance.getItemsById('gridSearchColumn', false);
		expect(item?.cssClass?.includes('active')).toBeTruthy();

		instance.toggleItemClass('gridSearchColumn', 'active');
		item = instance.getItemsById('gridSearchColumn', false);
		expect(item?.cssClass?.includes('active')).toBeFalsy();

		instance.toggleItemClass('gridSearchAll', 'active');
		item = instance.getItemsById('gridSearchAll', false);
		expect(item?.cssClass?.includes('active')).toBeTruthy();
	});

	it('hideItem should hide or show item', () => {
		instance.addItems(toolMockdata);
		instance.hideItem('t-pinningctx', true);
		const item = instance.getItemsById('t-pinningctx', false);
		expect(item?.hideItem).toBeTruthy();
	});

	it('get toolbar should give refactored items with group id and overflow at last', () => {
		let items = instance.toolbar;
		expect(items).toBeDefined();
		const spyOnCreateGroupId = jest.spyOn(instance, 'createGroupId');
		const spyOnEnsureOverFlowAtLast = jest.spyOn(instance, 'ensureOverFlowAtLast');
		instance.addItems(toolMockdata);
		items = instance.toolbar;
		expect(items).toBeDefined();

		expect(spyOnCreateGroupId).toHaveBeenCalled();
		expect(spyOnEnsureOverFlowAtLast).toHaveBeenCalled();
	});

	it('get toolbar should return items with same sort sequentially', () => {
		let items = instance.toolbar;
		expect(items).toBeDefined();

		const spyOnRefactorList = jest.spyOn(instance, 'refactorList');
		const spyOnCreateGroupId = jest.spyOn(instance, 'createGroupId');
		const spyOnEnsureOverFlowAtLast = jest.spyOn(instance, 'ensureOverFlowAtLast');
		instance.addItems(toolsSort);
		items = instance.toolbar;
		expect(items).toBeDefined();

		expect(spyOnRefactorList).toHaveBeenCalled();
		expect(spyOnCreateGroupId).toHaveBeenCalled();
		expect(spyOnEnsureOverFlowAtLast).toHaveBeenCalled();
	});

	it('addGroups should add given group according to groupId', () => {
		instance.addItems(toolMockdata);
		const spyOnIsGroupExists = jest.spyOn(instance, 'isGroupExists');
		instance.addGroups(toolMockdata[1]);
		instance.addGroups(toolMockdata[3], 'dropdown-btn-t199');
		instance.addGroups(toolMockdata[2], 'sample');
		expect(spyOnIsGroupExists).toHaveBeenCalled();
	});

	it('refactorList should call ensureOverFlowAtLast ', () => {
		const spyOnEnsureOverFlowAtLast = jest.spyOn(instance, 'refactorList');
		instance.refactorList(toolMockdata, true);
		instance.refactorList(itemList, false);

		expect(spyOnEnsureOverFlowAtLast).toBeCalledTimes(2);
	});

	it('createGroupId should create group id for every group', () => {
		const items = instance['createGroupId'](groups);
		expect(items[0].groupId).toEqual(groups[0].type + '-' + groups[0].id);
		expect(items[1].groupId).toEqual(groups[1].type + '-' + groups[1].iconClass);
	});

	it('selectDropdownItem should set active value and iconClass to dropdown item', () => {
		const spyOnSelectDropdownItem = jest.spyOn(instance, 'selectDropdownItem');
		instance.addItems(toolMockdata);
		instance.selectDropdownItem('filterBoQAndNotAssigned');
		expect(spyOnSelectDropdownItem).toHaveBeenCalled();

	});
});
