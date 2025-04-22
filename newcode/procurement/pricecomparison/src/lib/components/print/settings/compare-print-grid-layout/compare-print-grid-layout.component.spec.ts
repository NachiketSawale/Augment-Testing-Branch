/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintGridLayoutComponent } from './compare-print-grid-layout.component';

describe('ProcurementPricecomparisonComparePrintGridLayoutComponent', () => {
	let component: ProcurementPricecomparisonComparePrintGridLayoutComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintGridLayoutComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintGridLayoutComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintGridLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
