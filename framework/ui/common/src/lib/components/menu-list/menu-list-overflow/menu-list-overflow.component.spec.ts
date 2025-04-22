/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformTranslateService } from '@libs/platform/common';

import { TranslatePipe } from '@libs/platform/common';
import { ActivePopup } from '../../../popup/model/active-popup';
import { MenuListOverflowComponent } from './menu-list-overflow.component';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

describe('MenuListOverflowComponent', () => {
	let component: MenuListOverflowComponent<void>;
	let fixture: ComponentFixture<MenuListOverflowComponent<void>>;
	const menuItem = {
		type: ItemType.OverflowBtn,
		cssClass: ' fix ',
		iconClass: 'ico-menu',
		caption: 'cloud.common.viewerConfiguration',
		list: {
			items: [],
			overflow: true,
			level: 1,
			showImages: true,
			showTitles: true,
		},
		id: 'fixbutton',
		isDisplayed: true,
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MenuListOverflowComponent],
			providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService],
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListOverflowComponent<void>);
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

	it('toggleDropdown open', async () => {
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

	it('toggleDropdown close method', async () => {
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
		const close = jest.spyOn(component, 'closePopup').mockImplementation((activePopup) => {
			activePopup;
		});
		component.open = true;
		component.activePopup = activePopup;
		fixture.detectChanges();
		component.toggleDropdown(component.menuItem);

		expect(close).toHaveBeenCalled();
	});
});
