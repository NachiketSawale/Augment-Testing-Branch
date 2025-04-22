/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { SalesBillingAccrualLayoutService } from './sales-billing-accrual-layout.service';


describe('SalesBillingAccrualLayoutService', () => {
	let service: SalesBillingAccrualLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SalesBillingAccrualLayoutService],
		});

		service = TestBed.inject(SalesBillingAccrualLayoutService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
	it('should generate layout configuration', async () => {
		const layoutConfig = await service.generateLayout();
		expect(layoutConfig).toBeTruthy();
		expect(layoutConfig.groups.length).toBeGreaterThan(0);
		expect(layoutConfig.labels).toBeTruthy();
		expect(layoutConfig.overloads).toBeTruthy();
	});

	it('should have correct group configuration', async () => {
		const layoutConfig = await service.generateLayout();
		const group = layoutConfig.groups.find((g) => g.gid === 'basicData');
		expect(group).toBeTruthy();
        expect(group?.title).toEqual({key: 'cloud.common.entityProperties', text: 'Basic Data'});
		expect(group?.attributes).toContain('DateEffective');
		expect(group?.attributes).toContain('CompanyTransactionFk');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.Currency');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.CompanyTransheaderFk');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.PostingDate');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.DocumentType');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.VoucherNumber');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.VoucherDate');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetAccount');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.PostingNarritive');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.Amount');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.AmountOc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.Quantity');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitCode');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign01');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign01Desc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign02');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign02Desc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign03');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign03Desc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign04');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign04Desc');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign05');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign05Desc');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign06');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign06Desc');    
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign07');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.ControllingUnitAssign07Desc');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign08');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign08Desc');
        expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign09');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign09Desc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign10');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.OffsetContUnitAssign10Desc');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.NominalDimension');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.TaxCode');
		expect(group?.additionalAttributes).toContain('CompanyTransaction.PostingArea');
	});

	it('should have correct labels configuration', async () => {
		const layoutConfig = await service.generateLayout();
		const labels = layoutConfig.labels;

		expect(labels).toBeDefined();
		expect(labels['DateEffective']).toEqual({
			key: 'basics.common.dateEffective', 
			text: 'Date Effective',
		});
		expect(labels['CompanyTransactionFk']).toEqual({
			key: 'sales.wip.entityCompanyTransactionFk', 
			text: 'Company Transaction',
		});
		expect(labels['CompanyTransaction.CompanyTransHeader']).toEqual({
			key: 'sales.wip.transaction.transHeader', 
			text: 'Transaction Header',
		});
		expect(labels['CompanyTransaction.PostingDate']).toEqual({
			key: 'sales.wip.transaction.postingDate', 
			text: 'Posting Date',
		});
        expect(labels['CompanyTransaction.Account']).toEqual({
			key: 'sales.wip.transaction.account', 
			text: 'Account',
		});
		expect(labels['CompanyTransaction.DocumentType']).toEqual({
			key: 'sales.wip.transaction.documentType', 
			text: 'Document Type',
		});
        expect(labels['CompanyTransaction.Currency']).toEqual({
			key: 'sales.wip.transaction.currency', 
			text: 'Currency',
		});
		expect(labels['CompanyTransaction.VoucherNumber']).toEqual({
			key: 'sales.wip.transaction.voucherNumber', 
			text: 'Voucher Number',
		});
		expect(labels['CompanyTransaction.VoucherDate']).toEqual({
			key: 'sales.wip.transaction.voucherDate', 
			text: 'Voucher Date',
		});
		expect(labels['CompanyTransaction.OffsetAccount']).toEqual({
			key: 'sales.wip.transaction.offsetAccount', 
			text: 'Offset Account',
		});
		expect(labels['CompanyTransaction.PostingNarritive']).toEqual({
			key: 'sales.wip.transaction.postingNarritive', 
			text: 'Posting Narritive',
		});
		expect(labels['CompanyTransaction.Amount']).toEqual({
			key: 'sales.wip.transaction.amount', 
			text: 'Amount',
		});
		expect(labels['CompanyTransaction.AmountOc']).toEqual({
			key: 'sales.wip.transaction.amountOc', 
			text: 'Amount Oc',
		});
		expect(labels['CompanyTransaction.Quantity']).toEqual({
			key: 'sales.wip.transaction.quantity', 
			text: 'Quantity',
		});
		expect(labels['CompanyTransaction.ControllingUnitCode']).toEqual({
			key: 'sales.wip.transaction.controllingUnitCode', 
			text: 'Controlling Unit Code',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign01']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign01', 
			text: 'Controlling Unit Assign 01',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign01Desc']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign01Desc', 
			text: 'Controlling Unit Assign 01 Desc',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign02']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign02', 
			text: 'Controlling Unit Assign 02',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign02Desc']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign02Desc', 
			text: 'Controlling Unit Assign 02 Desc',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign03']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign03', 
			text: 'Controlling Unit Assign 03',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign03Desc']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign03Desc', 
			text: 'Controlling Unit Assign 03 Desc',
		});
		expect(labels['CompanyTransaction.ControllingUnitAssign04']).toEqual({
			key: 'sales.wip.transaction.controllingUnitAssign04', 
			text: 'Controlling Unit Assign 04',
		});
		expect(labels['CompanyTransaction.OffsetContUnitAssign08Desc']).toEqual({
			key: 'sales.wip.transaction.offsetContUnitAssign08Desc', 
			text: 'Offset Controlling Unit Assign 08 Description',
		});
		expect(labels['CompanyTransaction.OffsetContUnitAssign09']).toEqual({
			key: 'sales.wip.transaction.offsetContUnitAssign09', 
			text: 'Offset Controlling Unit Assign 09',
		});
		expect(labels['CompanyTransaction.OffsetContUnitAssign09Desc']).toEqual({
			key: 'sales.wip.transaction.offsetContUnitAssign09Desc', 
			text: 'Offset Controlling Unit Assign 09 Description',
		});
		expect(labels['CompanyTransaction.OffsetContUnitAssign10']).toEqual({
			key: 'sales.wip.transaction.offsetContUnitAssign01', 
			text: 'Offset Controlling Unit Assign 10',
		});
		expect(labels['CompanyTransaction.OffsetContUnitAssign10Desc']).toEqual({
			key: 'sales.wip.transaction.offsetContUnitAssign10Desc', 
			text: 'Offset Controlling Unit Assign 10 Description',
		});
		expect(labels['CompanyTransaction.NominalDimension']).toEqual({
			key: 'sales.wip.transaction.nominalDimension', 
			text: 'Nominal Dimension',
		});
		expect(labels['CompanyTransaction.TaxCode']).toEqual({
			key: 'sales.wip.transaction.taxCode', 
			text: 'Tax Code',
		});
		expect(labels['CompanyTransaction.PostingArea']).toEqual({
			key: 'sales.wip.transaction.postingArea', 
			text: 'Posting Area',
		});
	});

    it('should have correct overloads configuration', async () => {
        const layoutConfig = await service.generateLayout();
        const overloads = layoutConfig.overloads;
        expect(overloads).toBeDefined();
        expect(overloads.DateEffective).toMatchObject({
            readonly:true,
            type:'dateutc',
        });
        expect(overloads.CompanyTransactionFk).toMatchObject({
            readonly:true,
        });

    });
 
});
