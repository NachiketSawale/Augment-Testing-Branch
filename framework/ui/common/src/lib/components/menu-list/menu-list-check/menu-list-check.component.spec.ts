/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlatformTranslateService } from '@libs/platform/common';
import { PlatformConfigurationService } from '@libs/platform/common';

import { MenuListCheckComponent } from './menu-list-check.component';
import { TranslatePipe } from '@libs/platform/common';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import {
	ConcreteMenuItem
} from '../../../model/menu-list/interface/index';

describe('MenuListCheckComponent', () => {
	let component: MenuListCheckComponent<void>;
	let fixture: ComponentFixture<MenuListCheckComponent<void>>;
	const menuItem: ConcreteMenuItem = {
		id: 'modalConfig',
		caption: {
			text: 'Estimate Configuration Dialog',
		},
		type: ItemType.Item,
		cssClass: 'tlb-icons ico-settings-doc',
		iconClass: 'tlb-icons ico-settings-doc',
		hideItem: false,
		isSet: true,
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MenuListCheckComponent],
			providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService],
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListCheckComponent<void>);
		component = fixture.componentInstance;
		component.menuItem = menuItem;
		component.showTitles = true;
		fixture.detectChanges();
	});
	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
	it('showTitles', () => {
		expect(component.showTitles).toBeTruthy();
	});
});
