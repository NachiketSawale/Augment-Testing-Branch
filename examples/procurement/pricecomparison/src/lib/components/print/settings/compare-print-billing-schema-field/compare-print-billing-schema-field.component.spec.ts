/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent } from './compare-print-billing-schema-field.component';

describe('ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent', () => {
	let component: ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
