/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemSelectionStatementResultReportController
	 * @function
	 *
	 * @description
	 * Controller for a modal dialogue displaying the data in a form container for estimateMainLineItemSelectionStatementResultReportController
	 **/
	angular.module('estimate.main').controller('estimateMainLineItemSelectionStatementResultReportController', [
		'$scope', 'platformTranslateService', '$translate', 'estimateMainLineItemSelStatementListService',
		function ($scope, platformTranslateService, $translate, estimateMainLineItemSelStatementListService) {

			let data = $scope.$parent.modalOptions.dataItems || {};
			let assemblyDictionary = {};
			let boqItemDictionary = {};
			let wicItemDictionary = {};
			let activityDictionary = {};
			let modelDictionary = {};

			processData(data);

			$scope.modalOptions.headerText = $scope.modalTitle = $scope.$parent.modalOptions.headerText;

			let formConfiguration = {
				fid: 'bulkEditor.changeReport',
				showGrouping: true,
				groups: [
					{
						header: $translate.instant('platform.bulkEditor.records'),
						header$tr$: 'platform.bulkEditor.records',
						gid: 'estimate.main.selstatement.records',
						isOpen: true,
						// eslint-disable-next-line no-prototype-builtins
						visible: !data.hasOwnProperty('isShowSingleExecutionInfo'),
						sortOrder: 100
					},
					{
						header: $translate.instant('estimate.main.lineItemSelStatement.report.conflict'),
						header$tr$: 'estimate.main.lineItemSelStatement.report.conflict',
						gid: 'estimate.main.selstatement.conflict',
						isOpen: false,
						// eslint-disable-next-line no-prototype-builtins
						visible: !data.hasOwnProperty('isShowSingleExecutionInfo'),
						sortOrder: 110
					},
					{
						header: $translate.instant('platform.bulkEditor.details'),
						header$tr$: 'platform.bulkEditor.details',
						gid: 'estimate.main.selstatement.details',
						// eslint-disable-next-line no-prototype-builtins
						isOpen: data.hasOwnProperty('isShowSingleExecutionInfo') || data.hasOwnProperty('errors'),
						sortOrder: 120
					}
				],
				rows: [
					{
						gid: 'estimate.main.selstatement.records',
						rid: 'changedRecords',
						label: $translate.instant('platform.bulkEditor.totalRecords'),
						label$tr$: 'platform.bulkEditor.totalRecords',
						type: 'integer',
						readonly: true,
						model: 'totalRecords',
						visible: true,
						sortOrder: 200
					},
					{
						gid: 'estimate.main.selstatement.records',
						rid: 'changedRecords',
						label: $translate.instant('platform.bulkEditor.changedRecords'),
						label$tr$: 'platform.bulkEditor.changedRecords',
						type: 'integer',
						readonly: true,
						model: 'changedRecords',
						visible: true,
						sortOrder: 210
					},
					{
						gid: 'estimate.main.selstatement.records',
						rid: 'unchangedRecords',
						label: $translate.instant('platform.bulkEditor.unchangedRecords'),
						label$tr$: 'platform.bulkEditor.unchangedRecords',
						type: 'integer',
						readonly: true,
						model: 'unchangedRecords',
						visible: true,
						sortOrder: 220
					},
					{
						gid: 'estimate.main.selstatement.conflict',
						rid: 'logConflicts',
						label: $translate.instant('platform.bulkEditor.logs'),
						label$tr$: 'platform.bulkEditor.logs',
						type: 'text',
						readonly: true,
						model: 'logConflicts',
						visible: true,
						sortOrder: 230,
						height: 150
					},
					{
						gid: 'estimate.main.selstatement.details',
						rid: 'logSelStatement',
						label: $translate.instant('estimate.main.lineItemSelStatement.report.selectionStatementLabel'),
						label$tr$: 'estimate.main.lineItemSelStatement.report.selectionStatementLabel',
						type: 'description',
						readonly: true,
						model: 'selStatementCode',
						// eslint-disable-next-line no-prototype-builtins
						visible: data.hasOwnProperty('isShowSingleExecutionInfo'),
						sortOrder: 240,
						height: 150
					},
					{
						gid: 'estimate.main.selstatement.details',
						rid: 'logStartTime',
						label: $translate.instant('estimate.main.lineItemSelStatement.report.lastExecutionTime'),
						label$tr$: 'estimate.main.lineItemSelStatement.report.lastExecutionTime',
						type: 'description',
						readonly: true,
						model: 'startTime',
						// eslint-disable-next-line no-prototype-builtins
						visible: data.hasOwnProperty('isShowSingleExecutionInfo'),
						sortOrder: 250,
						height: 150
					},
					{
						gid: 'estimate.main.selstatement.details',
						rid: 'logDetails',
						label: $translate.instant('platform.bulkEditor.logs'),
						label$tr$: 'platform.bulkEditor.logs',
						type: 'text',
						readonly: true,
						model: 'logDetails',
						visible: true,
						sortOrder: 260,
						height: 150
					}
				]
			};

			$scope.formOptions = {
				configure: formConfiguration
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			function processData(data){
				let listError = data.errors || [];
				let listTotal = data.lineItemsListTotal || [];
				let listConflict = data.lineItemsListConflict || [];
				let listUpdated = data.lineItemsListUpdated || [];
				let assemblies = data.assemblies || [];
				let boqItems = data.boqItems || [];
				let wicItems = data.wicItems || [];
				let activities = data.activities || [];
				let models = data.models || [];

				_.forEach(assemblies, function(item){
					assemblyDictionary[item.Id] = item.Code;
				});
				_.forEach(boqItems, function(item){
					boqItemDictionary[item.Id] = item.Reference;
				});
				_.forEach(wicItems, function(item){
					wicItemDictionary[item.Id] = item.Reference;
				});
				_.forEach(activities, function(item){
					activityDictionary[item.Id] = item.Code;
				});
				_.forEach(models, function(item){
					modelDictionary[item.Id] = item.Code;
				});


				$scope.dataItem = {};

				// eslint-disable-next-line no-prototype-builtins
				if (data.hasOwnProperty('isShowSingleExecutionInfo')){
					$scope.dataItem.selStatementCode = getSelStatement(data.selStatement.Id).Code;
					$scope.dataItem.startTime = data.startTime;
					$scope.dataItem.logDetails = getReportLog(getSingleExecutionInfo(data.loggingMessage), true);
				}else{
					if (_.size(listError) > 0){
						$scope.dataItem.hasError = true;
						$scope.dataItem.logDetails = '';
						_.forEach(listError, function(message, selectStatementId){
							$scope.dataItem.logDetails += $translate.instant('estimate.main.lineItemSelStatement.report.selectionStatement') + getSelStatement(parseInt(selectStatementId)).Code + '';
							$scope.dataItem.logDetails += message + '';
						});
						return;
					}

					$scope.dataItem.totalRecords = listTotal.length;
					$scope.dataItem.changedRecords = listUpdated.length;
					$scope.dataItem.unchangedRecords = listConflict.length;
					$scope.dataItem.logConflicts = getReportLog(listConflict);
					$scope.dataItem.logDetails = getReportLog(listUpdated);
				}
			}

			function getSingleExecutionInfo(loggingMessage){

				let loggingMessageItems = [];
				_.forEach(loggingMessage.split(';'), function(log){
					resolveAssignedTypeInfo(log, loggingMessageItems);
				});

				return loggingMessageItems;
			}

			function resolveAssignedTypeInfo(log, loggingMessageItems){
				if (_.isEmpty(log)){
					return;
				}
				let item  = {};
				let delimitedData = log.split(',');
				let typeInfoReg = new RegExp('(.*):(.*)');
				_.forEach(delimitedData, function(dataStr){
					let typeInfoMath = typeInfoReg.exec(dataStr);
					if (typeInfoMath.length === 3){
						let typeAssign = typeInfoMath[1].replace(/ /g, '');
						let typeValue = typeInfoMath[2].replace(/ /g, '');

						if (typeAssign === 'boq'){
							angular.extend(item, { BoqItemFk: 1, BoqItemReference: typeValue });
						}else if (typeAssign === 'wic'){
							angular.extend(item, { WicItemFk: 1, WicItemReference: typeValue });
						}else if (typeAssign === 'assembly'){
							angular.extend(item, { EstAssemblyFk: 1, AssemblyCode: typeValue });
						}else if (typeAssign === 'activity'){
							angular.extend(item, { PsdActivityFk: 1, PsdActivityCode: typeValue });
						}else if (typeAssign === 'quantity'){
							angular.extend(item, { Quantity: typeValue });
						}

						if (typeAssign === 'lineitems'){
							_.forEach(typeValue.split('|'), function(lineItemCode){
								let itemToAdd = angular.copy(item);
								itemToAdd.LineItemCode = lineItemCode;

								let detailItem = _.find(loggingMessageItems, {'LineItemCode': lineItemCode});
								if (_.isEmpty(detailItem)){
									loggingMessageItems.push(itemToAdd);
								}else{
									angular.extend(detailItem, itemToAdd);
								}
							});
						}
					}
				});
			}

			function getReportLog(items, isShowSingleExecutionInfo){
				let strLog = '';

				_.forEach(items,function(item){
					if (isShowSingleExecutionInfo){
						strLog +=
								item.LineItemCode + '';
					}else{
						strLog +=
								item.LineItemCode + '' +
								$translate.instant('estimate.main.lineItemSelStatement.report.selectionStatement') +
								getSelStatement(item.SelStatementId).Code + '';
					}
					if (item.EstAssemblyFk && item.EstAssemblyFk > 0){
						let assemblyCode = isShowSingleExecutionInfo ? item.AssemblyCode : assemblyDictionary[item.EstAssemblyFk];
						strLog +=
								$translate.instant('estimate.main.lineItemSelStatement.report.setAssemblyTemplate') +
								assemblyCode +  '';
					}
					if (item.BoqItemFk && item.BoqItemFk > 0){
						let boqCode = isShowSingleExecutionInfo ? item.BoqItemReference : boqItemDictionary[item.BoqItemFk];
						strLog +=
								$translate.instant('estimate.main.lineItemSelStatement.report.setBoqItemNoRef') +
								boqCode +  '';
					}
					if (item.WicItemFk && item.WicItemFk > 0){
						let wicCode = isShowSingleExecutionInfo ? item.WicItemReference : wicItemDictionary[item.WicItemFk];
						strLog +=
								$translate.instant('estimate.main.lineItemSelStatement.report.setWicItemNoRef') +
								wicCode +  '';
					}
					if (item.PsdActivityFk && item.PsdActivityFk > 0){
						let activityCode = isShowSingleExecutionInfo ? item.PsdActivityCode : activityDictionary[item.PsdActivityFk];
						strLog +=
								$translate.instant('estimate.main.lineItemSelStatement.report.setActivity') +
								activityCode +  '';
					}
					if (item.Quantity && item.Quantity > 0){
						let quantity = isShowSingleExecutionInfo ? item.Quantity : item.Quantity;
						strLog +=
								$translate.instant('estimate.main.lineItemSelStatement.report.setQuantity') +
								quantity +  '';
					}
					if (item.MdlModelFk && item.MdlModelFk > 0){
						let modelCode = isShowSingleExecutionInfo ? item.MdlModelCode : modelDictionary[item.MdlModelFk];
						strLog +=
							$translate.instant('estimate.main.lineItemSelStatement.report.setModelObject') +
							modelCode +  '';
					}
					if (item.BoqSplitQuantityFk && item.BoqSplitQuantityFk > 0){
						// let modelCode = isShowSingleExecutionInfo ? item.MdlModelCode : modelDictionary[item.MdlModelFk];
						strLog +=
							$translate.instant('estimate.main.lineItemSelStatement.report.setBoqItemWithBoqSplitQty');
						// $translate.instant('estimate.main.lineItemSelStatement.report.setModelObject') +
						// modelCode +  '';
					}
					if (item.HasResPrcPackage){
						strLog +=
							$translate.instant('estimate.main.lineItemSelStatement.report.setAssemblyButResourceHasPackage');
					}
				});
				return strLog;
			}

			function getSelStatement(id){
				return _.find(estimateMainLineItemSelStatementListService.getList(), { Id: id }) || {};
			}
		}
	]);
})(angular);
