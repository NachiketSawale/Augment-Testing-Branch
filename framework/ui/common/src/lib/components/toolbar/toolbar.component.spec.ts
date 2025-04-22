/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { UiCommonPopupContainerComponent } from '../../popup/components/popup-container/popup-container.component';
import { MenuListComponent } from '../menu-list/menu-list/menu-list.component';

describe('ToolbarComponent', () => {
	let component: ToolbarComponent;
	let fixture: ComponentFixture<ToolbarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ToolbarComponent,UiCommonPopupContainerComponent,MenuListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ToolbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
