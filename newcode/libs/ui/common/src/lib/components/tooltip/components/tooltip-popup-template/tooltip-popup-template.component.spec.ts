/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonTooltipPopupTemplateComponent } from './tooltip-popup-template.component';
describe('UiCommonTooltipPopupTemplateComponent', () => {
	let component: UiCommonTooltipPopupTemplateComponent;
	let fixture: ComponentFixture<UiCommonTooltipPopupTemplateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonTooltipPopupTemplateComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonTooltipPopupTemplateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
