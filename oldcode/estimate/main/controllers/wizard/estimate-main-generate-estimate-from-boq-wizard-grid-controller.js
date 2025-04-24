/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainGenerateEstimateFromBoqWizardGridController
	 * @function
	 *
	 * @description
	 * Controller to show the Grid with Project Boqs on Generate Estimate from Boq wizard
	 **/
	angular.module(moduleName).controller('estimateMainGenerateEstimateFromBoqWizardGridController', ['$q','$http','$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateMainGenerateEstimateFromBoqWizardDetailService', 'platformGridControllerService','estimateMainGenerateEstimateFromBoqWizardValidationService','estimateMainGenerateEstimateFromBoqWizardProcessService',
		function ($q,$http,$scope, $timeout, $injector, platformGridAPI, platformCreateUuid, estimateMainGenerateEstimateFromBoqWizardDetailService, platformGridControllerService,validationService,estimateMainGenerateEstimateFromBoqWizardProcessService) {

			let myGridConfig = {
				initCalled: false,
				skipPermissionCheck: true,
				cellChangeCallBack: function cellChangeCallBack(arg) {
					let entity = arg.item;
					let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;

					if(field === 'Type') {
						estimateMainGenerateEstimateFromBoqWizardProcessService.processItem(entity,field );
						estimateMainGenerateEstimateFromBoqWizardDetailService.refreshGrid();
					}

					/* if(field === 'ProjectWicId'){
						let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
						let filterIds = $injector.get('estimateProjectRateBookConfigDataService').getFilterIds(3);

						let postData ={
							boqType: entity.Type === 1  ? boqMainBoqTypes.project : boqMainBoqTypes.wic,
							prcStructureId: 0,boqGroupId:  entity.Type === 2  ? entity.ProjectWicId : 0,
							projectId: entity.Type === 1  ? entity.ProjectWicId : 0, // 1003572,
							boqFilterWicGroupIds: filterIds
						};

						return $http.post(globals.webApiBaseUrl + 'boq/main/getboqheaderlookup',postData).then(function (response) {
							let itemList = response.data;
							entity.SourceBoqHeaderFk = itemList[0].BoqHeaderFk;
							entity.BoqRootItemDescription = itemList[0].Description;
							entity.RootItemId = itemList[0].BoqHeaderFk;
							return $q.when();
						});
					} */
				},
			};

			$scope.gridId = platformCreateUuid();

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.onContentResized = function () {
				resize();
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'create',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							estimateMainGenerateEstimateFromBoqWizardDetailService.createItem();
							estimateMainGenerateEstimateFromBoqWizardDetailService.refreshGrid();
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 10,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							let SelectedEntities = estimateMainGenerateEstimateFromBoqWizardDetailService.getSelectedEntities();
							angular.forEach(SelectedEntities,function(cItem){
								estimateMainGenerateEstimateFromBoqWizardDetailService.deleteItem(cItem);
							});
						},
						disabled: function(){
							let SelectedEntities = estimateMainGenerateEstimateFromBoqWizardDetailService.getSelectedEntities();
							if(SelectedEntities && SelectedEntities.length >= 1 ){
								return false;
							}else{
								return true;
							}
						}
					},
					{
						id: 'moveUp',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							estimateMainGenerateEstimateFromBoqWizardDetailService.moveUp(1,$scope.gridId);
						},
						disabled: true
					},
					{
						id: 'moveDown',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsDown',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							estimateMainGenerateEstimateFromBoqWizardDetailService.moveDown(3,$scope.gridId);
						},
						disabled: true
					}
				],
				update: function () {
					return;
				}
			};

			// var updateTools = function () {
			// $timeout($scope.tools.update, 0, true);
			// };

			function resize() {
				$timeout(function () {
					updateTools();
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, estimateMainGenerateEstimateFromBoqWizardDetailService, estimateMainGenerateEstimateFromBoqWizardDetailService, validationService, myGridConfig);
			}

			function updateTools(args) {
				let readOnly = false;

				let disableMoveUp = false;
				let disableMoveDown = false;

				let dataService= estimateMainGenerateEstimateFromBoqWizardDetailService.getList();

				if(args){
					for(let index in args.rows){
						if(args.rows[index] === 0) {
							disableMoveUp = true;
							break;
						}
					}

					for(let index1 in args.rows){
						if(args.rows[index1] === dataService.length-1) {
							disableMoveDown = true;
							break;
						}
					}

				}else{
					disableMoveUp = true;
					disableMoveDown = true;
				}

				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					let disable = !(args && args.rows.length >0);
					if (!readOnly && item.id === 'delete') {
						item.disabled = disable;
					}

					if (!readOnly && item.id === 'moveUp') {
						item.disabled = disableMoveUp;
					}

					if (!readOnly && item.id === 'moveDown') {
						item.disabled = disableMoveDown;
					}
				});
			}

			function onSelectedRowsChanged(e, args){
				updateTools(args);
			}

			init();

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainGenerateEstimateFromBoqWizardDetailService.setDataList(null);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});
		}
	]);
})();
