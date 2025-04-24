/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintQuoteFieldComponent } from './compare-print-quote-field.component';

describe('ProcurementPricecomparisonComparePrintQuoteFieldComponent', () => {
	let component: ProcurementPricecomparisonComparePrintQuoteFieldComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintQuoteFieldComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintQuoteFieldComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintQuoteFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
