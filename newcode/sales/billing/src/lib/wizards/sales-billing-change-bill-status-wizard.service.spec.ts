import { TestBed } from '@angular/core/testing';
import { SalesBillingChangeBillStatusWizardService } from './sales-billing-change-bill-status-wizard.service';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { StatusIdentificationData } from '@libs/basics/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesBillingChangeBillStatusWizardService', () => {
    let service: SalesBillingChangeBillStatusWizardService;
    let dataServiceMock: jest.Mocked<SalesBillingBillsDataService>;

    beforeEach(() => {
        dataServiceMock = {
            refreshSelected: jest.fn(),
            refreshAll: jest.fn(),
        } as unknown as jest.Mocked<SalesBillingBillsDataService>;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SalesBillingChangeBillStatusWizardService,
                { provide: SalesBillingBillsDataService, useValue: dataServiceMock },
            ],
        });
        service = TestBed.inject(SalesBillingChangeBillStatusWizardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call startChangeStatusWizard when onStartChangeStatusWizard is called', () => {
        const spy = jest.spyOn(service, 'startChangeStatusWizard');
        service.onStartChangeStatusWizard();
        expect(spy).toHaveBeenCalled();
    });

    it('should refresh selected entity if refreshSelected is defined', () => {
        service.afterStatusChanged();
        expect(dataServiceMock.refreshSelected).toHaveBeenCalled();
    });

    it('should refresh all entities if refreshSelected is not defined', () => {
        dataServiceMock.refreshSelected = undefined;
        service.afterStatusChanged();
        expect(dataServiceMock.refreshAll).toHaveBeenCalled();
    });

    it('should convert selection to StatusIdentificationData', () => {
        const selection: IBilHeaderEntity[] = [
            { Id: 1, ProjectFk: 100 },
            { Id: 2, ProjectFk: null },
        ] as IBilHeaderEntity[];

        const result: StatusIdentificationData[] = service.convertToStatusIdentification(selection);
        expect(result).toEqual([
            { id: 1, projectId: 100 },
            { id: 2, projectId: undefined },
        ]);
    });

    it('should return bill number from getBillNo', () => {
        const entity: IBilHeaderEntity = { BillNo: 'B123' } as IBilHeaderEntity;
        expect(service['getBillNo'](entity)).toBe('B123');
    });

    it('should return empty string if BillNo is undefined', () => {
        const entity: IBilHeaderEntity = {} as IBilHeaderEntity;
        expect(service['getBillNo'](entity)).toBe('');
    });

    it('should return description from getDescription', () => {
        const entity: IBilHeaderEntity = { DescriptionInfo: { Description: 'Test Desc' } } as IBilHeaderEntity;
        expect(service['getDescription'](entity)).toBe('Test Desc');
    });

    it('should return undefined if DescriptionInfo is not present', () => {
        const entity: IBilHeaderEntity = {} as IBilHeaderEntity;
        expect(service['getDescription'](entity)).toBeUndefined();
    });
});