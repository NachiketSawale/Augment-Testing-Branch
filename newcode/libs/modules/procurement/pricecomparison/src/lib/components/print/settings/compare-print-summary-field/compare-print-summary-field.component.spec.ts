/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintSummaryFieldComponent } from './compare-print-summary-field.component';

describe('ProcurementPricecomparisonComparePrintSummaryFieldComponent', () => {
	let component: ProcurementPricecomparisonComparePrintSummaryFieldComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintSummaryFieldComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintSummaryFieldComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintSummaryFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
