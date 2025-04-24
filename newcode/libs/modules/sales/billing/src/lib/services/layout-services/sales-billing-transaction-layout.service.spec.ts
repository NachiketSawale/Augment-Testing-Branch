/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SalesBillingTransactionLayoutService } from './sales-billing-transaction-layout.service';
import {
    BasicsShareControllingUnitLookupService,
    BasicsSharedCustomizeLookupOverloadProvider,
    BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';

import { SalesBillingLabels } from '../../model/sales-billing-labels.class';

import { ConcreteFieldOverload, FieldType, IFieldOverload } from '@libs/ui/common';
import { ITransactionEntity } from '@libs/sales/interfaces';

describe('SalesBillingTransactionLayoutService', () => {
    let service: SalesBillingTransactionLayoutService;
    let layoutConfig: ReturnType<SalesBillingTransactionLayoutService['generateLayout']>;

    const mockLookupProvider = {
        providePaymentTermLookupOverload: jest.fn().mockReturnValue({ mock: 'paymentTerm' }),
        provideTaxCodeListLookupOverload: jest.fn().mockReturnValue({ mock: 'taxCode' }),
    };

    const mockCustomizeLookupProvider = {
        provideVATGroupReadonlyLookupOverload: jest.fn().mockReturnValue({ mock: 'vatGroup' }),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SalesBillingTransactionLayoutService,
                { provide: BasicsSharedLookupOverloadProvider, useValue: mockLookupProvider },
                { provide: BasicsSharedCustomizeLookupOverloadProvider, useValue: mockCustomizeLookupProvider },
                { provide: BasicsShareControllingUnitLookupService, useValue: {} },
            ],
        });

        service = TestBed.inject(SalesBillingTransactionLayoutService);
        layoutConfig = service.generateLayout();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate layout configuration', () => {
        expect(layoutConfig).toBeDefined();
        expect(layoutConfig.groups.length).toBeGreaterThan(0);
    });

    it('should include correct labels in layout', () => {
        expect(layoutConfig.labels).toEqual(SalesBillingLabels.getSalesBillingLabels());
    });

    it('should set ControllingUnitIcFk lookup options correctly', () => {
        const controllingUnitIcFk = layoutConfig.overloads?.ControllingUnitIcFk;
        expect(controllingUnitIcFk).toBeDefined();
        expect((controllingUnitIcFk as IFieldOverload<ITransactionEntity>)?.readonly).toBe(true);
        expect((controllingUnitIcFk as ConcreteFieldOverload<ITransactionEntity>)?.type).toBe(FieldType.Lookup);
    });

    it('should make all attributes readonly', () => {
        const keys = Object.keys(layoutConfig.overloads || {});
        expect(keys.length).toBeGreaterThan(0);
        expect((layoutConfig.overloads?.[keys[0]] as IFieldOverload<ITransactionEntity>)?.readonly).toBe(true);
    });
});