/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IInitializationContext } from '@libs/platform/common';
import { SalesBillingChangeStatusForProjectDocumentWizardService } from './sales-billing-change-status-for-project-document-wizard.service';
import { SalesBillingDocumentProjectDataService } from '../services/sales-billing-document-project-data.service';

describe('SalesBillingChangeStatusForProjectDocumentWizardService', () => {
	let service: SalesBillingChangeStatusForProjectDocumentWizardService;
	let mockDataService: SalesBillingDocumentProjectDataService;

	beforeEach(() => {
		mockDataService = {} as SalesBillingDocumentProjectDataService;

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [SalesBillingChangeStatusForProjectDocumentWizardService, { provide: SalesBillingDocumentProjectDataService, useValue: mockDataService }],
		});

		service = TestBed.inject(SalesBillingChangeStatusForProjectDocumentWizardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should override the dataService with SalesBillingDocumentProjectDataService', () => {
		expect(service['dataService']).toBe(mockDataService);
	});

	it('should execute the wizard using the static execute method', () => {
		const mockContext: IInitializationContext = {
			injector: {
				get: jest.fn().mockReturnValue(service),
			},
		} as unknown as IInitializationContext;

		const onStartChangeStatusWizardSpy = jest.spyOn(service, 'onStartChangeStatusWizard');

		SalesBillingChangeStatusForProjectDocumentWizardService.execute(mockContext);

		expect(mockContext.injector.get).toHaveBeenCalledWith(SalesBillingChangeStatusForProjectDocumentWizardService);
		expect(onStartChangeStatusWizardSpy).toHaveBeenCalled();
	});
});
