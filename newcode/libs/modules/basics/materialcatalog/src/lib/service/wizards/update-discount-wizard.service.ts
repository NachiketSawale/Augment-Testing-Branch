/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {UiCommonMessageBoxService} from '@libs/ui/common';
import {IExceptionResponse, PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {
    BasicsMaterialCatalogDiscountGroupDataService
} from '../../discount-group/basics-material-catalog-discount-group-data.service';

/**
 * Update discount wizard
 */
@Injectable({
    providedIn: 'root'
})
export class UpdateDiscountWizardService {

    private readonly http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly discountGroupDataService = inject(BasicsMaterialCatalogDiscountGroupDataService);

    public async start() {
        const selection = this.discountGroupDataService.getSelection();

        if (selection.length) {
            let response;

            try {
                response = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'basics/material/updatediscount', selection[0]));
            } catch (e) {
                await this.messageBoxService.showErrorDialog(e as IExceptionResponse);
            }

            await this.messageBoxService.showMsgBox({
                backdrop: false,
                keyboard: true,
                headerText: {
                    key: 'basics.materialcatalog.Wizard.Title'
                },
                bodyText: {
                    key: 'basics.materialcatalog.Wizard.Message',
                    params: {
                        p_0: response
                    }
                },
                windowClass: 'update-discount-wizard-dialog'
            });
        }
    }

}