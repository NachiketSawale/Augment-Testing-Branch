/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintQuoteColumnComponent } from './compare-print-quote-column.component';

describe('ProcurementPricecomparisonComparePrintQuoteColumnComponent', () => {
	let component: ProcurementPricecomparisonComparePrintQuoteColumnComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintQuoteColumnComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintQuoteColumnComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintQuoteColumnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
