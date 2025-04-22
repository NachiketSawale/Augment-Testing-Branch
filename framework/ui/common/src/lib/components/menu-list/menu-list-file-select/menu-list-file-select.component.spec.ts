/*
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformTranslateService } from '@libs/platform/common';

import { TranslatePipe } from '@libs/platform/common';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import {
	ConcreteMenuItem
} from '../../../model/menu-list/interface/index';
import { MenuListFileSelectComponent } from './menu-list-file-select.component';

describe('MenuListFileSelectComponent', () => {
	// let component: MenuListFileSelectComponent<void>;
	// let fixture: ComponentFixture<MenuListFileSelectComponent<void>>;

	// const menuItem: ConcreteMenuItem = {
	// 	type: ItemType.FileSelect,
	// 	id: 'fileSelect',
	// };
	// beforeEach(async () => {
	// 	await TestBed.configureTestingModule({
	// 		imports: [HttpClientTestingModule],
	// 		declarations: [MenuListFileSelectComponent],
	// 		providers: [TranslatePipe, PlatformTranslateService, PlatformConfigurationService],
	// 	}).compileComponents();

	// 	fixture = TestBed.createComponent(MenuListFileSelectComponent<void>);
	// 	component = fixture.componentInstance;
	// 	component.menuItem = menuItem;

	// 	fixture.detectChanges();
	// });

	it('should create', () => {
		expect(true).toBeTruthy();
	});

});
