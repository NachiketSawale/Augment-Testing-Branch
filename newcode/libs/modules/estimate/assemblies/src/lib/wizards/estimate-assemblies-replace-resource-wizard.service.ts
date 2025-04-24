/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EstimateReplaceResource} from '@libs/estimate/interfaces';
import {
    EstimateMainReplaceResourceUiService,
    EstimateMainWizardContextService
} from '@libs/estimate/shared';
import {UiCommonFormDialogService} from '@libs/ui/common';
import {EstimateAssembliesResourceDataService} from '../containers/resource/estimate-assemblies-resource-data.service';

@Injectable({
    providedIn: 'root'
})
export class EstimateAssembliesReplaceResourceWizardService{
    private initDataItem: EstimateReplaceResource = {
        FunctionTypeFk: 111,
        ResourceTypeId:11,
        estimateScope: 1
    };

    private readonly estimateMainReplaceResourceUiService = inject(EstimateMainReplaceResourceUiService);
    private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly estimateMainWizardContextService = inject(EstimateMainWizardContextService);

    public constructor(private estimateAssembliesResourceDataService: EstimateAssembliesResourceDataService){}

    /**
     * show wizard
     */
    public showReplaceResourceWizardDialog(){
        this.estimateMainWizardContextService.setConfig('estimate.assemblies');
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
        const result = this.formDialogService.showDialog<EstimateReplaceResource>({
            id: 'estimateAssemblyReplaceResourceWizard',
            headerText: 'estimate.main.replaceResourceWizard.configTitle',
            formConfiguration: this.estimateMainReplaceResourceUiService.getReplacementFormConfig(null, null, this.estimateAssembliesResourceDataService, null),
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
