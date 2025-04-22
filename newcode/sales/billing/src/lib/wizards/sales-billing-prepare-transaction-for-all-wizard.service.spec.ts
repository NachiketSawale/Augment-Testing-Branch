import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SalesBillingPrepareTransactionForAllWizardService } from './sales-billing-prepare-transaction-for-all-wizard.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { SalesBillingValidationDataService } from '../services/sales-billing-validation-data.service';

jest.mock('@libs/ui/common');
jest.mock('@libs/platform/common');
jest.mock('../services/sales-billing-bills-data.service');
jest.mock('../services/sales-billing-validation-data.service');

describe('SalesBillingPrepareTransactionForAllWizardService', () => {
    let service: SalesBillingPrepareTransactionForAllWizardService;
    let httpMock: HttpTestingController;
    let messageBoxService: UiCommonMessageBoxService;
    let translateService: PlatformTranslateService;
    let billingBillDataService: SalesBillingBillsDataService;
    let validationDataService: SalesBillingValidationDataService;
    let configService: PlatformConfigurationService;

    const selectedList = [
        {
            Id: 1,
            AmountGross: 0,
            AmountGrossOc: 0,
            AmountNet: 0,
            AmountNetOc: 0,
            BasSalesTaxMethodFk: 0,
            BilStatusFk: 0,
            BillNo: '',
            BillingSchemaFk: 0,
            BusinesspartnerFk: 0,
            ClerkFk: 0,
            CompanyFk: 0,
            CompanyResponsibleFk: 0,
            CurrencyFk: 0,
            IsCanceled: false,
            PaymentTermFk: 0,
            ProjectFk: 0,
            Version: 0,
            ContractCurrencyFk: 1,
            ContractTypeFk: 2,
            CustomerFk: 43,
            DateEffective: '2024-10-31T00:00:00Z',
            ExchangeRate: 1,
            FromBillingSchemaNetOc: 0,
            FromBillingSchemaVatOc: 0,
            FromBillingSchemaNet: 0,
            FromBillingSchemaVat: 0,
            InvoiceTypeFk: 1,
            IsBilled: false,
            IsConfirmToDeleteBillWithQto: false,
            IsContractRelated: true,
            IsDiverseDebitorsAllowed: false,
            IsNotAccrual: false,
            IsReadOnly: false,
            IsRecharging: false,
            IsReferencedByOrdPaymentSchedule: false,
            IsWipOrder: false,
            LanguageFk: 1,
            ProgressInvoiceNo: 1,
            RubricCategoryFk: 446,
            SubsidiaryFk: 1000448,
            TaxCodeFk: 40,
            TypeFk: 1000871,
        },
        {
            Id: 2,
            AmountGross: 0,
            AmountGrossOc: 0,
            AmountNet: 0,
            AmountNetOc: 0,
            BasSalesTaxMethodFk: 0,
            BilStatusFk: 0,
            BillNo: '',
            BillingSchemaFk: 0,
            BusinesspartnerFk: 0,
            ClerkFk: 0,
            CompanyFk: 0,
            CompanyResponsibleFk: 0,
            CurrencyFk: 0,
            IsCanceled: false,
            PaymentTermFk: 0,
            ProjectFk: 0,
            Version: 0,
            ContractCurrencyFk: 1,
            ContractTypeFk: 2,
            CustomerFk: 43,
            DateEffective: '2024-10-31T00:00:00Z',
            ExchangeRate: 1,
            FromBillingSchemaNetOc: 0,
            FromBillingSchemaVatOc: 0,
            FromBillingSchemaNet: 0,
            FromBillingSchemaVat: 0,
            InvoiceTypeFk: 1,
            IsBilled: false,
            IsConfirmToDeleteBillWithQto: false,
            IsContractRelated: true,
            IsDiverseDebitorsAllowed: false,
            IsNotAccrual: false,
            IsReadOnly: false,
            IsRecharging: false,
            IsReferencedByOrdPaymentSchedule: false,
            IsWipOrder: false,
            LanguageFk: 1,
            ProgressInvoiceNo: 1,
            RubricCategoryFk: 446,
            SubsidiaryFk: 1000448,
            TaxCodeFk: 40,
            TypeFk: 1000871,
        }
    ];

    beforeEach(() => {
        messageBoxService = new UiCommonMessageBoxService();
        translateService = new PlatformTranslateService();
        jest.spyOn(translateService, 'instant').mockReturnValue([{ key: 'procurement.invoice.transaction.generateTransaction', text: 'procurement.invoice.transaction.generateTransaction' }]);
        billingBillDataService = new SalesBillingBillsDataService();
        validationDataService = new SalesBillingValidationDataService(billingBillDataService);
        configService = {
            webApiBaseUrl: 'https://apps-int.itwo40.eu/itwo40/daily/services/'
        } as unknown as jest.Mocked<PlatformConfigurationService>;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SalesBillingPrepareTransactionForAllWizardService,
                { provide: UiCommonMessageBoxService, useValue: messageBoxService },
                { provide: PlatformTranslateService, useValue: translateService },
                { provide: SalesBillingBillsDataService, useValue: billingBillDataService },
                { provide: SalesBillingValidationDataService, useValue: validationDataService },
                { provide: PlatformConfigurationService, useValue: configService }
            ]
        });

        service = TestBed.inject(SalesBillingPrepareTransactionForAllWizardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show warning message if no records are found', () => {
        jest.spyOn(billingBillDataService, 'getList').mockReturnValue([]);
        jest.spyOn(messageBoxService, 'showMsgBox');
        jest.spyOn(translateService, 'instant').mockReturnValue([{ key: 'Please search at least one record first.', text: 'procurement.invoice.transaction.generateTransaction' }]);

        service.prepareTransactionForAll();

        expect(messageBoxService.showMsgBox).toHaveBeenCalledWith(
            'Please search at least one record first.',
            translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'All'}).text,
            'ico-warning'
        );
    });

    it('should prepare transaction for all records', () => {
        jest.spyOn(billingBillDataService, 'getList').mockReturnValue(selectedList);
        jest.spyOn(billingBillDataService, 'updateAndExecute').mockImplementation(async (callback) => callback());
        jest.spyOn(validationDataService, 'addJob');
        jest.spyOn(validationDataService, 'updateAll');
        jest.spyOn(messageBoxService, 'showMsgBox');
        jest.spyOn(translateService, 'instant').mockReturnValue([{ key: 'Task to generate transactions already started. Its status can be checked in validation container.', text: 'procurement.invoice.transaction.generateTransaction' }]);

        service.prepareTransactionForAll();
        const expectedUrl = `${configService.webApiBaseUrl}sales/billing/transaction/prepareforall`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            Pattern: null,
            PageSize: 700,
            PageNumber: 0,
            UseCurrentClient: true,
            UseCurrentProfitCenter: null,
            IncludeNonActiveItems: false,
            IncludeReferenceLineItems: null,
            ProjectContextId: null,
            PinningContext: [],
            ExecutionHints: false
        });

        req.flush('jobId123');

        expect(messageBoxService.showMsgBox).toHaveBeenCalledWith(
            'Task to generate transactions already started. Its status can be checked in validation container.',
            translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'All'}).text,
            'ico-warning'
        );
        expect(validationDataService.addJob).toHaveBeenCalledWith('jobId123');
        expect(validationDataService.updateAll).toHaveBeenCalled();
    });

    it('should show error message if transaction preparation fails', () => {
        jest.spyOn(billingBillDataService, 'getList').mockReturnValue(selectedList);
        jest.spyOn(billingBillDataService, 'updateAndExecute').mockImplementation(async (callback) => callback());
        jest.spyOn(messageBoxService, 'showMsgBox');
        jest.spyOn(translateService, 'instant').mockReturnValue([{ key: 'Generate transaction task fail may be: null', text: 'procurement.invoice.transaction.generateTransaction' }]);

        service.prepareTransactionForAll();
        const expectedUrl = `${configService.webApiBaseUrl}sales/billing/transaction/prepareforall`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            Pattern: null,
            PageSize: 700,
            PageNumber: 0,
            UseCurrentClient: true,
            UseCurrentProfitCenter: null,
            IncludeNonActiveItems: false,
            IncludeReferenceLineItems: null,
            ProjectContextId: null,
            PinningContext: [],
            ExecutionHints: false
        });

        req.flush(null);

        expect(messageBoxService.showMsgBox).toHaveBeenCalledWith(
            'Generate transaction task fail may be: null',
            translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'All'}).text,
            'ico-warning'
        );
    });
});