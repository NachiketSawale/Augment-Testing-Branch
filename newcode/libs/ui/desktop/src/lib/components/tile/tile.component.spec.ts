/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDesktopTileComponent } from './tile.component';

describe('UiDesktopTileComponent', () => {
	let component: UiDesktopTileComponent;
	let fixture: ComponentFixture<UiDesktopTileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiDesktopTileComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDesktopTileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
