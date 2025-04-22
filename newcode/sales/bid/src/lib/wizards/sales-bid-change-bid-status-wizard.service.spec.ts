/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { StatusIdentificationData } from '@libs/basics/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesBidChangeBidStatusWizardService } from '../wizards/sales-bid-change-bid-status-wizard.service';
import { SalesBidBidsDataService } from '../../lib/services/sales-bid-bids-data.service';
import { IBidHeaderEntity } from '@libs/sales/interfaces';

describe('SalesBidChangeBidStatusWizardService', () => {
    let service: SalesBidChangeBidStatusWizardService;
    let dataServiceMock: jest.Mocked<SalesBidBidsDataService>;

    beforeEach(() => {
        dataServiceMock = {
            refreshSelected: jest.fn(),
            refreshAll: jest.fn(),
        } as unknown as jest.Mocked<SalesBidBidsDataService>;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SalesBidChangeBidStatusWizardService,
                { provide: SalesBidBidsDataService, useValue: dataServiceMock },
            ],
        });
        service = TestBed.inject(SalesBidChangeBidStatusWizardService);
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
        const selection: IBidHeaderEntity[] = [
            { Id: 1, ProjectFk: 100 },
            { Id: 2, ProjectFk: null },
        ] as IBidHeaderEntity[];

        const result: StatusIdentificationData[] = service.convertToStatusIdentification(selection);
        expect(result).toEqual([
            { id: 1, projectId: 100 },
            { id: 2, projectId: undefined },
        ]);
    });

    it('should return code number from getCode', () => {
        const entity: IBidHeaderEntity = { Code: 'B123' } as IBidHeaderEntity;
        expect(service['getCode'](entity)).toBe('B123');
    });

    it('should return empty string if Code is undefined', () => {
        const entity: IBidHeaderEntity = {} as IBidHeaderEntity;
        expect(service['getCode'](entity)).toBe('');
    });

    it('should return description from getDescription', () => {
        const entity: IBidHeaderEntity = { DescriptionInfo: { Description: 'Test Desc' } } as IBidHeaderEntity;
        expect(service['getDescription'](entity)).toBe('Test Desc');
    });

    it('should return undefined if DescriptionInfo is not present', () => {
        const entity: IBidHeaderEntity = {} as IBidHeaderEntity;
        expect(service['getDescription'](entity)).toBeUndefined();
    });
});