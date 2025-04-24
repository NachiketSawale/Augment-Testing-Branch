/**
 * Created by lnt on 10/27/2017.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'qto.main';
	/**
	 * @ngdoc controller
	 * @name qtoMainSearchDataDetailDialogController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainSearchDataDetailDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainSearchDataDetailDialogController', [
		'$scope', '$translate', '$timeout', '$interval', '$injector', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'qtoMainSearchDataDetailDialogService',
		'qtoMainHeaderDataService', 'qtoMainDetailService', 'qtoMainSearchDetailDialogValidationService', 'qtoMainBulkEditorDialogService', 'platformModalService',
		function ($scope, $translate, $timeout, $interval, $injector, platformGridAPI, dialogGridControllerService, qtoSearchDataDetailDialogService,
			qtoMainHeaderDataService, qtoMainDetailService, qtoSearchDialogValidationService, qtoMainBulkEditorDialogService, platformModalService) {

			let requestData = null, dataService = qtoSearchDataDetailDialogService.dataService;

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = true;

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({ok: true});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close({ok: false});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({ok: false});
			};

			var gridConfig = {
				initCalled: false,
				columns: [],
				cellChangeCallBack: function (arg) {
					let item  = arg.item;
					let qtoHeaderSelect = qtoMainHeaderDataService.getSelected();
					item.BoqHeaderFk = qtoHeaderSelect.BoqHeaderFk;

					// multiLines: assign to group
					let multiLines = qtoMainDetailService.getReferencedDetails(item, dataService.getList());
					if (multiLines && multiLines.length) {
						_.forEach(multiLines, function (multiLine) {
							if (multiLine.Id !== item.Id) {
								multiLine.BoqHeaderFk = item.BoqHeaderFk;
								multiLine.BoqItemFk = item.BoqItemFk;
								qtoSearchDialogValidationService.validateBoqItemFk(multiLine, multiLine.BoqItemFk, 'BoqItemFk');
							}
						});

						dataService.gridRefresh();
					}
				},
				grouping: false,
				uuid: $scope.options.uuid
			};

			dialogGridControllerService.initListController($scope, $scope.options.columns, dataService, qtoSearchDialogValidationService, gridConfig);

			var tools = [
				{
					id: 'bulkEditor',
					caption: 'cloud.common.bulkEditor.title',
					type: 'item',
					iconClass: 'type-icons ico-construction51',
					disabled: false,
					fn: function () {
						qtoMainHeaderDataService.updateAndExecute(qtoMainBulkEditorDialogService.showDialog);
					}
				}
			];

			$scope.addTools(tools);

			$timeout(function () {
				platformGridAPI.grids.resize($scope.options.uuid);
				startInquiryData();
			});

			// set the data from other tabs
			function startInquiryData() {
				if (angular.isFunction($scope.options.inquiryDataFn)) {
					$scope.options.inquiryDataFn($scope.options.requestId);

					// request data every 5 second until user saved the selected items from qto detail dialog.
					requestData = $interval(function () {
						if (angular.isFunction($scope.options.requestDataFn)) {
							var qtoHeaderSelect = qtoMainHeaderDataService.getSelected();
							$scope.options.requestDataFn($scope.options.requestId, qtoHeaderSelect.Id).then(function (response) {
								if (response && _.isArray(response.data) && response.data.length > 0) {
									stopRequestData();
									var data = response.data;
									if(data && data.length && !data[0].IsCopy){
										var strTitle = $translate.instant('qto.main.wizard.wizardDialog.copyQtoDetail');
										var strContent = $translate.instant('qto.main.wizard.wizardDialog.copyWarnning');
										platformModalService.showMsgBox(strContent, strTitle, 'info');
										$scope.$close({ok: false});
										return;
									}
									var projectId = qtoMainDetailService.getSelectedProjectId();
									var isDisable = false;

									qtoMainDetailService.updateQtoDetailGroupInfo(response.data);

									angular.forEach(data, function(item){
										item.BoqItemReferenceFk = null;
										item.BoqSubItemFk = null;
										item.BoqSubitemReferenceFk = null;
										item.oldQtoHeaderFk = item.QtoHeaderFk;
										item.QtoHeaderFk = qtoHeaderSelect.Id;
										if(item.BoqHeaderFk !== qtoHeaderSelect.BoqHeaderFk && item.BoqHeaderFk === 0 && item.BoqItemFk === 0){
											isDisable = true;
										}

										var selectBoq = $injector.get('qtoBoqStructureService').getSelected();
										if(selectBoq && selectBoq.BoqLineTypeFk === 0){
											item.BoqHeaderFk = selectBoq.BoqHeaderFk;
											item.BoqItemFk =  selectBoq.Id;
											item.IsSameUom = true;
											isDisable = false;
										}

										if(projectId !== qtoHeaderSelect.ProjectFk){
											item.PrjLocationFk = null;
											item.BoqSplitQuantityFk = null;
											item.PrcStructureFk = null;
											item.MdcControllingUnitFk = null;
											item.IsNotCpoyCostGrp = true;
										}
									});

									$scope.isOkDisabled = isDisable;

									qtoSearchDataDetailDialogService.dataService.setList(data);
								}
							});
						}
					}, 5000);
				}
			}

			function stopRequestData() {
				if (requestData) {
					$interval.cancel(requestData);
					requestData = null;
				}
			}

			// change the OK button as Disable or not
			qtoSearchDataDetailDialogService.dataService.onQtoDetailBoqItemChange.register(changeOkButtonStatus);

			function changeOkButtonStatus(isDisable){
				$scope.isOkDisabled = isDisable;
			}

			// Intervals created by this service must be explicitly destroyed when you are finished with them
			$scope.$on('$destroy', function () {
				stopRequestData();
				qtoSearchDataDetailDialogService.dataService.onQtoDetailBoqItemChange.unregister(changeOkButtonStatus);
			});
		}
	]);
})(angular);