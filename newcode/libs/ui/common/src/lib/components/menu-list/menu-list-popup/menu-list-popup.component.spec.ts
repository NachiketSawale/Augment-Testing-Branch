/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MenuListCheckComponent } from '../menu-list-check/menu-list-check.component';
import { MenuListBtnComponent } from '../menu-list-btn/menu-list-btn.component';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { MenuListPopupComponent } from './menu-list-popup.component';
import { UiCommonPopupComponent } from '../../../popup/components/popup/popup.component';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { MenuListDropdownComponent } from '../menu-list-dropdown/menu-list-dropdown.component';
import { MenuListOverflowComponent } from '../menu-list-overflow/menu-list-overflow.component';
import { MenuListRadioComponent } from '../menu-list-radio/menu-list-radio.component';
import { UiCommonPopupContainerComponent } from '../../../popup/components/popup-container/popup-container.component';
import { UiCommonPopupResizableDirective } from '../../../popup/directives/popup-resizable.directive';
import { menu } from '../../../mock-data/menu-list.mockdata';
import { TranslatePipe } from '@libs/platform/common';

describe('MenuListPopupComponent', () => {
	let component: ToolbarComponent;
	let fixture: ComponentFixture<ToolbarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [
				ToolbarComponent,
				MenuListPopupComponent,
				UiCommonPopupComponent,
				MenuListComponent,
				MenuListBtnComponent,
				MenuListCheckComponent,
				MenuListDropdownComponent,
				MenuListOverflowComponent,
				MenuListRadioComponent,
				UiCommonPopupContainerComponent,
				UiCommonPopupResizableDirective,
			],
			providers: [TranslatePipe],
		}).compileComponents();

		fixture = TestBed.createComponent(ToolbarComponent);
		component = fixture.componentInstance;
		component.toolbarData = menu;
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
	it('open popup', () => {
		const overflow = document.getElementsByTagName('ui-common-menu-list-overflow')[0];
		const clickEvent = new Event('click', {});
		overflow.firstElementChild?.dispatchEvent(clickEvent);

		fixture.detectChanges();
		const popup = document.getElementsByTagName('ui-common-menu-list-popup')[0];
		expect(popup).toBeDefined();
	});

	it('trigger mousedown event', () => {
		const overflow = document.getElementsByTagName('ui-common-menu-list-overflow')[0];
		const clickEvent = new Event('click', {});
		const mouseEvent = new Event('mousedown', {});

		overflow.firstElementChild?.dispatchEvent(clickEvent);

		fixture.detectChanges();
		const popup = document.getElementsByTagName('ui-common-menu-list-popup')[0];
		popup.dispatchEvent(mouseEvent);
		fixture.detectChanges();

		expect(popup).toBeDefined();
	});
});
