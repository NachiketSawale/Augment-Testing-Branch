(function(){
	'use strict';
	/* global _ */
	var moduleName ='constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterImport5DContentController',['$scope','$injector','$translate','platformGridAPI','platformTranslateService','constructionSystemMasterImport5DContentService',
		function ($scope,$injector,$translate,platformGridAPI,platformTranslateService,constructionSystemMasterImport5DContentService) {
			var errorType = {warning: 1, success: 2, error: 3};
			var formConfig = {
				'fid': 'constructionsystem.master.Import5DContent',
				'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
				'showGrouping': false,
				'groups': [
					{
						'gid': 'importConfig',
						'header$tr$': 'constructionsystem.master.Import5DContent',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'fileName',
						'gid': 'importConfig',
						'label$tr$': 'constructionsystem.master.Import5DContentField',
						'label': 'FileName',
						'model': 'ResponseData.FileName',
						'type': 'directive',
						'directive': 'construction-system-master-import-content-file-lookup',
						'options': {
							showClearButton: false
						}
					}
				]
			};
			// var data = $scope.$parent.modalOptions.dataItems || {};

			var resultFormConfiguration = {
				fid: 'bulkEditor.changeReport',
				showGrouping: true,
				groups: [
					{
						header: $translate.instant('constructionsystem.master.TotalRecords'),
						header$tr$: 'constructionsystem.master.TotalRecords',
						gid: 'constructionsystem.master.TotalRecords',
						isOpen: true,
						visible:true,
						sortOrder: 120
					},
					{
						header: $translate.instant('constructionsystem.master.details'),
						header$tr$: 'constructionsystem.master.details',
						gid: 'constructionsystem.master.details',
						isOpen: true,
						visible:true,
						sortOrder: 121
					},
					{
						header: $translate.instant('platform.bulkEditor.details'),
						header$tr$: 'platform.bulkEditor.details',
						gid: 'constructionsystem.master.warningDetail',
						isOpen:true,
						visible:true,
						sortOrder: 122
					}
				],
				rows: [
					{
						gid: 'constructionsystem.master.TotalRecords',
						rid: 'logRecords',
						label: $translate.instant('platform.bulkEditor.logs'),
						label$tr$: 'platform.bulkEditor.logs',
						type: 'text',
						readonly: true,
						model: 'logRecords',
						visible: true,
						sortOrder: 230,
						height: 200
					},
					{
						gid: 'constructionsystem.master.details',
						rid: 'logDetails',
						label: $translate.instant('platform.bulkEditor.logs'),
						label$tr$: 'platform.bulkEditor.logs',
						type: 'text',
						readonly: true,
						model: 'logDetails',
						visible: true,
						sortOrder: 260,
						height: 200
					},
					{
						gid: 'constructionsystem.master.warningDetail',
						rid: 'warningDetail',
						label: $translate.instant('constructionsystem.master.ImportError'),
						label$tr$: 'constructionsystem.master.ImportError',
						type: 'text',
						readonly: true,
						model: 'warningDetail',
						visible: true,
						sortOrder: 260,
						height: 200
					},
				]
			};

			$scope.fileisd94 = false;

			platformTranslateService.translateFormConfig(formConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formOptions = {
				configure: resultFormConfiguration
			};

			$scope.resultFormContainerOptions = {
				formOptions: $scope.formOptions,
			};

			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'OK',
				headerText: $translate.instant('constructionsystem.master.Import5DContent'),
				loadingInfo: 'Is importing...',
				currentStepId: 0,
				dialogLoading: false,
				canShow: false,
				data: null,
				ImportStatus: true
			};

			constructionSystemMasterImport5DContentService.analysisFileComplete.register(analysisResponseData);

			$scope.modalOptions.dataItem ={};

			function analysisResponseData(data, name) {
				if (_.isString(data)) {
					$scope.fileisd94 = false;
					showError(true, data, errorType.error);
				} else {
					showError(false);
					$scope.fileisd94 = true;
					$scope.filename = name;
				}
			}

			function showError(isShow, message, type) {
				$scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type
				};
			}

			$scope.modalOptions.ok = function () {
				$scope.modalOptions.dialogLoading = true;
				if ($scope.modalOptions.currentStepId === 0) {
					constructionSystemMasterImport5DContentService.import5DContent($scope.filename).then(function (res) {

						$scope.modalOptions.currentStepId = 1;
						$scope.modalOptions.dialogLoading = false;

						if(res.data &&  res.data.ImportStatus === 'Succeed'){
							$scope.modalOptions.ImportStatus = 'Succeed';

							var strLog = 'Import succeed!'+ '\n';
							strLog += '\n'+'Cos Group Total Records: ' + res.data.CosGroupCount + '\n';
							strLog += '\n'+'Cos Header Total Records: ' + res.data.CosHeaderCount + '\n';
							strLog += '\n'+'Cos Parameter Total Records: ' + res.data.CosParameterCount + '\n';
							strLog += '\n'+'Work Item Assignments Total Records: ' + res.data.CosWicCount + '\n';

							$scope.modalOptions.dataItem.logRecords = strLog;

							$scope.resultFormContainerOptions.formOptions.configure.groups[0].visible= true;  // report log
							$scope.resultFormContainerOptions.formOptions.configure.groups[1].visible= false; // detail log
							$scope.resultFormContainerOptions.formOptions.configure.groups[2].visible= false; // error log

							if(res.data.cosWorkItemAssignNoSaves && res.data.cosWorkItemAssignNoSaves.length>0) {
								$scope.modalOptions.dataItem.logDetails = getReportLog(res.data.cosWorkItemAssignNoSaves);
								$scope.resultFormContainerOptions.formOptions.configure.groups[1].visible= true;
							}

						}else if(res.data &&  res.data.ImportStatus === 'Failed'){

							$scope.resultFormContainerOptions.formOptions.configure.groups[0].visible= false;
							$scope.resultFormContainerOptions.formOptions.configure.groups[1].visible= false;
							$scope.resultFormContainerOptions.formOptions.configure.groups[2].visible=true;

							$scope.modalOptions.dataItem.warningDetail ='Import failed:'+ res.data.error;


						}else if(res.data &&  res.data.ImportStatus === 'Warning'){

							$scope.resultFormContainerOptions.formOptions.configure.groups[0].visible= false;
							$scope.resultFormContainerOptions.formOptions.configure.groups[1].visible= false;
							$scope.resultFormContainerOptions.formOptions.configure.groups[2].visible= true;

							$scope.modalOptions.dataItem.warningDetail = $translate.instant('constructionsystem.master.Warning');
						}

						$scope.modalOptions.canShow = true;
						$scope.modalOptions.closeButtonText = 'Close';
					});
				}

			};


			function getReportLog(CosWorkItemAssignNoSaveList){

				var strLog ='';
				var items = CosWorkItemAssignNoSaveList;
				var CosGroupIds = _.uniq(_.map(items,'CosGroupGuid'));
				var CosGroupList = _.groupBy(items,'CosGroupGuid');

				_.forEach(CosGroupIds,function(cgId){
					if(CosGroupList[cgId]) {
						strLog +='Cos Group Code:'+CosGroupList[cgId][0].CosGroupCode+'\n';
						var list1= CosGroupList[cgId];


						var cosHeaderIds  =  _.uniq(_.map(list1,'CosHeaderGuid'));
						var cosHeaderList = _.groupBy(list1,'CosHeaderGuid');

						_.forEach(cosHeaderIds,function(cosHeaderId){
							var list2 = cosHeaderList[cosHeaderId];
							strLog += 'Cos Header Code:'+ cosHeaderList[cosHeaderId][0].CosHeaderCode+'\n'+'Wic Boq RefereNo :';

							_.forEach(list2,function(item){
								strLog += '['+item.wicBoqItemRefNo + '],';
							});

							strLog = strLog.substr(0,strLog.length-1);
							strLog += '\n';
						});

						strLog += '\n';
					}
					strLog += '\n';
				});

				return strLog;
			}

			$scope.modalOptions.close = function onCancel() {
				$injector.get('constructionSystemMasterGroupService').load();
				$scope.$close(false);
			};



			$scope.modalOptions.onCancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close({});
			};

			$scope.modalOptions.onClose = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$parent.$close(false);
			};

			$scope.$watch(function () {
				$scope.modalOptions.OKBtnRequirement = $scope.modalOptions.currentStepId === 0 ? !$scope.fileisd94 : $scope.modalOptions.ImportStatus;
			});

			$scope.$on('$destroy', function () {
				constructionSystemMasterImport5DContentService.analysisFileComplete.unregister(analysisResponseData);
			});
		}]);
})(angular);