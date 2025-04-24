(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceWizardImportResultService',
		['$q', '_', '$translate', '$http', '$state', '$timeout', 'procurementInvoiceHeaderDataService',
			'platformTranslateService', 'platformModalService', 'basicsWorkflowInstanceService', 'basicsWorkflowInstanceStatus', 'ServiceDataProcessDatesExtension',
			function ($q, _, $translate, $http, $state, $timeout, invoiceHeaderDataService,
				platformTranslateService, platformModalService, basicsWorkflowInstanceService, wfStatus, ServiceDataProcessDatesExtension) {

				var service = {};
				var fileNameInfos = [];
				var workFlowParam = {};

				service.modalOptions = {
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'procurement.invoice/partials/import-invoice-result-dialog.html',
					headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
					bodyText: 'Import result:',
					headerText: 'Import Invoice',
					cancelBtnText: 'OK',
					dialogLoading: true,
					loadingInfo: 'Is Importing...',
					columns: [
						{
							id: 'Status',
							field: 'Status',
							name: 'Status',
							name$tr$: 'procurement.common.import.status',
							width: 100
						},
						{
							id: 'WorkFlowStatus',
							field: 'WorkFlowStatus',
							name: 'WorkFlowStatus',
							name$tr$: 'procurement.common.import.workflowstatus',
							width: 100
						},
						{
							id: 'Barcode',
							field: 'BarCode',
							name: 'Barcode',
							name$tr$: 'procurement.common.import.barcode',
							width: 100
						},
						{
							id: 'InvoiceCode',
							field: 'InvoiceCode',
							name: 'Invoice Code',
							name$tr$: 'procurement.common.import.Code',
							width: 140
						},
						{
							id: 'InvoiceDescription',
							field: 'InvoiceDescription',
							name: 'Invoice Description',
							name$tr$: 'procurement.common.import.description',
							width: 140
						},
						{
							id: 'BusinessPartner',
							field: 'BusinessPartner',
							name: 'Business Partner',
							name$tr$: 'procurement.common.import.businessPartner',
							width: 130
						},
						{
							id: 'Contract',
							field: 'ContractCode',
							name: 'Contract',
							name$tr$: 'procurement.common.import.contract',
							width: 130
						},
						{
							id: 'Project',
							field: 'ProjectNo',
							name: 'Project',
							name$tr$: 'procurement.common.import.project',
							'width': 100
						},
						{
							id: 'InvoiceDate',
							field: 'InvoiceDate',
							name: 'Invoice Date',
							formatter: 'dateutc',
							name$tr$: 'procurement.common.import.date',
							width: 100
						},

						{
							id: 'Error',
							field: 'Error',
							name: 'Error',
							name$tr$: 'procurement.common.import.error',
							width: 100
						},
						{
							id: 'Warning',
							field: 'Warning',
							name: 'Warning',
							name$tr$: 'procurement.common.import.warning',
							width: 100
						},
						{
							id: 'XmlFile',
							field: 'XmlFile',
							name: 'Xml File',
							name$tr$: 'procurement.common.import.xmlFile',
							width: 100
						},
						{
							id: 'DocumentFile',
							field: 'DocumentFile',
							name: 'File',
							name$tr$: 'procurement.common.import.file',
							width: 150
						}
					],
					width: '800px'
				};
				service.getDataList = function () {
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/importvoice', fileNameInfos).then(function (importRes) {
						if (importRes && importRes.data) {
							var res = [];

							angular.forEach(importRes.data, function (item) {
								res.push({
									Id: item.Id,
									InvHeaderFk: item.InvHeaderFk,
									Status: item.Status,
									BarCode: item.BarCode,
									InvoiceCode: item.InvoiceCode,
									InvoiceDescription: item.InvoiceDescription,
									BusinessPartner: item.BusinessPartner,
									ContractCode: item.ContractCode,
									ProjectNo: item.ProjectNo,
									InvoiceDate: item.InvoiceDate,
									Error: item.Error,
									Warning: item.Warning,
									XmlFile: item.XmlFile,
									DocumentFile: item.DocumentFile,
									WorkFlowStatus: item.WorkFlowStatus
								});
							});

							defer.resolve(res);
						} else {
							defer.reject({apply: false, error: 'import failed'});
						}

					}, function (errorInfo) {
						defer.reject(errorInfo);
					});
					return defer.promise;
				};

				service.executeWorkflow = function executeWorkflow(items) {
					var succeededItems = _.filter(items, function (item) {
						return item.Status === 'Succeeded';
					});
					var params = workFlowParam;

					var promises = [];

					var workFlowMessage;

					if (params.TemplateId) {
						angular.forEach(succeededItems, function (item) {

							promises.push(
								basicsWorkflowInstanceService.startWorkflow(params.TemplateId, item.InvHeaderFk, params.Context).then(function (response) {
									workFlowMessage = wfStatus.getStatusById(response.Status);
									item.Error = !_.isEmpty(item.Error) ? item.Error : '';
									var errorMessage;
									errorMessage = response.errorMessage ? response.errorMessage : '';
									item.Error += errorMessage;
									item.WorkFlowStatus = workFlowMessage;
								}, function (response) {
									item.WorkFlowStatus = $translate.instant('basics.workflow.wizard.statusText.workflowFailed');
									item.Error = !_.isEmpty(item.Error) ? item.Error : '';
									item.Error += response.data && response.data.ErrorMessage ? response.data.ErrorMessage : '';
								})
							);

						});
					} else {
						angular.forEach(succeededItems, function (item) {
							item.WorkFlowStatus = $translate.instant('basics.workflow.wizard.statusText.workflowFailed');
							item.Error = !_.isEmpty(item.Error) ? item.Error : '';
							item.Error += $translate.instant('basics.workflow.wizard.statusText.missingTemplate');
						});
					}

					return $q.all(promises).then(function () {
						return items;
					});
				};

				service.getImportDataWithWorkflowStatus = function () {
					var defer = $q.defer();
					service.getDataList().then(function (items) {
						// defer.resolve(service.executeWorkflow(items));
						defer.resolve(items);
					});
					return defer.promise;
				};

				service.handleResult = function handleResult(result, param) {
					fileNameInfos = [];
					workFlowParam = {};
					var TemplateId = param.TemplateId;
					if (result) {
						angular.forEach(result, function (item) {
							fileNameInfos.push(
								{
									IsLocatedInCompanyFolder: item.IsLocatedInCompanyFolder,
									FileName: item.Description,
									IsErrorFile: item.IsErrorFile,
									TemplateId: TemplateId,
									FileType: item.FileType,
									FolderName: item.FolderName,
								}
							);
						});
						workFlowParam = param;
					}

					platformModalService.showDialog(service.modalOptions);
				};

				service.jumpTo = function jumpTo(ids) {
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/header/listinv', {PKeys: ids}).then(function (response) {
						if (!!response && !!response.data && !!response.data.Main) {
							response.data.Main.forEach(function (item) {
								var fields = ['DateInvoiced', 'DateReceived', 'DatePosted', 'DateNetPayable',
									'DateDelivered', 'DateDeliveredFrom', 'DateDiscount', 'InsertedAt', 'UpdatedAt'];
								(new ServiceDataProcessDatesExtension(fields)).processItem(item);
								// ServiceDataProcessDatesExtension.processItem(item);
							});
							invoiceHeaderDataService.onReadSucceeded(response.data);
							// invoiceHeaderDataService.setList(response.data.Main);
						}
					});
				};

				return service;
			}]);

})(angular);