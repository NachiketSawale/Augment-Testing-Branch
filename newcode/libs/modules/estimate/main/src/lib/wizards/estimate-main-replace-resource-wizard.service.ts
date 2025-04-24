/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { UiCommonFormDialogService} from '@libs/ui/common';
import {EstimateReplaceResource} from '@libs/estimate/interfaces';
import {
    EstimateMainContextService,
    EstimateMainReplaceResourceUiService,
    EstimateMainWizardContextService
} from '@libs/estimate/shared';
import {EstimateMainResourceService} from '../containers/resource/estimate-main-resource-data.service';
import {EstimateMainService} from '../containers/line-item/estimate-main-line-item-data.service';

// TODO: Will be done in the future
@Injectable({
    providedIn: 'root'
})
export class EstimateMainReplaceResourceWizardService{
    private initDataItem: EstimateReplaceResource = {
        FunctionTypeFk: 111,
        ResourceTypeId:11,
        estimateScope: 1
    };
    private readonly estimateMainReplaceResourceUiService = inject(EstimateMainReplaceResourceUiService);
    private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private readonly estimateMainWizardContextService = inject(EstimateMainWizardContextService);

    public constructor(private estimateMainService: EstimateMainService, private estimateMainResourceService: EstimateMainResourceService) { }

    public showReplaceResourceWizardDialog(){
        this.estimateMainWizardContextService.setConfig('estimate.main');
        // TODO: Wait for related service
        // if(estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource)
        // {
        //     let selectedResourceItem = $injector.get('estimateAssembliesResourceService').getSelected() || {};
        //     switch (selectedResourceItem.EstResourceTypeFk){
        //         case estimateMainResourceType.CostCode:{
        //             q = estimateMainLookupService.getEstCostCodesTreeForAssemblies();
        //             break;
        //         }
        //         case estimateMainResourceType.Material:{
        //             q = $injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree(true);
        //             break;
        //         }
        //         case estimateMainResourceType.Plant:{
        //             q = $injector.get('estimateMainPlantAssemblyDialogService').getAssemblyByIdAsync(selectedResourceItem.EstAssemblyFk, true);
        //             break;
        //         }
        //         case estimateMainResourceType.Assembly:{
        //             q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies();
        //             break;
        //         }
        //     }
        // }
        // else{
        //     // will load lookup data into cache first
        //     let selectedResourceItem = $injector.get('estimateMainResourceService').getSelected() || {};
        //     let estHeaderInfo =  $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
        //     let estHeader = !estHeaderInfo ? null : estHeaderInfo.id;
        //
        //     switch (selectedResourceItem.EstResourceTypeFk){
        //         case estimateMainResourceType.CostCode:{
        //             q = estimateMainLookupService.loadPrjCostCodeNEstCostCode(true, estHeader);
        //             break;
        //         }
        //         case estimateMainResourceType.Material:{
        //             q = $injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree(true);
        //             break;
        //         }
        //         case estimateMainResourceType.Plant:{
        //             q = $injector.get('estimateMainPlantAssemblyDialogService').getAssemblyByIdAsync(selectedResourceItem.EstAssemblyFk, true);
        //             break;
        //         }
        //         case estimateMainResourceType.Assembly:{
        //             q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies()
        //             break;
        //         }
        //         case estimateMainResourceType.SubItem:{
        //             if(selectedResourceItem.EstAssemblyFk){
        //                 q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies();
        //             }
        //             break;
        //         }
        //     }
        // }
        const estimateLineItems = this.estimateMainService.getList();
        this.initDataItem.EstHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
        const result = this.formDialogService.showDialog<EstimateReplaceResource>({
            id: 'estimateMainReplaceResourceWizard',
            headerText: 'estimate.main.replaceResourceWizard.configTitle',
            formConfiguration: this.estimateMainReplaceResourceUiService.getReplacementFormConfig(null, null, this.estimateMainResourceService, estimateLineItems),
            runtime: undefined,
            showOkButton: false,
            customButtons: [{
                id: 'execute',
                caption: 'Execute',
                // TODO:
                // fn: (event, info) => {
                //     console.log('test');
                // }
            }],
            topDescription: '',
            entity: this.initDataItem,
        });

        return result;
    }
}