/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDesktopTileGroupComponent } from './tile-group.component';

describe('UiDesktopTileGroupComponent', () => {
	let component: UiDesktopTileGroupComponent;
	let fixture: ComponentFixture<UiDesktopTileGroupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiDesktopTileGroupComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDesktopTileGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
