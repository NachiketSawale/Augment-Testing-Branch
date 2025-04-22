import { TestBed } from '@angular/core/testing';
import { SalesBillingGeneralsDataService } from './sales-billing-generals-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IBilHeaderEntity, IGeneralsEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IIdentificationDataMutable } from '@libs/platform/common';
jest.mock('./sales-billing-bills-data.service');
describe('SalesBillingGeneralsDataService', () => {
    let service: SalesBillingGeneralsDataService;
    let mockDataService: jest.Mocked<SalesBillingBillsDataService>;
    beforeEach(() => {
        mockDataService = new SalesBillingBillsDataService() as jest.Mocked<SalesBillingBillsDataService>;
        mockDataService.getSelection = jest.fn().mockReturnValue([{ Id: 'test-id' }]);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: SalesBillingBillsDataService, useValue: mockDataService },
                SalesBillingGeneralsDataService
            ]
        });
        service = TestBed.inject(SalesBillingGeneralsDataService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should have correct API URL', () => {
        const apiUrl = (service as unknown as { options: { apiUrl: string } }).options.apiUrl;
        expect(apiUrl).toBe('sales/billing/generals');
    });
    it('should have correct readInfo configuration', () => {
        const readInfo = (service as unknown as { options: { readInfo: { endPoint: string; usePost: boolean } } }).options.readInfo;
        expect(readInfo?.endPoint).toBe('listByParent');
        expect(readInfo?.usePost).toBe(true);
    });
    it('should prepare parameters correctly in createInfo', () => {
        const prepareParam = (entity: IGeneralsEntity) =>
            (service as unknown as { options: { createInfo: { prepareParam: (entity: IGeneralsEntity) => object } } }).options.createInfo.prepareParam(entity);
               const params = prepareParam({} as IGeneralsEntity);
        expect(params).toEqual({ pKey1: 'test-id' });
        expect(mockDataService.getSelection).toHaveBeenCalled();
    });
    it('should return correct parameters from prepareParam', () => {
        mockDataService.getSelection.mockReturnValue([
            {
                Id: 123,
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
                ContractCurrencyFk: 0,
                ContractTypeFk: 0,
                CurrencyFk: 0,
                CustomerFk: 0,
                DateEffective: '',
                ExchangeRate: 0,
                FromBillingSchemaNet: 0,
                FromBillingSchemaNetOc: 0,
                FromBillingSchemaVat: 0,
                FromBillingSchemaVatOc: 0,
                InvoiceTypeFk: 0,
                IsBilled: false,
                IsCanceled: false,
                IsConfirmToDeleteBillWithQto: false,
                IsContractRelated: false,
                IsDiverseDebitorsAllowed: false,
                IsNotAccrual: false,
                IsReadOnly: false,
                IsRecharging: false,
                IsReferencedByOrdPaymentSchedule: false,
                IsWipOrder: false,
                LanguageFk: 0,
                PaymentTermFk: 0,
                ProgressInvoiceNo: 0,
                ProjectFk: 0,
                RubricCategoryFk: 0,
                SubsidiaryFk: 0,
                TaxCodeFk: 0,
                TypeFk: 0
            }
        ]);
        const prepareParamFn = (
            service as unknown as { options: { createInfo: { prepareParam: (entity: IGeneralsEntity) => object } } }
        ).options.createInfo.prepareParam;
    
        const result = prepareParamFn({} as IGeneralsEntity);
        expect(result).toEqual({ pKey1: 123 }); 
    });
    
    it('should have correct deleteInfo configuration', () => {
        const deleteInfo = (service as unknown as { options: { deleteInfo: { endPoint: string }} }).options.deleteInfo;
        expect(deleteInfo?.endPoint).toBe('multidelete');
    });
    it('should have correct roleInfo configuration', () => {
        const roleInfo = (service as unknown as { options: { roleInfo: IDataServiceChildRoleOptions<IGeneralsEntity, IBilHeaderEntity, BilHeaderComplete> } }).options.roleInfo;
        expect(roleInfo?.role).toBe(ServiceRole.Leaf);
        expect(roleInfo?.itemName).toBe('Generals');
        expect(roleInfo?.parent).toBe(mockDataService);
    });
    it('should call getSelection on SalesBillingBillsDataService', () => {
        service['options'].createInfo.prepareParam({ id: 'testIdent' } as unknown as Readonly<IIdentificationDataMutable>);
        expect(mockDataService.getSelection).toHaveBeenCalled();
    }); 
    
    it('should set options correctly in constructor', () => {
        const options = (service as unknown as { options: IDataServiceOptions<IGeneralsEntity> }).options;    
        expect(options.apiUrl).toBe('sales/billing/generals');
        expect(options.readInfo?.endPoint).toBe('listByParent');
        expect(options.readInfo?.usePost).toBe(true); 
        // expect(options.createInfo?.prepareParam?.(mockEntity)).toEqual({ pKey1: 'testId' });
        expect(options.deleteInfo?.endPoint).toBe('multidelete');
    });
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  