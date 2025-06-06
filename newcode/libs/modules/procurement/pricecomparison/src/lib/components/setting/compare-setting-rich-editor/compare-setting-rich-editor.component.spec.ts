/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommonModule } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareSettingRichEditorComponent } from './compare-setting-rich-editor.component';

describe('ProcurementPricecomparisonCompareSettingRichEditorComponent', () => {
	let component: ProcurementPricecomparisonCompareSettingRichEditorComponent;
	let fixture: ComponentFixture<ProcurementPricecomparisonCompareSettingRichEditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UiCommonModule],
			declarations: [ProcurementPricecomparisonCompareSettingRichEditorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcurementPricecomparisonCompareSettingRichEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
