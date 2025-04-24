/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementCommonItemQuantityUpdateWizardService } from '@libs/procurement/common';


@Injectable({ providedIn: 'root' })
export class ProcurementPackageValidateAndUpdateItemQuantityWizardService {
    private readonly wizardService = inject(ProcurementCommonItemQuantityUpdateWizardService);
    private readonly dataService = inject(ProcurementPackageHeaderDataService);

    public showDialog() {
        const config = {
            dataService: this.dataService,
            validateUrl: 'procurement/package/package/ValidateAndUpdateItemQuantity',
            defaultSelectedItemId: 'currentPackage',
            itemsSource: [
                { id: 'currentPackage', displayName: 'procurement.common.wizard.forCurrentPackage'},
                { id: 'currentProject', displayName: 'procurement.common.wizard.forCurrentProject'},
                { id: 'currentCompany', displayName: 'procurement.common.wizard.forCurrentLoginCompany'},
            ],
        };

        this.wizardService.showDialog(config);
    }
}