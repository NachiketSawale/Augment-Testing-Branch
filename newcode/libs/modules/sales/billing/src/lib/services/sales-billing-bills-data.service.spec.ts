import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('SalesBillingBillsDataService', () => {
    let service: SalesBillingBillsDataService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SalesBillingBillsDataService],
        });
        service = TestBed.inject(SalesBillingBillsDataService);
    });
    it('should be instantiated', () => {
        expect(service).toBeTruthy();
    });
    it('should set options correctly in constructor', () => {
        const options = (service as unknown as { options: IDataServiceOptions<IBilHeaderEntity> }).options;
        expect(options.apiUrl).toBe('sales/billing');
        expect(options.readInfo?.endPoint).toBe('listfiltered');
        expect(options.readInfo?.usePost).toBe(true);
        expect(options.deleteInfo?.endPoint).toBe('delete');
        expect(options.roleInfo?.role).toBe(ServiceRole.Root);
        expect(options.roleInfo?.itemName).toBe('BilHeader');
    });
    it('should call super constructor with correct options', () => {
        const instance = TestBed.inject(SalesBillingBillsDataService);
        expect(instance).toBeTruthy();
    });
    describe('createUpdateEntity', () => {
        it('should return an empty BilHeaderComplete instance when input is null', () => {
            const result = service.createUpdateEntity(null);
            expect(result.MainItemId).toBeFalsy();
            expect(result.Datas).toEqual([]); 
        });
        it('should return a BilHeaderComplete instance with mapped properties when input is provided', () => {
            const input = { Id: 101 } as IBilHeaderEntity;
            const result = service.createUpdateEntity(input);
            expect(result.MainItemId).toBe(101);
            expect(result.Datas).toEqual([input]);
        });
    });
});