/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	angular.module('estimate.main').controller('estimateMainLineItemAssignAssemblyResultReportController', [
		'$scope', 'platformTranslateService', '$translate',
		function ($scope, platformTranslateService, $translate) {

			let data = $scope.$parent.modalOptions.dataItems || {};

			processData(data);

			$scope.modalOptions.headerText = $translate.instant('estimate.main.assignAssembly.reportTitle');
			// $scope.WindowTitle = 'estimate.main.assignAssembly.reportTitle';
			$scope.modalTitle = 'estimate.main.assignAssembly.modalTitle';

			let formConfiguration = {
				fid: 'bulkEditor.changeReport',
				showGrouping: true,
				groups: [
					{
						header: $translate.instant('estimate.main.assignAssembly.unchangedRecords'),
						header$tr$: 'estimate.main.assignAssembly.unchangedRecords',
						gid: 'estimate.main.selstatement.details',
						isOpen: true,
						sortOrder: 120
					}
				],
				rows: [
					{
						gid: 'estimate.main.selstatement.details',
						rid: 'logDetails',
						label: $translate.instant('estimate.main.summaryConfig.exceptionKeys'),
						label$tr$: 'estimate.main.summaryConfig.exceptionKeys',
						type: 'text',
						readonly: true,
						model: 'logDetails',
						visible: true,
						sortOrder: 260,
						height: 300
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

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			function processData(data){
				let lineItemsNoNeedToUpdate = data.lineItemsNoNeedToUpdate || [];
				$scope.dataItem = {};
				$scope.dataItem.logDetails = getReportLog(lineItemsNoNeedToUpdate);
			}

			function getReportLog(items){
				// EstimationCode,ProjectNo
				let strLog ='';
				let prjIds = _.uniq(_.map(items,'ProjectFk'));
				let groupByProjectList = _.groupBy(items,'ProjectFk');
				_.forEach(prjIds,function(prjId){
					if(groupByProjectList[prjId]){

						strLog +='Project Number:'+groupByProjectList[prjId][0].ProjectNo+'';

						let list1= groupByProjectList[prjId];

						let estHeaderIds  =  _.uniq(_.map(list1,'EstHeaderFk'));
						let groupByestHeaderList = _.groupBy(list1,'EstHeaderFk');

						_.forEach(estHeaderIds,function(estHeadId){
							let list2 = groupByestHeaderList[estHeadId];
							strLog += 'Estimate Code:'+ groupByestHeaderList[estHeadId][0].EstimationCode+''+'LineItems Code :';

							_.forEach(list2,function(item){
								strLog += '['+item.Code + '],';
							});

							strLog = strLog.substr(0,strLog.length-1);
							strLog += '';
						});

						strLog += '';
					}
					strLog += '';
				});
				return strLog;
			}
		}
	]);
})(angular);
