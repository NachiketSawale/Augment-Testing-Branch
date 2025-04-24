import {inject, Injectable} from '@angular/core';
import {
    StandardDialogButtonId,
    UiCommonMessageBoxService
} from '@libs/ui/common';
import {firstValueFrom} from 'rxjs';

import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {ControllingActualsCostHeaderDataService} from '../../controlling-actuals-cost-header-data.service';



@Injectable({
    providedIn: 'root'
})
export class ControllingActualsUpdateControllingCostCodeService{

    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly controllingActualsCostHeaderDataService =inject(ControllingActualsCostHeaderDataService);
    public showDialog(): void{
        let selectedEntity =  this.controllingActualsCostHeaderDataService.getSelectedEntity();
        if(!selectedEntity){
            return;
        }
        this.messageBoxService.showYesNoDialog({
            headerText: 'controlling.actuals.updateControllingCostCodesTitle',
            bodyText: 'Update Controlling Cost Codes ' + selectedEntity?.Code + '?',
            defaultButtonId: StandardDialogButtonId.Yes
        })
            ?.then((result) => {
                if (result.closingButtonId === StandardDialogButtonId.Yes) {
                    this.http.post(`${this.configService.webApiBaseUrl}controlling/actuals/wizard/updatecontrollingcostcodes?headerId=${selectedEntity?.Id}`, null).subscribe(() => {
                        this.controllingActualsCostHeaderDataService.refreshAll();
                    });
                }
            });
    }
}