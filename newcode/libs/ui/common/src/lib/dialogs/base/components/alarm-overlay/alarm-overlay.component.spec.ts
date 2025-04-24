/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonAlarmOverlayComponent } from './alarm-overlay.component';

describe('OverlayComponent', () => {
	let component: UiCommonAlarmOverlayComponent;
	let fixture: ComponentFixture<UiCommonAlarmOverlayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonAlarmOverlayComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiCommonAlarmOverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('testing onchanges function when config string', () => {
		jest.useFakeTimers();
		const data = {
			config: {
				previousValue: undefined,
				currentValue: 'copy',
			} as SimpleChange,
		};
		component.ngOnChanges(data);
		jest.runAllTimers();
	});
	it('testing onchanges function when config object', () => {
		component.config = {
			info: 'dummy',
			cssClass: 'ico-error',
		};
		const data = {
			config: {
				previousValue: undefined,
				currentValue: {
					info: 'dummy',
					cssClass: 'ico-error',
				},
			} as SimpleChange,
		};
		component.ngOnChanges(data);
	});
});
