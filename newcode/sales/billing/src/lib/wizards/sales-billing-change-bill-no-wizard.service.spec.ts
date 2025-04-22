import { TestBed } from '@angular/core/testing';
import { SalesBillingChangeBillNoWizardService } from './sales-billing-change-bill-no-wizard.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { SalesCommonChangeCodeService } from '@libs/sales/common';

jest.mock('@libs/ui/common');
jest.mock('@libs/platform/common');
jest.mock('../services/sales-billing-bills-data.service');
jest.mock('@libs/sales/common');

describe('SalesBillingChangeBillNoWizardService', () => {
    let service: SalesBillingChangeBillNoWizardService;
    let messageBoxService: UiCommonMessageBoxService;
    let translateService: PlatformTranslateService;
    let headerDataService: SalesBillingBillsDataService;
    let salesCommonChangeCodeWizardService: SalesCommonChangeCodeService;

    beforeEach(() => {
        messageBoxService = new UiCommonMessageBoxService();
        translateService = new PlatformTranslateService();
        headerDataService = new SalesBillingBillsDataService();
        salesCommonChangeCodeWizardService = new SalesCommonChangeCodeService();

        jest.spyOn(messageBoxService, 'showMsgBox');
        jest.spyOn(headerDataService, 'getSelectedEntity');
        jest.spyOn(salesCommonChangeCodeWizardService, 'showChangeCodeDialog');

        TestBed.configureTestingModule({
            providers: [
                SalesBillingChangeBillNoWizardService,
                { provide: UiCommonMessageBoxService, useValue: messageBoxService },
                { provide: PlatformTranslateService, useValue: translateService },
                { provide: SalesBillingBillsDataService, useValue: headerDataService },
                { provide: SalesCommonChangeCodeService, useValue: salesCommonChangeCodeWizardService }
            ]
        });

        service = TestBed.inject(SalesBillingChangeBillNoWizardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show warning message if no entity is selected', () => {
        (headerDataService.getSelectedEntity as jest.Mock).mockReturnValue(null);

        service.changeBillNo();

        expect(messageBoxService.showMsgBox).toHaveBeenCalledWith(
            'cloud.common.noCurrentSelection',
            'sales.billing.billNoChangeWizardTitle',
            'ico-warning'
        );
        expect(salesCommonChangeCodeWizardService.showChangeCodeDialog).not.toHaveBeenCalled();
    });

    it('should call showChangeCodeDialog when entity is selected', () => {
        const selectedEntity = { id: 1, billNo: 'B123' };
        (headerDataService.getSelectedEntity as jest.Mock).mockReturnValue(selectedEntity);

        service.changeBillNo();

        expect(salesCommonChangeCodeWizardService.showChangeCodeDialog).toHaveBeenCalledWith('billing', selectedEntity);
        expect(messageBoxService.showMsgBox).not.toHaveBeenCalled();
    });
});