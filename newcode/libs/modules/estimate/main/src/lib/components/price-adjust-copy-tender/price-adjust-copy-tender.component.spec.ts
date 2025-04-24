/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceAdjustCopyTenderComponent } from './price-adjust-copy-tender.component';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';

describe('PriceAdjustCopyTenderComponent', () => {
	let component: PriceAdjustCopyTenderComponent;
	let fixture: ComponentFixture<PriceAdjustCopyTenderComponent>;
	let translateService: PlatformTranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[FormsModule],
			declarations: [PriceAdjustCopyTenderComponent, TranslatePipe],
			providers: [
				{
					provide: PlatformTranslateService,
					useValue: {},
				},
			],
		}).compileComponents();
		translateService = TestBed.inject(PlatformTranslateService);
		translateService.instant = jest.fn().mockReturnValue({ text:'estimate.main.priceAdjustment.copyTender.title'});
		fixture = TestBed.createComponent(PriceAdjustCopyTenderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
