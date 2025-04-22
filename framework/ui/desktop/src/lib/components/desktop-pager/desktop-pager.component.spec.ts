/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDesktopPagerComponent } from './desktop-pager.component';

describe('UiDesktopPagerComponent', () => {
	let component: UiDesktopPagerComponent;
	let fixture: ComponentFixture<UiDesktopPagerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiDesktopPagerComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDesktopPagerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
