/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SalesBillingTransactionDataService } from './sales-billing-transaction-data.service';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';

import { IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity, ITransactionEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';

describe('SalesBillingTransactionDataService', () => {
    let service: SalesBillingTransactionDataService;
    let salesBillingBillsDataService: SalesBillingBillsDataService | undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SalesBillingBillsDataService]
        });
        salesBillingBillsDataService = TestBed.inject(SalesBillingBillsDataService);
        service = TestBed.inject(SalesBillingTransactionDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have correct apiUrl', () => {
        expect(service['options'].apiUrl).toBe('sales/billing/transaction');
    });

    it('should have correct readInfo', () => {
        const readInfo = service['options'].readInfo;
        expect(readInfo.endPoint).toBe('list');
        expect(readInfo.usePost).toBe(false);
        expect(readInfo.prepareParam({
            pKey1: 123,
            id: 0
        })).toEqual({ mainItemId: 123 });
    });

    it('should have correct roleInfo', () => {
        const roleInfo = service['options'].roleInfo as IDataServiceChildRoleOptions<ITransactionEntity, IBilHeaderEntity, BilHeaderComplete>;
        expect(roleInfo.role).toBe(2);
        expect(roleInfo.itemName).toBe('BilTransaction');
        expect(roleInfo.parent).toBe(salesBillingBillsDataService);
    });

    it('should have correct entityActions', () => {
        const entityActions = service['options'].entityActions;
        expect(entityActions.createSupported).toBe(false);
        expect(entityActions.deleteSupported).toBe(false);
    });
});