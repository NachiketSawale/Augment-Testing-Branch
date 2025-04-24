/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonHotkeyService } from '../../../services/menu-list/hotkey.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformTranslateService } from '@libs/platform/common';

import { TranslatePipe } from '@libs/platform/common';
import { MenuListRadioComponent } from './menu-list-radio.component';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

describe('MenuListRadioComponent', () => {
	let component: MenuListRadioComponent<void>;
	let fixture: ComponentFixture<MenuListRadioComponent<void>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MenuListRadioComponent],
			providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService ,UiCommonHotkeyService],
		}).compileComponents();
		fixture = TestBed.createComponent(MenuListRadioComponent<void>);
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
		component.showTitles = true;
		component.activeValue = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Translate Pipe and Service', () => {
		const transformspyon = jest.spyOn(component.translate, 'transform').mockReturnValue('Viewer Configuration');
		expect(transformspyon).toBeDefined();
	});

	it('showTitles', () => {
		expect(component.showTitles).toBeTruthy();
	});

	it('getCssClass', () => {
		jest.spyOn(component, 'getCssClass');
		expect(component.getCssClass).toBeDefined();
	});

	it('getTitle', () => {
		jest.spyOn(component, 'getTitle');
		expect(component.getTitle).toBeDefined();
	});

	it('isDisabled', () => {
		jest.spyOn(component, 'isDisabled');
		expect(component.isDisabled).toBeDefined();
	});
});
