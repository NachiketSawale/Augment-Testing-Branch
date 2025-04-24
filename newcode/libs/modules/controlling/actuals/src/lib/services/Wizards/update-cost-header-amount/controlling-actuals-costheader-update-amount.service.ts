import {inject, Injectable} from '@angular/core';
import {
    StandardDialogButtonId,
    UiCommonMessageBoxService
} from '@libs/ui/common';


import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {ControllingActualsCostHeaderDataService} from '../../controlling-actuals-cost-header-data.service';



@Injectable({
    providedIn: 'root'
})
export class ControllingActualsUpdateCostHeaderAmountService{

    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly controllingActualsCostHeaderDataService =inject(ControllingActualsCostHeaderDataService);
    public showDialog(): void{
        const selectedEntity =  this.controllingActualsCostHeaderDataService.getSelectedEntity();
        if(!selectedEntity){
            return;
        }
        this.messageBoxService.showYesNoDialog({
            headerText: 'controlling.actuals.updateCostHeaderAmount',
            bodyText: 'Update Cost Header Amount- Company' + selectedEntity?.Code + '?',
            defaultButtonId: StandardDialogButtonId.Yes
        })
            ?.then((result) => {
                if (result.closingButtonId === StandardDialogButtonId.Yes) {
                    this.http.post(`${this.configService.webApiBaseUrl}controlling/actuals/wizard/updatecontrollingcostcodes?headerId=${selectedEntity?.CompanyFk}`, null).subscribe(() => {
                        this.controllingActualsCostHeaderDataService.refreshAll();
                    });
                }
            });
    }
}