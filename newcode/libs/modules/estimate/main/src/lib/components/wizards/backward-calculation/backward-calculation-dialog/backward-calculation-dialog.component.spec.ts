/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackwardCalculationDialogComponent } from './backward-calculation-dialog.component';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BACKWARD_CALCULATION_CONFIGURATION_TOKEN } from '../../../../wizards/estimate-main-backward-calculation-wizard.service';
import { IBackwarkCalculationConfiguration, IBackwarkFromEntity } from '@libs/estimate/interfaces';

describe('BackwardCalculationDialogComponent', () => {
	let component: BackwardCalculationDialogComponent;
	let fixture: ComponentFixture<BackwardCalculationDialogComponent>;
	let translateService: PlatformTranslateService;
	let dataService: IBackwarkCalculationConfiguration;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			declarations: [BackwardCalculationDialogComponent, TranslatePipe],
			providers: [
				{
					provide: PlatformTranslateService,
					useValue: {},
				},
				{
					provide: BACKWARD_CALCULATION_CONFIGURATION_TOKEN,
					useValue: {
						SelLineItemScope: {} as IBackwarkFromEntity,
						ActStandardAllowanceFk:null,
						KeepFixedPrice: false,
						ActStandardAllowance :  null
					},
				}
			],
		}).compileComponents();
		translateService = TestBed.inject(PlatformTranslateService);
		translateService.instant = jest.fn().mockReturnValue({ text: 'estimate.main.backwardCalculation.title' });
		dataService = TestBed.inject(BACKWARD_CALCULATION_CONFIGURATION_TOKEN);
		fixture = TestBed.createComponent(BackwardCalculationDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
