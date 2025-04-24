
(function (angular) {
	'use strict';

	function basicsWorkflowDownloadLogActionDirective(_, $rootScope, $compile, $injector, $templateCache, basicsWorkflowClientActionUtilService,
		downloadLogActionService,platformGridAPI, platformCreateUuid,$http,basicsCommonFileDownloadService,$translate,moment) {

		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function compile() {
				return function postLink(scope, iElement, attrs, ngModelCtrl) {
					ngModelCtrl.$render = async function () {

						let templateUrl = 'basics.workflow/download-log.html';
						let html = $templateCache.get(templateUrl);
						await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);
						let context=scope.Context;
						const uuid = platformCreateUuid();
						switch (context.currentModuleName) {
							case 'procurement.package':
								scope.codeTitle = $translate.instant('cloud.common.entityPackageCode');
								break;
							case 'procurement.contract':
								scope.codeTitle = $translate.instant('procurement.package.entityContract.code');
								break;
						}
						let disabledDownloadLogButton =false;
						let disabledDownloadLog=function ()
						{
							return disabledDownloadLogButton;
						};
						let disabledSearch=function ()
						{
							return scope.startDateHasError||scope.endDateHasError;
						};
						scope.gridConfig = {
							id: uuid,
							state: uuid,
							lazyInit: true,
							columns: [
								{
									id: 'id',
									field: 'Id',
									name: 'Id',
									formatter: 'integer',
									name$tr$: 'cloud.common.entityIndex',
									sortable: true,
									width: 250,
								},
								{
									id: 'createTime',
									field: 'CreateTime',
									name: 'CreateTime',
									formatter: 'datetime',
									name$tr$: 'cloud.common.creationTime',
									sortable: true,
									width: 270,
								}
							],
							tools: {
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								items: [
									{
										id: 't4',
										caption: 'cloud.common.toolbarSearch',
										type: 'check',
										iconClass: 'tlb-icons ico-search',
										disabled: disabledSearch,
										fn: function () {
											scope.search();
										}
									},
									{
										id: 't5',
										caption: 'cloud.common.downloadLog',
										type: 'item',
										iconClass: 'tlb-icons ico-download',
										disabled: disabledDownloadLog,
										fn: function () {
											downloadLog();
										}
									}
								]
							},
							options: {
								indicator: true,
								editable: false,
								idProperty: 'Id',
								multiSelect: false,
								hierarchyEnabled: true,
								skipPermissionCheck: true,
								selectionModel: new Slick.RowSelectionModel()
							}
						};

						scope.dateError = '';
						scope.startDateHasError = false;
						scope.endDateHasError = false;

						scope.gridOptions = {
							locationGrid: scope.gridConfig,
							CompanyCode: '',
							ProjectNo: '',
							Code: '',
							StartDate: null,
							EndDate: null
						};
						const requestParament =
							{
								Module: context.currentModuleName,
								CompanyId: context.CompanyId,
								ProjectId: '',
								Code: '',
								CreateTimeStart: null,
								CreateTimeEnd: null
							};

						platformGridAPI.grids.config(scope.gridConfig);
						scope.search = function () {
							requestParament.CreateTimeStart = scope.gridOptions.StartDate;
							requestParament.CreateTimeEnd = scope.gridOptions.EndDate;
							requestParament.Code=scope.gridOptions.Code;
							if(scope.EntityList.length>0)
							{
								let item = _.find(scope.EntityList, {Code: requestParament.Code});
								requestParament.ProjectId=item.ProjectFk;
							}
							$http.post(globals.webApiBaseUrl + 'procurement/package/baseline/getlogbytype', requestParament)
								.then(function (response) {
									let responseData = response.data;
									scope.gridOptions.CompanyCode=responseData.CompanyCode;
									scope.gridOptions.ProjectNo=responseData.ProjectNo;
									if(scope.gridOptions.StartDate===null&&scope.gridOptions.EndDate===null)
									{
										scope.gridOptions.StartDate=moment(responseData.CreateTimeStart);
										scope.gridOptions.EndDate=moment(responseData.CreateTimeEnd);
									}
									if (responseData.LogList&&responseData.LogList.length>0) {
										disabledDownloadLogButton=false;
										let i = 0;
										_.forEach(responseData.LogList, function (item) {
											item.Id = i += 1;
											item.CreateTime=moment(item.CreateTime);
										});
									}
									else
									{
										disabledDownloadLogButton=true;
									}
									platformGridAPI.items.data(uuid, responseData.LogList);
								});
						};
						scope.EntityList=[];
						if(context.Entity===null)
						{
							if(context.EntityIdList!==undefined&&context.EntityIdList.length>0)
							{
								let getEntityListByIdRequest={
									IdList:context.EntityIdList,
									Module:context.currentModuleName
								};
								$http.post(globals.webApiBaseUrl + 'procurement/package/baseline/getentitylistbyid', getEntityListByIdRequest)
									.then(function (response) {
										let responseData = response.data;
										console.log('getentitylistbyid');
										console.log(responseData);
										if (responseData.length>0) {
											requestParament.ProjectId=responseData[0].ProjectFk;
											scope.gridOptions.Code=responseData[0].Code;
											scope.EntityList=responseData;
										}
										initialize();
									});
							}
						}
						else
						{
							requestParament.ProjectId=context.Entity.ProjectFk;
							scope.gridOptions.Code=context.Entity.Code;
							initialize();
						}

						function downloadLog() {
							const item = platformGridAPI.rows.selection({ gridId: uuid });
							$http.post(globals.webApiBaseUrl + 'basics/common/document/getcompressedfilebydirectory?directoryPath=' + item.DirectoryName)
								.then(function (response) {
									if (response.data && response.data.FileName) {
										basicsCommonFileDownloadService.download(null, {
											FileName: response.data.FileName,
											Path: response.data.Path
										});
									}
								});
						}

						let okFn = scope.onOk;
						scope.onOk = function () {
							okFn(scope.task);
						};
						let cancelFn = scope.onCancel;
						scope.onCancel = function () {
							cancelFn();
						};

						scope.validateStartDate = function () {
							const entity = scope.gridOptions;
							const value = scope.gridOptions.StartDate;

							if (value && entity.EndDate) {
								if (Date.parse(entity.EndDate) <= Date.parse(value)) {
									scope.dateError = $translate.instant('cloud.common.Error_EndDateTooEarlier');
									scope.startDateHasError = true;
								} else {
									scope.dateError = '';
									scope.endDateHasError = false;
									scope.startDateHasError = false;
								}
							}
						};
						scope.validateEndDate = function () {
							const entity = scope.gridOptions;
							const value = scope.gridOptions.EndDate;

							if (entity.StartDate && value) {
								if (Date.parse(value) <= Date.parse(entity.StartDate)) {
									scope.dateError = $translate.instant('cloud.common.Error_EndDateTooEarlier');
									scope.endDateHasError = true;
								} else {
									scope.dateError = '';
									scope.startDateHasError = false;
									scope.endDateHasError = false;
								}
							}
						};

						function initialize() {
							scope.search();
						}
						scope.$on('$destroy', function () {
							platformGridAPI.grids.unregister(uuid);
						});
						iElement.html($compile(html)(scope));
					};

				};
			}
		};
	}

	basicsWorkflowDownloadLogActionDirective.$inject = ['_', '$rootScope', '$compile', '$injector', '$templateCache', 'basicsWorkflowClientActionUtilService',
		'downloadLogAction','platformGridAPI', 'platformCreateUuid','$http','basicsCommonFileDownloadService','$translate','moment',];

	angular.module('basics.workflow')
		.directive('basicsWorkflowDownloadLogActionDirective', basicsWorkflowDownloadLogActionDirective);

})(angular);
