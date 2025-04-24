/**
 * Created by xsi on 2016-03-07.
 */
/* global globals */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance grid.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInstanceListController', [
		'$scope', 'platformControllerExtendService', 'platformGridControllerService', 'constructionSystemMainInstanceUIConfigService',
		'constructionSystemMainInstanceService', 'constructionSystemMainClipboardService',
		'constructionSystemMainInstanceValidationService', 'constructionSystemMainFilterService', '$injector',
		'constructionSystemMainJobDataService',
		'constructionSystemMainInstanceParameterHelpService', // don't remove for it should be initialized when the controller initializes
		'_', 'modelViewerUtilitiesService', 'platformGridAPI', '$http',
		'basicsCommonHeaderColumnCheckboxControllerService', 'constructionSystemMainInstanceProgressService', 'modelWdeViewerWdeService', '$q',

		function ($scope, platformControllerExtendService, platformGridControllerService, uiConfigService, dataService, cosMainClipboardService,
			validationService, constructionSystemMainFilterService, $injector, constructionSystemMainJobDataService,
			constructionSystemMainInstanceParameterHelpService,
			_, modelViewerUtilitiesService, platformGridAPI, $http,
			basicsCommonHeaderColumnCheckboxControllerService, constructionSystemMainInstanceProgressService, modelWdeViewerWdeService, $q) {

			var headerCheckBoxFields = ['IsChecked'];
			var headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];

			var modelId = dataService.getCurrentSelectedModelId();
			var getModelInfoPromises = [modelWdeViewerWdeService.is2DModel(modelId),
				$http.get(globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelId)];

			$q.all(getModelInfoPromises).then(function (res) {
				if (res[0] || (_.has(res[1], 'data') && res[1].data.IsComposite)) {
					var twodobjectBtn = $scope.tools.items.find(function(btn) {
						return btn.id === 't-twodobject';
					});
					if (twodobjectBtn) {
						twodobjectBtn.disabled = function() {
							return !dataService.getSelected();
						};
						$scope.tools.update();
					}
				}
			});

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't-navigation',
						sort: 10,
						type: 'item',
						caption: $injector.get('platformModuleInfoService').getNavigatorTitle('estimate.main'),
						iconClass: 'tlb-icons ico-goto',
						fn: function () {
							dataService.goToEstimate();
						}/* , Mike: since the goToEstimate is not depend on selected instance, just disable the below codes.
					 disabled: function () {
					 return dataService.getSelected() == null;
					 } */
					},
					{
						id: 't-calculation',
						sort: 10,
						caption: 'constructionsystem.main.taskBarAddCalculationJob',
						type: 'item',
						iconClass: 'tlb-icons ico-instance-calculate',
						fn: constructionSystemMainJobDataService.createCalculationJob,
						disabled: constructionSystemMainJobDataService.disableCalculation
					},
					// {
					// 	id: 't-calculation2',
					// 	sort: 10,
					// 	caption: 'Calculation With ClearScript',
					// 	type: 'item',
					// 	iconClass: 'tlb-icons ico-calculate-measurement',
					// 	fn: constructionSystemMainJobDataService.createCalculationJob2,
					// 	disabled: constructionSystemMainJobDataService.disableCalculation
					// },
					{
						id: 'taskBarShowImage',
						caption: 'constructionsystem.main.taskBarShowImage',
						type: 'item',
						iconClass: 'tlb-icons ico-create-form',
						fn: function () {
							$injector.get('constructionSystemMainInstanceGetHelpImageService').showDialog();
						}
					},
					{
						id: 't-evaluation',
						sort: 10,
						caption: 'constructionsystem.main.taskBarAddEvaluationJob',
						type: 'item',
						iconClass: 'tlb-icons ico-instance-par-evaluate',
						fn: constructionSystemMainJobDataService.createEvaluationJob,
						disabled: constructionSystemMainJobDataService.disableEvaluation
					},
					{
						id: 't-twodobject',
						sort: 10,
						caption: 'constructionsystem.main.button2dObjectAndProperty',
						type: 'item',
						iconClass: 'tlb-icons ico-2dqto-create',
						fn: dataService.show2dObjectDialog,
						disabled: true
					}
				]
			});

			platformControllerExtendService.initListController($scope, uiConfigService, dataService, validationService, {
				type: 'cosMainInstance',
				dragDropService: cosMainClipboardService,
				extendDraggedData: function (draggedData) {
					draggedData.modelDataSource = cosMainClipboardService.myDragdropAdapter;
					draggedData.instanceHeaderInfo = dataService.getCurrentInstanceHeaderInfo();
				},
				costGroupConfig:{
					dataLookupType: 'Header2CostGroups',
					identityGetter: function (entity) {
						return {
							RootItemId: entity.InstanceHeaderFk,
							MainItemId: entity.Id
						};
					}
				}
			});

			// region Removing or Keeping User Modified depending on SystemOptions
			dataService.setGridIdForRest($scope.gridId);

			dataService.setScope($scope);

			dataService.reset();
			// end region


			// drag & drop
			$scope.ddTarget.registerDragStarted(function () {
				cosMainClipboardService.setDropMessageToViewer('dragging instance');
			});

			var origCanDrop = $scope.ddTarget.canDrop;
			$scope.ddTarget.canDrop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
					return !!dataService.getSelected();
				} else {
					return origCanDrop.call($scope.ddTarget, info);
				}
			};

			var origDrop = $scope.ddTarget.drop;
			$scope.ddTarget.drop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
					// handle dragged data
					cosMainClipboardService.copyObjectsFromViewer(info);
				} else {
					origDrop.call($scope.ddTarget, info);
				}
			};

			basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);

			$scope.setTools(constructionSystemMainFilterService.getToolbar($scope));

			// remove pinning toolbar
			_.remove($scope.tools.items, function (obj) {
				return obj.iconClass === 'tlb-icons ico-set-prj-context';
			});
			_.remove($scope.tools.items, function (obj) {
				return obj.iconClass === 'tlb-icons ico-rec-new';
			});

			// fix defect: customized button disappears while do grouping
			// $scope.tools.items.unshift({
			//    id: 't-navigation',
			//    type: 'item',
			//    caption: $injector.get('platformModuleInfoService').getNavigatorTitle('estimate.main'),
			//    iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
			//    fn: function () {
			//         dataService.goToEstimate();
			//    }/*, Mike: since the goToEstimate is not depend on selected instance, just disable the below codes.
			//     disabled: function () {
			//     return dataService.getSelected() == null;
			//     }*/
			// });
			//
			// $scope.tools.items.splice(1, 0, {
			//    id: 't-calculation',
			//    sort: 0,
			//    caption: 'constructionsystem.main.taskBarAddCalculationJob',
			//    type: 'item',
			//    iconClass: 'tlb-icons ico-instance-calculate',
			//    fn: constructionSystemMainJobDataService.createCalculationJob,
			//    disabled: constructionSystemMainJobDataService.disableCalculation
			// });
			//
			// $scope.tools.items.splice(1, 0, {
			//    id: 't-evaluation',
			//    sort: 0,
			//    caption: 'constructionsystem.main.taskBarAddEvaluationJob',
			//    type: 'item',
			//    iconClass: 'tlb-icons ico-instance-par-evaluate',
			//    fn: constructionSystemMainJobDataService.createEvaluationJob,
			//    disabled: constructionSystemMainJobDataService.disableEvaluation
			// });

			function onSelectedItemChanged() {
				$scope.tools.update();  // force to call disabled fn of toolbar buttons
				$injector.get('constructionsystemMainLineitemLocationLookupService').clear();
			}

			function disabledHeaderCheckBox(isDisable) {
				const grid = platformGridAPI.grids.element('id', $scope.gridId).instance;
				const headers = grid.getColumnHeaders();
				const ele = headers.find('#chkbox_' + grid.getUID() + '_ischecked');
				if (ele && ele.length) {
					ele.prop('disabled', isDisable);
				}
			}

			function checkAll(e) {
				var isChecked = (e.target.checked);
				var instanceList = dataService.getList();
				var dataList = [];
				if (instanceList && angular.isArray(instanceList) && instanceList.length > 0) {
					_.each(instanceList, function (item) {
						var idAndVersion = {Id: item.Id, Version: item.Version};
						dataList.push(idAndVersion);
					});
				}
				if (dataList.length === 0) {
					return;
				}
				disabledHeaderCheckBox(true);
				$scope.$apply(function () {
					onSelectedItemChanged();
				});

				var request = {
					Id: 1,
					IsChecked: isChecked,
					IdAndVersions: dataList
				};
				var updateUrl = globals.webApiBaseUrl + 'constructionsystem/main/instance/updateisChecked';
				$http.post(updateUrl, request).then(function () {
					disabledHeaderCheckBox(false);
					_.each(instanceList, function (item) {
						item.Version = item.Version + 1;
					});
					dataService.syncModelViewWithCheckedInstances();
					dataService.gridRefresh();
				});
			}

			dataService.registerSelectionChanged(onSelectedItemChanged);

			// noinspection JSUnusedLocalSymbols
			function setSelectedInstances(e, arg) {
				var gridItems = platformGridAPI.rows.getRows($scope.gridId);
				var arr = [];
				if (arg) {
					angular.forEach(arg.rows, function (item) {
						var elem = gridItems[item];
						if (elem) {
							arr.push(elem);
						}
					});
				}
				dataService.multipleSelectedItems = arr;
			}

			constructionSystemMainFilterService.onFilterMarksChanged.register(onSelectedItemChanged);

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', setSelectedInstances);

			constructionSystemMainInstanceProgressService.gridId = $scope.gridId;

			constructionSystemMainJobDataService.loadJobs();

			var stopFunc = constructionSystemMainJobDataService.queryStatus();

			/* function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, uiConfigService, costGroupCatalogs, dataService, validationService);
			}

			if (!dataService.costGroupService) {
				dataService.costGroupService = $injector.get('basicsCostGroupDataServiceFactory').createService('', dataService, {
					dataLookupType: 'Header2CostGroups',
					identityGetter: function (entity) {
						return {
							RootItemId: entity.InstanceHeaderFk,
							MainItemId: entity.Id
						};
					}
				});
			} else {
				costGroupLoaded(dataService.costGroupCatalogs);
			}
			dataService.costGroupService.registerCellChangedEvent($scope.gridId);

			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded); */


			$scope.$on('$destroy', function () {
				stopFunc();
				constructionSystemMainInstanceProgressService.gridId = '';
				constructionSystemMainFilterService.onFilterMarksChanged.unregister(onSelectedItemChanged);
				dataService.unregisterSelectionChanged(onSelectedItemChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', setSelectedInstances);
				// dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});
		}
	]);
})(angular);