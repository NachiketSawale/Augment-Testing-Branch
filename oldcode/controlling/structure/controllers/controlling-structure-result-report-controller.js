/**
 * Created by mov on 10/9/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
     * @ngdoc service
     * @name controllingStructureTransferDataToBisDataController
     * @function
     *
     * @description
     * Controller for a modal dialogue displaying the data in a form container for controllingStructureTransferDataToBisDataController
     **/
	angular.module(moduleName).controller('controllingStructureTransferDataToBisDataController', [
		'_', '$scope', 'platformTranslateService', '$translate', 'estimateMainLineItemSelStatementListService',
		function (_, $scope, platformTranslateService, $translate, estimateMainLineItemSelStatementListService) {

			var data = $scope.$parent.modalOptions.dataItems || {};
			var assemblyDictionary = {};
			var boqItemDictionary = {};
			var wicItemDictionary = {};

			processData(data);

			$scope.modalTitle = $scope.modalOptions.headerText;

			var formConfiguration = {
				fid: 'bulkEditor.changeReport',
				showGrouping: true,
				groups: [
					{
						header: $translate.instant('platform.bulkEditor.records'),
						header$tr$: 'platform.bulkEditor.records',
						gid: 'estimate.main.selstatement.records',
						isOpen: true,
						visible: !_.has(data, 'isShowSingleExecutionInfo'),
						sortOrder: 100
					},
					{
						header: $translate.instant('estimate.main.lineItemSelStatement.report.conflict'),
						header$tr$: 'estimate.main.lineItemSelStatement.report.conflict',
						gid: 'estimate.main.selstatement.conflict',
						isOpen: false,
						visible: !_.has(data, 'isShowSingleExecutionInfo'),
						sortOrder: 110
					},
					{
						header: $translate.instant('platform.bulkEditor.details'),
						header$tr$: 'platform.bulkEditor.details',
						gid: 'estimate.main.selstatement.details',
						isOpen: _.has(data, 'isShowSingleExecutionInfo') || _.has(data, 'errors'),
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
						visible: _.has(data, 'isShowSingleExecutionInfo'),
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
						visible: _.has(data, 'isShowSingleExecutionInfo'),
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

			$scope.onOK = function onOK() {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			function processData(data){
				var listError = data.errors || [];
				var listTotal = data.lineItemsListTotal || [];
				var listConflict = data.lineItemsListConflict || [];
				var listUpdated = data.lineItemsListUpdated || [];
				var assemblies = data.assemblies || [];
				var boqItems = data.boqItems || [];
				var wicItems = data.wicItems || [];

				_.forEach(assemblies, function(item){
					assemblyDictionary[item.Id] = item.Code;
				});
				_.forEach(boqItems, function(item){
					boqItemDictionary[item.Id] = item.Reference;
				});
				_.forEach(wicItems, function(item){
					wicItemDictionary[item.Id] = item.Reference;
				});

				$scope.dataItem = {};

				if (_.has(data, 'isShowSingleExecutionInfo')){
					$scope.dataItem.selStatementCode = getSelStatement(data.selStatement.Id).Code;
					$scope.dataItem.startTime = data.startTime;
					$scope.dataItem.logDetails = getReportLog(getSingleExecutionInfo(data.loggingMessage), true);
				}else{
					if (_.size(listError) > 0){
						$scope.dataItem.hasError = true;
						$scope.dataItem.logDetails = '';
						_.forEach(listError, function(message, selectStatementId){
							$scope.dataItem.logDetails += $translate.instant('estimate.main.lineItemSelStatement.report.selectionStatement') + getSelStatement(parseInt(selectStatementId)).Code + '\n';
							$scope.dataItem.logDetails += message + '\n';
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

				var loggingMessageItems = [];
				_.forEach(loggingMessage.split(';'), function(log){
					resolveAssignedTypeInfo(log, loggingMessageItems);
				});

				return loggingMessageItems;
			}

			function resolveAssignedTypeInfo(log, loggingMessageItems){
				if (_.isEmpty(log)){
					return;
				}
				var item  = {};
				var delimitedData = log.split(',');
				var typeInfoReg = new RegExp('(.*):(.*)');
				_.forEach(delimitedData, function(dataStr){
					var typeInfoMath = typeInfoReg.exec(dataStr);
					if (typeInfoMath.length === 3){
						var typeAssign = typeInfoMath[1].replace(/ /g, '');
						var typeValue = typeInfoMath[2].replace(/ /g, '');

						if (typeAssign === 'boq'){
							angular.extend(item, { BoqItemFk: 1, BoqItemReference: typeValue });
						}else if (typeAssign === 'wic'){
							angular.extend(item, { WicItemFk: 1, WicItemReference: typeValue });
						}else if (typeAssign === 'assembly'){
							angular.extend(item, { EstAssemblyFk: 1, AssemblyCode: typeValue });
						}else if (typeAssign === 'quantity'){
							angular.extend(item, { Quantity: typeValue });
						}
						if (typeAssign === 'lineitems'){
							_.forEach(typeValue.split('|'), function(lineItemCode){
								var itemToAdd = angular.copy(item);
								itemToAdd.LineItemCode = lineItemCode;

								var detailItem = _.find(loggingMessageItems, {'LineItemCode': lineItemCode});
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
				var strLog = '';

				_.forEach(items,function(item){
					if (isShowSingleExecutionInfo){
						strLog +=
                            item.LineItemCode + '\n';
					}else{
						strLog +=
                            item.LineItemCode + '\n' +
                            $translate.instant('estimate.main.lineItemSelStatement.report.selectionStatement') +
                            getSelStatement(item.SelStatementId).Code + '\n';
					}
					if (item.EstAssemblyFk && item.EstAssemblyFk > 0){
						var assemblyCode = isShowSingleExecutionInfo ? item.AssemblyCode : assemblyDictionary[item.EstAssemblyFk];
						strLog +=
                            $translate.instant('estimate.main.lineItemSelStatement.report.setAssemblyTemplate') +
                            assemblyCode +  '\n';
					}
					if (item.BoqItemFk && item.BoqItemFk > 0){
						var boqCode = isShowSingleExecutionInfo ? item.BoqItemReference : boqItemDictionary[item.BoqItemFk];
						strLog +=
                            $translate.instant('estimate.main.lineItemSelStatement.report.setBoqItemNoRef') +
                            boqCode +  '\n';
					}
					if (item.WicItemFk && item.WicItemFk > 0){
						var wicCode = isShowSingleExecutionInfo ? item.WicItemReference : wicItemDictionary[item.WicItemFk];
						strLog +=
                            $translate.instant('estimate.main.lineItemSelStatement.report.setWicItemNoRef') +
                            wicCode +  '\n';
					}
					if (item.Quantity && item.Quantity > 0){
						var quantity = isShowSingleExecutionInfo ? item.Quantity : item.Quantity;
						strLog +=
                            $translate.instant('estimate.main.lineItemSelStatement.report.setQuantity') +
                            quantity +  '\n';
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
