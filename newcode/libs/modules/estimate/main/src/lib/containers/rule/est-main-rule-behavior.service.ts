/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IEstMainRuleEntity} from '@libs/estimate/interfaces';
import {Subscription} from 'rxjs';
import {PlatformModuleNavigationService} from '@libs/platform/common';
import {EstimateMainRuleDataService} from './est-main-rule-data.service';
@Injectable({
    providedIn: 'root'
})
export class EstimateMainRuleBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstMainRuleEntity>, IEstMainRuleEntity> {

    private dataService: EstimateMainRuleDataService;
    private subscriptions: Subscription[] = [];
    private readonly naviService = inject(PlatformModuleNavigationService);

    public constructor() {
        this.dataService = inject(EstimateMainRuleDataService);
    }

    public onCreate(containerLink: IGridContainerLink<IEstMainRuleEntity>): void {
        const dataSub = this.dataService.listChanged$.subscribe(data => {
            containerLink.gridData = data;
        });
        this.subscriptions.push(dataSub);
        this.customizeToolbar(containerLink);
        this.dataService.init();
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstMainRuleEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
    }

    public navigateToRuleScript(){
        // let ruleSelected = this.dataService.getSelectedEntity();
        // let navigator = null;
        // TODO navigate
        // if (ruleSelected.IsPrjRule){
        //     navigator = this.naviService.getNavigator('project.main-estimate-rule-script');
        // }else{
        //     navigator =this. naviService.getNavigator('estimate.rule-script');
        // }
        // this.naviService.navigate(navigator, null, dataService);
    }

    // TODO clearCache and event register
    private refresh(){
        // ruleDataService.clearCache();
        this.dataService.init();
    }

    // platformGridAPI.events.register($scope.gridId, 'onDblClick', navigateToRuleScript);
    // estimateMainService.registerRefreshRequested(refresh);

    public onDestroy(containerLink: IGridContainerLink<IEstMainRuleEntity>): void {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
        // platformGridAPI.events.unregister($scope.gridId, 'onDblClick', navigateToRuleScript);
        // estimateMainService.unregisterRefreshRequested(refresh);
    }
}