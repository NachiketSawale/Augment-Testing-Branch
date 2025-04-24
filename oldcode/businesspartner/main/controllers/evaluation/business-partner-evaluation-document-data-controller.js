/**
 * Created by ada on 2017/8/17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,jQuery */

	/**
	 * @ngdoc controller
	 * @name businessPartnerEvaluationDocumentDataController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of evaluation.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('businessPartnerEvaluationDocumentDataController',
		['$scope', 'platformGridAPI', 'platformGridControllerService', '$timeout', 'commonTooltipService', 'basicsCommonUploadDownloadControllerService',
			'businessPartnerEvaluationDocumentDataUIStandardService',
			'$translate', 'platformModalService', 'businessPartnerMainEvaluationPermissionDescriptor', 'basicsPermissionServiceFactory',
			'_', 'basicsCommonDocumentControllerService',
			function ($scope, platformGridAPI, platformGridControllerService, $timeout, commonTooltipService, basicsCommonUploadDownloadControllerService,
				businessPartnerEvaluationDocumentDataUIStandardService,
				$translate, platformModalService, businessPartnerMainEvaluationPermissionDescriptor, basicsPermissionServiceFactory,
				_, basicsCommonDocumentControllerService) {

				// var dataService = documentDataService.getService(moduleContext.getMainService());
				var myGridConfig = {
					initCalled: false,
					columns: [],
					editorLock: new Slick.EditorLock(),
					skipPermissionCheck: true,
					lazyInit: true,
					enableConfigSave: true
				};

				var documentDataService = tryGetService('documentDataService'),
					documentValidationService = tryGetService('documentValidationService');

				let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');
				var permission = businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVAL');
				var hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
				documentDataService.hasWrite = hasWrite;

				$scope.setTools = function (tools) {
					// tools.items.splice(0, 4);
					// tools.items.splice(5, 1);
					tools.update = function () {
						tools.version += 1;
					};
					tools.refreshVersion = Math.random();
					tools.refresh = function () {
						tools.refreshVersion += 1;
					};
					// remove btn 'Show Statusbar'.
					var gridSetItem = _.find(tools.items, {id: 't200'});
					if (gridSetItem) {
						var showStatusBtnIndex = gridSetItem.list.items.indexOf(_.find(gridSetItem.list.items, {id: 't155'}));
						if (showStatusBtnIndex !== -1) {
							gridSetItem.list.items.splice(showStatusBtnIndex, 1);
						}
					}
					businessPartnerMainEvaluationPermissionService.parseToolPermission(tools);
					$scope.tools = tools;
				};

				$scope.getContainerUUID = function () {
					return 'F09CAC2E641D4813B861190813F4E95A';
				};

				$scope.onContentResized = function () {

				};

				// if not unregister the grids, when detail setting, it will some errors
				if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
					platformGridAPI.grids.unregister($scope.getContainerUUID());
				}
				platformGridControllerService.initListController($scope, businessPartnerEvaluationDocumentDataUIStandardService, documentDataService, documentValidationService, myGridConfig);
				basicsCommonUploadDownloadControllerService.initGrid($scope, documentDataService);
				// platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellChangedHandler);
				platformGridAPI.grids.element('id', $scope.gridId).options.editorLock = new Slick.EditorLock();

				// to make sure the grid config in the dialog can be saved by default.
				if (angular.isUndefined(myGridConfig.enableConfigSave) || myGridConfig.enableConfigSave === true) {
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					grid.enableConfigSave = true;
				}
				commonTooltipService.register($scope.gridId, {
					isShowArrow: false,
					fields: [
						{
							tooltipField: 'GroupDescription',
							textField: function (item) {
								return item.CommentText;
							}
						}
					]
				});

				// documentDataService.load();
				$scope.gridFlag = 'b1eb415d0fea4ee282a5d1a141bacf3a';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, documentDataService, $scope.gridFlag);

				$scope.canEdit = canEdit;

				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});

				jQuery(window).on('resize', resizeGrid);

				function resizeGrid() {
					platformGridAPI.grids.resize($scope.gridId);
				}

				function tryGetService(targetServiceName) {
					var dataService = null, parentScope = $scope.$parent;
					while (parentScope && dataService === null) {
						if (parentScope[targetServiceName]) {
							dataService = parentScope[targetServiceName];
						}
						parentScope = parentScope.$parent;
					}
					return dataService;
				}

				if (!hasWrite) {
					var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
						return item.id === 'create';
					});
					$scope.tools.items.splice(createBtnIdx, 1);

					var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
						return item.id === 'delete';
					});
					$scope.tools.items.splice(deleteBtnIdx, 1);
				}

				$scope.$on('$destroy', function () {
					jQuery(window).off('resize', resizeGrid);
					platformGridAPI.grids.unregister($scope.gridId);
					documentDataService.clearAllData();
					commonTooltipService.unregister($scope.gridId);
				});

				// ///////////////
				function canEdit() {
					return hasWrite;
				}
			}
		]);
})(angular);
