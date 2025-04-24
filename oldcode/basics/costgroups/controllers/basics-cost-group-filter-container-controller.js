/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).controller('basicsCostGroupFilterContainerController', [
		'_',
		'$scope',
		'$injector',
		'platformGridControllerService',
		'basicsCostGroupFilterDefaultAdaptorService',
		'basicsCostGroupFilterCatalogDataFactory',
		'basicsCostGroupFilterStructureDataFactory',
		'basicsCostGroupFilterUIStandardFactory',
		'basicsCostGroupFilterMarkFilterFactory',
		function (_,
		          $scope,
		          $injector,
		          platformGridControllerService,
		          defaultAdaptorService,
		          catalogDataFactory,
		          structureDataFactory,
		          uiStandardFactory,
		          markFilterFactory) {

			var serviceDescriptor = $scope.getContentValue('serviceDescriptor') || $scope.getContentValue('uuid'),
				customAdaptorName = $scope.getContentValue('adaptorService'),
				customAdaptor = customAdaptorName ? $injector.get(customAdaptorName) : null,
				adaptorService = angular.extend(defaultAdaptorService.createAdaptor(), customAdaptor);

			var mainService = adaptorService.getMainService(),
				catalogService = catalogDataFactory.createService(serviceDescriptor, adaptorService.getConfigModuleType(), adaptorService.getConfigModuleName(), {
					getProject: adaptorService.getProject
				}),
				filterService = markFilterFactory.createService(serviceDescriptor, {
					onRemoveFilter: function (checkedItems) {
						adaptorService.onCostGroupFilterChanged(checkedItems);
						catalogService.refreshView();
					}
				}),
				dataService = structureDataFactory.createService(serviceDescriptor, mainService, catalogService, filterService, {
					onCheckChanged: function (checkedItems, newCheckedItems) {
						adaptorService.onCostGroupFilterChanged(checkedItems);
						catalogService.addTag(newCheckedItems);
						catalogService.refreshView();
					}
				}),
				configService = uiStandardFactory.createService(serviceDescriptor, dataService, {}),
				serviceContainer = {
					catalogService: catalogService,
					filterService: filterService,
					dataService: dataService,
					configService: configService
				};

			platformGridControllerService.initListController($scope, configService, dataService, {}, {
				parentProp: 'CostGroupFk',
				childProp: 'ChildItems',
				marker: {
					filterService: filterService,
					filterId: serviceDescriptor,
					dataService: dataService,
					serviceName: dataService.getServiceName()
				},
				dragDropService: adaptorService.getDragDropService()
			});

			$scope.showTagStatus = adaptorService.getShowTagStatus();
			$scope.catalogExpandStatus = adaptorService.getCatalogExpandStatus();
			$scope.checkedTags = [];

			$scope.treeOptions = {
				dirSelectable: true,
				selectedNode: catalogService.getSelected(),
				onCatalogSelected: function (item) {
					if (item && this.selectedNode !== item) {
						this.selectedNode = item;
						catalogService.setSelected(this.selectedNode);
					}
				},
				getDisplayText: function (item) {
					return item.Code + ' - ' + item.DescriptionInfo.Translated;
				},
				removeFilter: function (event, node) {
					filterService.removeFilter(function (item) {
						return item.CostGroupCatFk === node.Id;
					});
					catalogService.refreshView();
					dataService.gridRefresh();
					$scope.updateTools();
					event.stopImmediatePropagation();
				},
				removeTag: function (event, node) {
					_.remove($scope.checkedTags, function (item) {
						return item.Id === node.Id;
					});
					adaptorService.onCheckedTagChanged($scope.checkedTags);
					event.stopImmediatePropagation();
				}
			};

			catalogService.addTag = function (checkedItems) {
				var catalogList = catalogService.getList(),
					catalogIds = _.map(checkedItems, function (item) {
						return item.CostGroupCatFk;
					}),
					catalogs = _.filter(catalogList, function (item) {
						return _.includes(catalogIds, item.Id);
					});
				_.each(catalogs, function (catalog) {
					var lastChild = _.last(checkedItems, function (item) {
						return item.CostGroupCatFk === catalog.Id && item.IsMarked;
					});

					_.remove($scope.checkedTags, function (item) {
						return item.Id === catalog.Id;
					});

					$scope.checkedTags.push({
						Id: catalog.Id,
						Title: catalog.Code + ':' + lastChild.Code,
						SelectedItem: lastChild
					});
				});
			};

			catalogService.refreshView = function () {
				var checkedItems = filterService.getFilters(),
					catalogList = catalogService.getList(),
					catalogIds = _.map(checkedItems, function (item) {
						return item.CostGroupCatFk;
					}),
					catalogs = _.filter(catalogList, function (item) {
						return _.includes(catalogIds, item.Id);
					});
				_.each(catalogList, function (catalog) {
					if (_.includes(catalogIds, catalog.Id)) {
						catalog.Image = 'btn tlb-icons ico-filter-off btn-square-26';
					} else {
						catalog.Image = '';
					}
				});

				$scope.enterpriseCatalogs = catalogService.getEnterpriseList();
				$scope.projectCatalogs = catalogService.getProjectList();
				adaptorService.onCheckedTagChanged($scope.checkedTags);
			};

			catalogService.onLoadEnd.register(catalogService.refreshView);

			adaptorService.onControllerCreated($scope, serviceContainer);

			catalogService.load();

			$scope.$on('$destroy', function () {
				catalogService.onLoadEnd.unregister(catalogService.refreshView);
				adaptorService.onControllerDestroyed($scope, serviceContainer);
			});

		}]);

})(angular);