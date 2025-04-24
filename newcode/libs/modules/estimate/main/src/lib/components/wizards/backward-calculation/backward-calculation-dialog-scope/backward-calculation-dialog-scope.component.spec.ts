/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackwardCalculationDialogScopeComponent } from './backward-calculation-dialog-scope.component';
import { BACKWARD_CALCULATION_CONFIGURATION_TOKEN } from '../../../../wizards/estimate-main-backward-calculation-wizard.service';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { IBackwarkCalculationConfiguration } from '@libs/estimate/interfaces';

describe('BackwardCalculationDialogScopeComponent', () => {
	let dataService: IBackwarkCalculationConfiguration;
	let component: BackwardCalculationDialogScopeComponent;
	let fixture: ComponentFixture<BackwardCalculationDialogScopeComponent>;
	let translateService: PlatformTranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[FormsModule],
			declarations: [BackwardCalculationDialogScopeComponent, TranslatePipe],
			providers: [
				{
					provide: BACKWARD_CALCULATION_CONFIGURATION_TOKEN,
					useValue: {
						SelLineItemScope: {
							FixedPriceLineItems: true,
							LineItemsAllowance: true,
							LineItemsMarkup: true,
						}
					},
				},
				{
					provide: PlatformTranslateService,
					useValue: {},
				}
			],
		}).compileComponents();

		dataService = TestBed.inject(BACKWARD_CALCULATION_CONFIGURATION_TOKEN);
		translateService = TestBed.inject(PlatformTranslateService);
		translateService.instant = jest.fn().mockReturnValue('estimate.main.backwardCalculation.title');
		fixture = TestBed.createComponent(BackwardCalculationDialogScopeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
