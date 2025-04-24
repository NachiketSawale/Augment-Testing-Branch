/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintCompareFieldComponent } from './compare-print-compare-field.component';

describe('ProcurementPricecomparisonComparePrintCompareFieldComponent', () => {
	let component: ProcurementPricecomparisonComparePrintCompareFieldComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintCompareFieldComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintCompareFieldComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintCompareFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
