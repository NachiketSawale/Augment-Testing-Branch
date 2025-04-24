import { TestBed } from '@angular/core/testing';
import { SalesBillingItemDataService } from './sales-billing-item-data.service';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IBilHeaderEntity, IItemEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('./sales-billing-bills-data.service');

describe('SalesBillingItemDataService', () => {
    let service: SalesBillingItemDataService;
    let parentService: jest.Mocked<SalesBillingBillsDataService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
            providers: [
                SalesBillingItemDataService,
                { provide: SalesBillingBillsDataService, useValue: new SalesBillingBillsDataService() }				
            ]
        });
        parentService = TestBed.inject(SalesBillingBillsDataService) as jest.Mocked<SalesBillingBillsDataService>;
        service = TestBed.inject(SalesBillingItemDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

	
    it('should have correct API URL', () => {
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
        expect(options.apiUrl).toBe('sales/billing/item');
    });

    it('should have correct readInfo settings', () => {
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
        expect(options.readInfo?.endPoint).toBe('list');
        expect(options.readInfo?.usePost).toBe(false);
    });

    it('should correctly prepare parameters in readInfo', () => {
        const ident = { id: 1, pKey1: 123 };
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
        const params = options.readInfo?.prepareParam?.(ident);
        expect(params).toEqual({ mainItemId: 123 });
    });

    it('should have correct createInfo settings', () => {
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
        expect(options.createInfo?.endPoint).toBe('create');
    });

    it('should have correct updateInfo settings', () => {
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
        expect(options.updateInfo?.endPoint).toBe('update');
    });

    it('should have correct roleInfo settings', () => {
		const options = service['options'] as IDataServiceOptions<IItemEntity>;
		const roleInfo = options.roleInfo as IDataServiceChildRoleOptions<IItemEntity, IBilHeaderEntity, BilHeaderComplete>;
        expect(roleInfo.role).toBe(ServiceRole.Leaf);
        expect(roleInfo.itemName).toBe('BilItem');
        expect(roleInfo.parent).toBe(parentService);
    });
});
