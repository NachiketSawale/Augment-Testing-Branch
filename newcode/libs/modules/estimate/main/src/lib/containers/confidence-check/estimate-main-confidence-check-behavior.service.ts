/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEstConfidenceCheckEntity } from '@libs/estimate/interfaces';
import {ItemType} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})

/**
 * Behaviour Service for confidence check container customizing tools
 */
export class EstimateMainConfidenceCheckBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstConfidenceCheckEntity>, IEstConfidenceCheckEntity> {
    public onCreate(containerLink: IGridContainerLink<IEstConfidenceCheckEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstConfidenceCheckEntity>) {

        //TODO once framework generic structure service is ready need to check, we can remove below toolbar items
        containerLink.uiAddOns.toolbar.addItems([
            {
                id: 't111',
                sort: 112,
                caption: 'cloud.common.gridlayout',
                iconClass: 'tlb-icons ico-settings',
                type: ItemType.Item
             /*   fn: function () {
                    platformGridAPI.configuration.openConfigDialog($scope.getContainerUUID());
                },
                disabled: function () {
                    return $scope.showInfoOverlay;
                }*/
            },
            {
                id: 't1',
                sort: 110,
                caption: 'cloud.common.taskBarSearch',
                type: ItemType.Check,
                value: false,
                iconClass: 'tlb-icons ico-search'
                //TODO
                /*  fn: function () {
                }
                   platformGridAPI.filters.showSearch($scope.getContainerUUID(), this.value);
                },
                disabled: function () {
                    return $scope.showInfoOverlay;
                }*/
            },
            {
                id: 't109',
                sort: 111,
                caption: 'cloud.common.print',
                iconClass: 'tlb-icons ico-print-preview',
                type: ItemType.Item,
                //TODO
               /* fn: function () {
                    reportingPrintService.printGrid($scope.getContainerUUID());
                },
                disabled: function () {
                    return $scope.showInfoOverlay;
                }*/
            },
            {
                id: 'd1',
                sort: 55,
                type: ItemType.Divider
            },
            {
                id: 't7',
                sort: 60,
                caption: 'cloud.common.toolbarCollapse',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-tree-collapse',
                //TODO
               /* fn: function collapseSelected() {
                    platformGridAPI.rows.collapseNextNode($scope.getContainerUUID());
                }*/
            },
            {
                id: 't8',
                sort: 70,
                caption: 'cloud.common.toolbarExpand',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-tree-expand',
                //TODO
               /* fn: function expandSelected() {
                    platformGridAPI.rows.expandNextNode($scope.getContainerUUID());
                }*/
            },
            {
                id: 't9',
                sort: 80,
                caption: 'cloud.common.toolbarCollapseAll',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-tree-collapse-all',
                //TODO
               /* fn: function collapseAll() {
                    platformGridAPI.rows.collapseAllSubNodes($scope.getContainerUUID());
                }*/
            },
            {
                id: 't10',
                sort: 90,
                caption: 'cloud.common.toolbarExpandAll',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-tree-expand-all',
                //TODO
               /* fn: function expandAll() {
                    platformGridAPI.rows.expandAllSubNodes($scope.getContainerUUID());
                }*/
            },
            {
                id: 'd2',
                sort: 100,
                type: ItemType.Divider
            },
            {
                id: 't11',
                sort: 200,
                caption: 'cloud.common.toolbarRefresh',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-refresh',
                //TODO
               /* fn: function refresh() {
                    estimateMainConfidenceCheckService.refresh();
                }*/
            },
            {
                id: 't11',
                sort: 110,
                caption: 'cloud.common.toolbarFilter',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-filter-off',
                //TODO
               /* disabled: () => !platformGenericStructureService.isFilterEnabled(),
                fn: function filterOff() {
                    platformGenericStructureService.removeMarkers();
                    platformGridAPI.grids.refresh($scope.getContainerUUID());
                    platformGenericStructureService.clearFilteredItems();
                    platformGenericStructureService.enableFilter(false);
                    $rootScope.$emit('filterIsActive', false);
                    $scope.tools.update();
                    platformGenericStructureService.dataService.refresh(); // ALM # 93005 force refresh after filter is switch off rei@4.10.19
                }*/
            },
            {
                id: 'd3',
                sort: 100,
                type: ItemType.Divider,
            },
            {
                id: 't12',
                sort: 120,
                caption: 'cloud.common.toolbarSelectionMode',
                type: ItemType.Check,
               // value: $scope.options.marker.multiSelect,
                iconClass: 'tlb-icons ico-selection-multi',
                fn: function toogleSelectionMode() {
                    //TODO
                 /*   if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
                        // get marker/filter column def ...
                        let cols = platformGridAPI.columns.configuration($scope.getContainerUUID());
                        let filterCol = _.find(cols.current, {id: 'marker'});
                        if (filterCol && filterCol.editorOptions) {
                            // ... switch multiselect and save
                            filterCol.editorOptions.multiSelect = !filterCol.editorOptions.multiSelect;
                            $scope.options.marker.multiSelect = !$scope.options.marker.multiSelect;
                            platformGenericStructureService.postProcessColumns($scope.getContainerUUID(), 'current');
                            platformGridAPI.columns.configuration($scope.getContainerUUID(), cols.current);
                            platformGenericStructureService.removeMarkers();
                            platformGridAPI.grids.refresh($scope.getContainerUUID());
                            platformGenericStructureService.clearFilteredItems();
                            $rootScope.$emit('filterIsActive', false);
                            platformGenericStructureService.enableFilter(false);
                            $scope.tools.update();
                        }
                    }*/
                }
            }
        ]);
    }
}