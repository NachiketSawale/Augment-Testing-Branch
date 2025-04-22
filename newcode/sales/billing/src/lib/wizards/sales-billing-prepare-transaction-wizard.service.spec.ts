import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SalesBillingPrepareTransactionWizardService } from './sales-billing-prepare-transaction-wizard.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';

jest.mock('@libs/ui/common');
jest.mock('@libs/platform/common');
jest.mock('../services/sales-billing-bills-data.service');

describe('SalesBillingPrepareTransactionWizardService', () => {
    let service: SalesBillingPrepareTransactionWizardService;
    let httpMock: HttpTestingController;
    let messageBoxService: UiCommonMessageBoxService;
    let translateService: PlatformTranslateService;
    let billingBillDataService: SalesBillingBillsDataService;
    let configService: PlatformConfigurationService;

    const selectedEntity: IBilHeaderEntity = {
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
    };

    beforeEach(() => {
        messageBoxService = new UiCommonMessageBoxService();
        translateService = new PlatformTranslateService();
        billingBillDataService = new SalesBillingBillsDataService();
        configService = {
            webApiBaseUrl: 'https://apps-int.itwo40.eu/itwo40/daily/services/'
        } as unknown as jest.Mocked<PlatformConfigurationService>;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SalesBillingPrepareTransactionWizardService,
                { provide: UiCommonMessageBoxService, useValue: messageBoxService },
                { provide: PlatformTranslateService, useValue: translateService },
                { provide: SalesBillingBillsDataService, useValue: billingBillDataService },
                { provide: PlatformConfigurationService, useValue: configService }
            ]
        });

        service = TestBed.inject(SalesBillingPrepareTransactionWizardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show warning message if no entity is selected', () => {
        jest.spyOn(billingBillDataService, 'getSelectedEntity').mockReturnValue(null);
        jest.spyOn(messageBoxService, 'showMsgBox');
        jest.spyOn(translateService, 'instant').mockReturnValue([{ key: 'cloud.common.noCurrentSelection', text: 'procurement.invoice.transaction.generateTransaction'}]);

        service.prepareTransaction();

        expect(messageBoxService.showMsgBox).toHaveBeenCalledWith(
            'cloud.common.noCurrentSelection',
            translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'selected'}).text,
            'ico-warning'
        );
    });

    
    it('should prepare transaction for selected entities', () => {
        const headers: IBilHeaderEntity[] = [
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
                DateEffective:'2024-10-31T00:00:00Z',
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
        jest.spyOn(billingBillDataService, 'getSelectedEntity').mockReturnValue(selectedEntity);
        jest.spyOn(billingBillDataService, 'getSelection').mockReturnValue(headers);
        jest.spyOn(billingBillDataService, 'updateAndExecute').mockImplementation(async (callback) => callback());
        jest.spyOn(billingBillDataService, 'refreshSelected');
        jest.spyOn(billingBillDataService, 'refreshAll');

        service.prepareTransaction();
        const expectedUrl = `${configService.webApiBaseUrl}sales/billing/transaction/prepare`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ MainItemIds: [1, 2] });

        req.flush({});

        expect(billingBillDataService.refreshSelected).not.toHaveBeenCalled();
        expect(billingBillDataService.refreshAll).toHaveBeenCalled();
    });

    it('should refresh selected entity if only one entity is selected', () => {
        const headers: IBilHeaderEntity[] = [
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
            }
        ];

        jest.spyOn(billingBillDataService, 'getSelectedEntity').mockReturnValue(selectedEntity);
        jest.spyOn(billingBillDataService, 'getSelection').mockReturnValue(headers);
        jest.spyOn(billingBillDataService, 'updateAndExecute').mockImplementation(async (callback) => callback());
        jest.spyOn(billingBillDataService, 'refreshSelected');
        jest.spyOn(billingBillDataService, 'refreshAll');

        service.prepareTransaction();

        const expectedUrl = `${configService.webApiBaseUrl}sales/billing/transaction/prepare`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ MainItemIds: [1] });

        req.flush({});

        expect(billingBillDataService.refreshSelected).toHaveBeenCalled();
        expect(billingBillDataService.refreshAll).not.toHaveBeenCalled();
    });
});