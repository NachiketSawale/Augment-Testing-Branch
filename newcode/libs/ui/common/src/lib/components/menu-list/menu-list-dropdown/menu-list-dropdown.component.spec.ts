/*
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformTranslateService } from '@libs/platform/common';

import { ActivePopup } from '../../../popup/model/active-popup';
import { MenuListDropdownComponent } from './menu-list-dropdown.component';
import { TranslatePipe } from '@libs/platform/common';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import {
	ConcreteMenuItem
} from '../../../model/menu-list/interface/index';

describe('MenuListDropdownComponent', () => {
	let component: MenuListDropdownComponent<void>;
	let fixture: ComponentFixture<MenuListDropdownComponent<void>>;

	const menuItem: ConcreteMenuItem = {
		type: ItemType.DropdownBtn,
		cssClass: ' fix ',
		iconClass: 'ico-menu',
		caption: 'cloud.common.viewerConfiguration',
		list: {
			items: [],
			overflow: true,
			showImages: true,
			showTitles: true,
			cssClass: '',
		},
		id: 'fixbutton',
		isDisplayed: true,
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MenuListDropdownComponent],
			providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService],
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListDropdownComponent<void>);
		component = fixture.componentInstance;
		component.menuItem = menuItem;
		component.showTitles = true;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('menuItem', () => {
		expect(component.menuItem).toBeDefined();
	});
	it('showTitles', () => {
		expect(component.showTitles).toBeTruthy();
	});

	it('open', () => {
		expect(component.open).toBeFalsy();
	});

	it('toggleDropdown', async () => {
		const Obj = {
			width: 100,
			height: 200,
			hasDefaultWidth: true,
			resizable: false,
			showFooter: false,
			showHeader: false,
			alignment: 'vertical',
			multiPopup: false,
		};
		const activePopup = new ActivePopup(fixture.elementRef, Obj);
		jest.spyOn(component, 'openPopup').mockReturnValue(activePopup);
		fixture.detectChanges();

		expect(component.toggleDropdown(component.menuItem)).toBeUndefined();
	});

	it('toggleDropdown  close method', async () => {
		const Obj = {
			width: 100,
			height: 200,
			hasDefaultWidth: true,
			resizable: false,
			showFooter: false,
			showHeader: false,
			alignment: 'vertical',
			multiPopup: false,
		};
		const activePopup = new ActivePopup(fixture.elementRef, Obj);
		jest.spyOn(component, 'openPopup').mockReturnValue(activePopup);
		const close = jest.spyOn(component, 'closePopup').mockImplementation(() => {
			menuItem;
		});
		component.open = true;
		component.activePopup = activePopup;
		fixture.detectChanges();
		component.toggleDropdown(component.menuItem);

		expect(close).toHaveBeenCalled();
	});
});
