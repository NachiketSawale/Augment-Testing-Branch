/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintBoqRangeComponent } from './compare-print-boq-range.component';

describe('ProcurementPricecomparisonComparePrintBoqRangeComponent', () => {
	let component: ProcurementPricecomparisonComparePrintBoqRangeComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintBoqRangeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintBoqRangeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintBoqRangeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
