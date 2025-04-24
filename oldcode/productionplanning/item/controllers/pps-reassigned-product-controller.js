(function () {

	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningReassignedProductController', ReassignedProductController);
	ReassignedProductController.$inject = ['$scope', '$controller', '_',
		'platformContainerControllerService',
		'platformTranslateService', 'platformGridAPI', 'productionplanningItemReassignedProductDataService',
		'basicsLookupdataLookupDescriptorService', 'basicsLookupdataConfigGenerator',
		'productionplanningCommonProductStatusLookupService', 'cloudDesktopPinningContextService',
		'basicsLookupdataLookupFilterService', 'basicsCommonToolbarExtensionService',
		'productionplanningItemDataService', 'ppsCommonNotifyUpdatingService'];

	function ReassignedProductController($scope, $controller, _,
										 platformContainerControllerService,
										 platformTranslateService, platformGridAPI, reassignedProductDataService,
										 lookupDescriptorService, lookupdataConfigGenerator,
										 productStatusLookupService, cloudDesktopPinningContextService,
										 basicsLookupdataLookupFilterService, toolbarExtensionService,
										 itemDataService, ppsCommonNotifyUpdatingService) {
		var uuid = $scope.getContainerUUID();

		var filters = [{
			key: 'pps-item-projectfk-filter',
			serverSide: true,
			fn: function () {
				var projectId = -1;
				var context = cloudDesktopPinningContextService.getContext();
				if (context !== undefined && context !== null) {
					_.each(context, function (item) {
						if (item.token === 'project.main') {
							projectId = item.id;
						}
					});
				}
				return {ProjectId: projectId};
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		var formConfig = {
			fid: 'productionplanning.item.reassignedproduct.filter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'filter'
			}],
			rows: [{
				gid: 'filter',
				rid: 'productionUnit',
				label: '*Production Unit',
				label$tr$: 'productionplanning.item.entityItem',
				type: 'directive',
				directive: 'pps-item-complex-lookup',
				model: 'ppsItemFk',
				options: {
					lookupDirective: 'pps-item-complex-lookup',
					descriptionMember: 'Description',
					showClearButton: true,
					additionalFilters: [{
						ProjectId: 'ProjectId',
						getAdditionalEntity: function () {
							var projectId = null;
							var context = cloudDesktopPinningContextService.getContext();
							if (context !== undefined && context !== null) {
								_.each(context, function (item) {
									if (item.token === 'project.main') {
										projectId = item.id;
									}
								});
							}
							return {ProjectId: projectId};
						}
					}, {
						MaterialGroupId: 'MaterialGroupId',
						getAdditionalEntity: function () {
							var materialGroupId = null;
							if ($scope.entity && $scope.entity.materialGroupFk) {
								materialGroupId = $scope.entity.materialGroupFk;
							}
							return {MaterialGroupId: materialGroupId};
						}
					}]
				}
				// change: function (entity) {
				// 	if (!_.isNil(entity.ppsItemFk)) { // Only clear value of filter materialGroupFk if filter ppsItemFk is not null.
				// 		entity.materialGroupFk = null;
				// 	}
				// }
			}, {
				gid: 'filter',
				rid: 'materialGroup',
				label: '*Material Group',
				label$tr$: 'productionplanning.item.materialGroupFk',
				type: 'directive',
				directive: 'basics-material-material-group-lookup',
				model: 'materialGroupFk',
				options: {
					showClearButton: true
				}
				// change: function (entity) {
				// 	if (!_.isNil(entity.materialGroupFk)) { // Only clear value of filter ppsItemFk if filter materialGroupFk is not null.
				// 		entity.ppsItemFk = null;
				// 	}
				// }
			}, {
				gid: 'filter',
				rid: 'status',
				label: '*Status',
				label$tr$: 'cloud.common.entityStatus',
				model: 'statusFks',
				type: 'directive',
				directive: 'productionplanning-common-custom-filter-value-list',
				dropboxOptions: {
					items: _.each(productStatusLookupService.getList(), function (status) {
						if(status.DescriptionInfo && !_.isEmpty(status.DescriptionInfo.Translated)){
							status.Description = status.DescriptionInfo.Translated;
						}
					}),
					valueMember: 'Id',
					displayMember: 'Description'
				}
			}]
		};

		$scope.gridId = uuid;
		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(formConfig)
		};
		$scope.entity = {
			ppsItemFk: null,
			materialGroupFk: null,
			statusFks: null,
			targetPPSItem: null
		};
		$scope.subcontroller = function () {
			ControllerService.$inject = ['$scope'];

			function ControllerService($scope) {
				toolbarExtensionService.insertBefore($scope, {
					id: 'moveToSelected',
					sort: 1,
					caption: 'productionplanning.item.moveToSelected',
					type: 'item',
					iconClass: 'tlb-icons ico-demote',
					fn: function () {
						reassignedProductDataService.moveToSelected();
					},
					disabled: function () {
						return ppsCommonNotifyUpdatingService.isUpdating() || !reassignedProductDataService.canMoveToSelected();
					}
				});

				platformContainerControllerService.initController($scope, moduleName, uuid);
			}

			return $controller(ControllerService, {
				$scope: $scope,
				platformContainerControllerService: platformContainerControllerService,
				uuid: $scope.gridId,
				platformGridAPI: platformGridAPI
			}).constructor;
		};

		var watchFilter = ['entity.ppsItemFk', 'entity.materialGroupFk', 'entity.statusFks', 'entity.targetPPSItem'];
		var unregister = $scope.$watchGroup(watchFilter, function (newVal, oldVal) {
			//entity.ppsItemFk doesn't change if we switch among children
			if(newVal[3] && newVal[3].PPSItemFk && oldVal[3].PPSItemFk){
				if(_.isEqual(newVal[3].PPSItemFk, oldVal[3].PPSItemFk) &&
					!_.isEqual(newVal[3], oldVal[3])
				){
					reassignedProductDataService.filterWithinSameParent(newVal);
				}else if(!_.isEqual(newVal[3].Id, oldVal[3].Id)){
					reassignedProductDataService.filter(newVal);
				}
			}
			else{
				if (newVal !== oldVal) {
					reassignedProductDataService.filter(newVal);
				}
			}
		});

		reassignedProductDataService.registerSelectionChanged(onSelectionChanged);
		itemDataService.registerSelectionChanged(onItemGridSelectedRowsChanged);
		itemDataService.registerOnItemMaterialChanged(onItemMaterialChanged);
		ppsCommonNotifyUpdatingService.registerUpdateDone(onSelectionChanged);

		//list the result if selected at first time
		onItemGridSelectedRowsChanged(null, itemDataService.getSelected());
		//the first time watch not work as expect, so trigger it manually
		reassignedProductDataService.filter(_.map(watchFilter, function (filter) {
			return $scope.entity[filter.split('.')[1]];
		}));

		function onItemMaterialChanged(e, arg) {
			$scope.entity.targetPPSItem = _.clone(arg);//make sure the object is changed
		}

		function onItemGridSelectedRowsChanged(e, arg) {
			var selectedItem = arg;
			if (selectedItem) {
				clearFilter();
				$scope.entity.targetPPSItem = selectedItem;
				$scope.entity.ppsItemFk = _.isNil(selectedItem.RootFk) ? selectedItem.Id : selectedItem.RootFk;
			}
			onSelectionChanged();
		}

		function onSelectionChanged() {
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		function clearFilter() {
			$scope.entity.ppsItemFk = null;
			$scope.entity.targetPPSItem = null;
			//$scope.entity.materialGroupFk = null;
		}

		function findItemById(items, id) {
			var findItem = _.find(items, {'Id': id});
			if (_.isNil(findItem)) {
				var childItmes = [];
				_.each(items, function (item) {
					if (item.ChildItems.length > 0) {
						childItmes = childItmes.concat(item.ChildItems);
					}
				});
				if (childItmes.length > 0) {
					findItem = findItemById(childItmes, id);
				}
			}
			return findItem;
		}

		$scope.$on('$destroy', function () {
			unregister();
			reassignedProductDataService.unregisterSelectionChanged(onSelectionChanged);
			itemDataService.unregisterSelectionChanged(onItemGridSelectedRowsChanged);
			itemDataService.unregisterOnItemMaterialChanged(onItemMaterialChanged);
			ppsCommonNotifyUpdatingService.unregisterUpdateDone(onSelectionChanged);
		});
	}
})();
