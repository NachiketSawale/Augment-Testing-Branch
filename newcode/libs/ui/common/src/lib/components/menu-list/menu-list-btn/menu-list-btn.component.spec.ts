/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlatformTranslateService } from '@libs/platform/common';
import { PlatformConfigurationService } from '@libs/platform/common';

import { TranslatePipe } from '@libs/platform/common';
import { MenuListBtnComponent } from './menu-list-btn.component';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';



describe('MenuListBtnComponent', () => {
	let component: MenuListBtnComponent<void>;
	let fixture: ComponentFixture<MenuListBtnComponent<void>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MenuListBtnComponent],
			providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService],
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListBtnComponent<void>);
		component = fixture.componentInstance;
		component.menuItem = {
			id: 't12',
			sort: 10,
			caption: { key: 'cloud.common.taskBarGrouping' },
			type: ItemType.Check,
			iconClass: 'tlb-icons ico-group-columns',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			hideItem: false,
		},
			(component.showTitles = true);
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('Translate Pipe and Service', () => {
		const transformspyon = jest.spyOn(component.translate, 'transform').mockReturnValue('Viewer Configuration');
		expect(transformspyon).toBeDefined();
	});

	it('showTitles', () => {
		expect(component.showTitles).toBeTruthy();
	});
	it('super', () => {
		expect(component).toBeTruthy();
	});

	it('getCssClass', () => {
		jest.spyOn(component, 'getCssClass');
		expect(component.getCssClass).toBeDefined();
	});

	it('isDisabled', () => {
		jest.spyOn(component, 'isDisabled');
		expect(component.isDisabled).toBeDefined();
	});
});
