import { SalesBillingDocumentDataService } from './sales-billing-document-data.service';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IDocumentEntity } from '@libs/sales/interfaces';
import { IIdentificationDataMutable } from '@libs/platform/common';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('./sales-billing-bills-data.service');

describe('SalesBillingDocumentDataService', () => {
    let service: SalesBillingDocumentDataService;
    let mockDataService: jest.Mocked<SalesBillingBillsDataService>;

    beforeEach(() => {

        mockDataService = new SalesBillingBillsDataService() as jest.Mocked<SalesBillingBillsDataService>;
        mockDataService.getSelection = jest.fn().mockReturnValue([{ Id: 'test-id' }]);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: SalesBillingBillsDataService, useValue: mockDataService },
                SalesBillingDocumentDataService
            ]
        });

        service = TestBed.inject(SalesBillingDocumentDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return correct API options', () => {
        expect(service['options'].apiUrl).toBe('sales/billing/document');
        expect(service['options'].readInfo.endPoint).toBe('listByParent');
        expect(service['options'].readInfo.usePost).toBe(true);
    });

    it('should prepare correct create parameters', () => {
        const createParams = service['options'].createInfo.prepareParam({ id: 123 } as Readonly<IIdentificationDataMutable>);
        expect(createParams).toEqual({ pKey1: 'test-id' });
    });

    it('should return empty array if no documents to save', () => {
        const completeData: BilHeaderComplete = {} as BilHeaderComplete;
        const result = service.getSavedEntitiesFromUpdate(completeData);
        expect(result).toEqual([]);
    });

    it('should return DocumentsToSave when it exists', () => {
        const mockDocuments: IDocumentEntity[] = [
            { BilHeaderFk: 1, DocumentDate: '2025-01-01', DocumentTypeFk: 2, FileArchiveDocFk: 3, Id: 4, SalesDocumentTypeFk: 5 },
        ];
        const complete = new BilHeaderComplete();
        complete.DocumentsToSave = mockDocuments;

        expect(service.getSavedEntitiesFromUpdate(complete)).toEqual(mockDocuments);
    });
    
    
    it('should return empty array if DocumentsToSave is undefined', () => {
        const completeData: BilHeaderComplete = {} as BilHeaderComplete;
        const result = service.getSavedEntitiesFromUpdate(completeData);
        expect(result).toEqual([]);
    });

    it('should return empty array if complete data is null', () => {
        const result = service.getSavedEntitiesFromUpdate(null);
        expect(result).toEqual([]);
    });

    it('should return empty array if complete data is undefined', () => {
        const result = service.getSavedEntitiesFromUpdate(undefined);
        expect(result).toEqual([]);
    });
});