/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassList } from '../../../model/menu-list/enum/class-list.enum';
import { MenuListComponent } from './menu-list.component';
import {menuItems} from '../../../mock-data/menu-list.mockdata';
import {
	IMenuItem,
	isParentMenuItem
} from '../../../model/menu-list/interface/index';

describe('MenuListComponent', () => {
	let component: MenuListComponent;	
	let fixture: ComponentFixture<MenuListComponent>;
	const menuListMockData = {
		cssClass: '',
		items: [],
		showImages: false,
		showTitles: false,
		activeValue: '',
		overflow: false,
		iconClass: '',
		layoutChangeable: false,
	};

	const menuItem = menuItems;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MenuListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListComponent<void>);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize component', () => {
		expect(component.menu).toBeDefined();
		expect(component.menu).toEqual(menuListMockData);
	});
	it('getClass should return css Class', () => {
		jest.spyOn(component, 'getClass');
		component.getClass(menuItem[0] as IMenuItem);
		expect(component.getClass).toBeCalled();
	});

	it('tests divider', () => {
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass(menuItem[1] as IMenuItem)).toEqual(ClassList.divider);
	});

	it('tests collapsable divider', () => {
		expect(component.getClass(menuItem[5] as IMenuItem)).toEqual(ClassList.collapsable +' ' +ClassList.divider);
	});

	it('tests item', () => {
		expect(component.getClass(menuItem[0] as IMenuItem)).toContain(ClassList.collapsable);
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass(menuItem[0] as IMenuItem)).not.toContain(ClassList.collapsable);
	});

	it('tests item for overflow false', () => {
		component.menu.overflow = false;
		expect(component.getClass(menuItem[0] as IMenuItem)).toEqual(ClassList.collapsable);
	});

	it('tests dropdown-btn', () => {
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass(menuItem[3] as IMenuItem)).not.toContain(ClassList.collapsable);
	});

	it('tests dropdown-btn collapsable', () => {
		expect(component.getClass(menuItem[6] as IMenuItem)).toEqual(ClassList.dropdown + menuItem[6].id +' ' +ClassList.collapsable);
	});

	it('tests sublist', () => {
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass(menuItem[4] as IMenuItem)).toContain(ClassList.sublist);
	});
	it('tests collapsable  sublist', () => {
		expect(component.getClass(menuItem[4] as IMenuItem)).toEqual(ClassList.collapsable + ' ' +ClassList.sublist);
	});
	it('tests radio', () => {
		const menuItem4 = menuItem[4];
		expect(component.getClass((isParentMenuItem(menuItem4) && menuItem4.list.items) ? menuItem4.list.items[0] : {})).toContain(ClassList.collapsable);
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass((isParentMenuItem(menuItem4) && menuItem4.list.items) ? menuItem4.list.items[0] : {})).not.toContain(ClassList.collapsable);
	});

	it('tests check', () => {
		const menuItem4 = menuItem[4];
		expect(component.getClass((isParentMenuItem(menuItem4) && menuItem4.list.items) ? menuItem4.list.items[0] : {})).toContain(ClassList.collapsable);
		component.sublist = true;
		fixture.detectChanges();
		expect(component.getClass((isParentMenuItem(menuItem4) && menuItem4.list.items) ? menuItem4.list.items[0] : {})).not.toContain(ClassList.collapsable);
	});

	it('tests overflow', () => {
		expect(component.getClass(menuItem[8])).toEqual(ClassList.fix);
	});
	it('tests Default without type', () => {
		expect(component.getClass(menuItem[7])).toEqual('');
	});
	it('tests Default with undefined type', () => {
		expect(component.getClass(menuItem[9])).toEqual('');
	});

	it('getItemClass when showimages is true', () => {
		const menuItem6 = menuItem[6];
		const item = isParentMenuItem(menuItem6) ? menuItem6.list : {};
		item.showImages = true;
		const cssClasses = component.getItemClass(item!);
		expect(cssClasses).toContain(ClassList.showimages);
	});

	it('getItemClass for radio-group', () => {
		const menuItem6 = menuItem[6];
		const item = isParentMenuItem(menuItem6) ? menuItem6.list : {};
		item.cssClass = ClassList.radioGroup;
		const cssClasses = component.getItemClass(item!);
		expect(cssClasses).toContain(ClassList.showimages);
	});
});
