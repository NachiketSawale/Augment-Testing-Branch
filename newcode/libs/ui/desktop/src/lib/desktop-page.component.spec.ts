/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDesktopPageComponent } from './desktop-page.component';

describe('UiDesktopPageComponent', () => {
	let component: UiDesktopPageComponent;
	let fixture: ComponentFixture<UiDesktopPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiDesktopPageComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDesktopPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
