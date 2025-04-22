/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintItemTypeComponent } from './compare-print-item-type.component';

describe('ProcurementPricecomparisonComparePrintItemTypeComponent', () => {
	let component: ProcurementPricecomparisonComparePrintItemTypeComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintItemTypeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintItemTypeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintItemTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
