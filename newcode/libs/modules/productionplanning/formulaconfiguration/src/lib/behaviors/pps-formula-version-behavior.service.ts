/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsFormulaVersionEntity } from '../model/models';
import { PpsFormulaVersionDataService } from '../services/pps-formula-version-data.service';
import { ISimpleMenuItem, InsertPosition, ItemType } from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class PpsFormulaVersionBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsFormulaVersionEntity>, IPpsFormulaVersionEntity> {
    private dataService = inject(PpsFormulaVersionDataService);
    private changeStatusBtn: ISimpleMenuItem<void> = {
        id: 'changeStatus',
        sort: 1,
        caption: 'productionplanning.formulaconfiguration.version.changeStatus',
        type: ItemType.Item,
        iconClass: 'tlb-icons ico-change-status',
        fn: function () {
            throw new Error('todo');
            // // make sure the script is valid before released.
            // const script = ppsFormulaVersionDataService.getSelected().ClobToSave.Content;
            // const errors = $injector.get('ppsFormulaScriptDataService').validateScript(script, false);
            // if (errors.length > 0) {
            //     return;
            // }
            // $rootScope.$emit('before-save-entity-data');
            // platformGridAPI.grids.commitAllEdits();
            // ppsFormulaVersionDataService.parentService().update().then(function () {
            //     ppsFormulaVersionDataService.changeStatus().then(function (result) {
            //         let selected = ppsFormulaVersionDataService.getSelected();
            //         platformGridAPI.items.data($scope.gridId, result.data);
            //         if (selected) {
            //             platformGridAPI.rows.selection({
            //                 gridId: $scope.gridId,
            //                 rows: angular.isArray(selected) ? selected : [selected]
            //             });
            //         }
            //     });
            //     return $rootScope.$emit('after-save-entity-data');
            // });
        },
        disabled: () => {
            return !this.dataService.hasSelection();
        }
    };
    private copyVersionBtn: ISimpleMenuItem<void> = {
        id: 'copy',
        sort: 2,
        caption: 'productionplanning.formulaconfiguration.version.copyVersion',
        type: ItemType.Item,
        iconClass: 'tlb-icons ico-workflow-copy-version',
        fn: function () {
            throw new Error('todo');
            // const selected = this.dataService.getSelected();
            // this.dataService.copyVersion(selected).then(response => {
            //     if (response && response.data) {
            //         var items = this.dataService.getList();
            //         items.push(response.data);
            //         var versionGridId  = '7d65f3bd54224873bef7ef881eeab365';
            //         platformGridAPI.rows.add({gridId: versionGridId, item: response.data});
            //         this.dataService.setSelected(response.data);
            //     }
            // });
        },
        disabled: () => {
            return !this.dataService.hasSelection();
        }
    };

    public onCreate(containerLink: IGridContainerLink<IPpsFormulaVersionEntity>): void {
        containerLink.uiAddOns.toolbar.addItemsAtId([this.changeStatusBtn, this.copyVersionBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
    }
}