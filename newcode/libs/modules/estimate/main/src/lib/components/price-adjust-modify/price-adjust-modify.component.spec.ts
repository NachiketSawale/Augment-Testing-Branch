/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceAdjustModifyComponent } from './price-adjust-modify.component';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';

describe('PriceAdjustModifyComponent', () => {
	let component: PriceAdjustModifyComponent;
	let fixture: ComponentFixture<PriceAdjustModifyComponent>;
	let translateService: PlatformTranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PriceAdjustModifyComponent, TranslatePipe],
			providers: [
				{
					provide: PlatformTranslateService,
					useValue: {},
				},
			],
		}).compileComponents();
		translateService = TestBed.inject(PlatformTranslateService);
		translateService.instant = jest.fn().mockReturnValue('estimate.main.priceAdjustment.title');
		fixture = TestBed.createComponent(PriceAdjustModifyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
