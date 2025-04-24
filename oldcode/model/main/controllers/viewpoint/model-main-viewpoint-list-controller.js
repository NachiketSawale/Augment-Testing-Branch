/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

    'use strict';
    const moduleName = 'model.main';

    angular.module(moduleName).controller('modelMainViewpointListController', ['$scope', '$translate',
        'platformContainerControllerService', 'modelViewerViewerRegistryService',
        'modelMainViewpointDataService','modelMainContainerInformationService','$injector',
        function ($scope, $translate,
                  platformContainerControllerService, modelViewerViewerRegistryService,
                  modelMainViewpointDataService,modelMainContainerInformationService,$injector) {

	        const containerUuid = '17c46d111cd44732827332315ea206ed';

	        const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
	        if (depAnnoDataServiceName) {
		        modelMainContainerInformationService.overrideOnce(containerUuid, {
			        dataServiceName: depAnnoDataServiceName
		        });
	        }

	        const dataService = _.isString(depAnnoDataServiceName) ? $injector.get(depAnnoDataServiceName) : modelMainViewpointDataService;

	        platformContainerControllerService.initController($scope, moduleName, containerUuid);

	        const addFromViewerGroup = {
                id: 'addFromViewer',
                type: 'sublist',
                list: {
                    items: []
                }
            };

	        /*
				const updateViewOptionsGroup = {
					 id: 'updateViewOptions',
					 type: 'sublist',
					 list: {
						  items: [
								platformMenuListUtilitiesService.createToggleItemForObservable({
									 value: dataService.overwriteBlacklist,
									 toolsScope: $scope
								}), platformMenuListUtilitiesService.createToggleItemForObservable({
									 value: dataService.cuttingPlanes,
									 toolsScope: $scope
								})]
					 }
				};
				*/

            // TODO: how to retrieve toolbar ID?
            // toolbarCommonService.updateItemsById(containerUuid, addFromViewerGroup, 'create');
            $scope.tools.items.splice(0, 2, addFromViewerGroup);
            //$scope.tools.items.splice(3, 1, updateViewOptionsGroup);
            $scope.tools.update();

            function updateViewers() {
                addFromViewerGroup.list.items = _.map(modelViewerViewerRegistryService.getViewers(), function (v) {
                    return {
                        id: 'createFromViewer' + v.name,
                        type: 'item',
                        iconClass: v.addIconClass,
                        caption: $translate.instant('model.main.createViewpointFromSource', {
                            source: v.getDisplayName()
                        }),
                        fn: () => dataService.createFromViewer(v)//,
                        //disabled: () => !dataService.canCreateFromViewer(v)
                    };
                });

                $scope.tools.update();
            }

            modelViewerViewerRegistryService.onViewersChanged.register(updateViewers);
            updateViewers();

            function updateViewersState() {
                $scope.tools.update();
            }

            modelViewerViewerRegistryService.registerViewerReadinessChanged(updateViewersState);
            //dataService.getParentDataService().registerSelectionChanged(updateViewersState);

            $scope.$on('$destroy', function () {
                modelViewerViewerRegistryService.unregisterViewerReadinessChanged(updateViewersState);
                //dataService.getParentDataService().unregisterSelectionChanged(updateViewersState);
                modelViewerViewerRegistryService.onViewersChanged.unregister(updateViewers);
            });
        }]);
})(angular);