/**
 * Created by lnt on 10/27/2017.
 */
(function (angular) {
	/* global  globals */
	'use strict';
	var moduleName = 'qto.main';

	// wizard 'seaqrch  Quantity Takeoff detail' dialog grid column definition
	angular.module(moduleName).service('estSearchQtoDetailColumnsDef', ['qtoMainHeaderDataService', 'qtoMainDetailService',
		function (qtoMainHeaderDataService, qtoMainDetailService) {
			var service = {};
			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: [
						{
							id: 'BoqItemCode',
							field: 'BoqItemFk',
							name$tr$: 'qto.main.boqItem',
							editor: 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-lookup-data-by-custom-data-service',
								'lookupType': 'boqItemLookupDataService',
								'lookupOptions': {
									'enableCache': false,
									'lookupType': 'boqItemLookupDataService',
									'dataServiceName': 'boqItemLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'Reference',
									'filter': function () {
										if (qtoMainHeaderDataService.getSelected()) {
											return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
										}
									},
									'lookupModuleQualifier': 'boqItemLookupDataService',
									'columns': [
										{
											'id': 'Brief',
											'field': 'BriefInfo.Description',
											'name': 'Brief',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityBrief'
										},
										{
											'id': 'Reference',
											'field': 'Reference',
											'name': 'Reference',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityReference'
										},
										{
											'id': 'BasUomFk',
											'field': 'BasUomFk',
											'name': 'Uom',
											'formatter': 'lookup',
											'formatterOptions': {
												lookupType: 'uom',
												displayMember: 'Unit'
											},
											'name$tr$': 'cloud.common.entityUoM'
										}
									],
									'treeOptions': {
										'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
									},
									events: [{
										name: 'onSelectedItemChanged',
										handler: function selectedBoqChanged(e, args) {
											if (args.selectedItem && args.entity) {
												args.entity.BasUomFk = args.selectedItem.BasUomFk;
											}
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqItemLookupDataService',
								dataServiceName: 'boqItemLookupDataService',
								filter: function () {
									if (qtoMainHeaderDataService.getSelected()) {
										return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
									}
								},
								displayMember: 'Reference'
							},
							width: 80
						},
						{
							id: 'BoqItemReference',
							field: 'BoqItemFk',
							name$tr$: 'qto.main.boqItemBrief',
							editor: 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-lookup-data-by-custom-data-service',
								'lookupType': 'boqItemLookupDataService',
								'lookupOptions': {
									'enableCache': false,
									'lookupType': 'boqItemLookupDataService',
									'dataServiceName': 'boqItemLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'BriefInfo.Description',
									'filter': function () {
										if (qtoMainHeaderDataService.getSelected()) {
											return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
										}
									},
									'lookupModuleQualifier': 'boqItemLookupDataService',
									'columns': [
										{
											'id': 'Brief',
											'field': 'BriefInfo.Description',
											'name': 'Brief',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityBrief'
										},
										{
											'id': 'Reference',
											'field': 'Reference',
											'name': 'Reference',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityReference'
										},
										{
											'id': 'BasUomFk',
											'field': 'BasUomFk',
											'name': 'Uom',
											'formatter': 'lookup',
											'formatterOptions': {
												lookupType: 'uom',
												displayMember: 'Unit'
											},
											'name$tr$': 'cloud.common.entityUoM'
										}
									],
									'treeOptions': {
										'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
									},
									events: [{
										name: 'onSelectedItemChanged',
										handler: function selectedBoqChanged(e, args) {
											if (args.selectedItem && args.entity) {
												args.entity.BasUomFk = args.selectedItem.BasUomFk;
											}
										}
									}]
								}
							},
							formatter: 'lookup',
							readonly: false,
							isTextEditable: true,
							formatterOptions: {
								lookupType: 'boqItemLookupDataService',
								dataServiceName: 'boqItemLookupDataService',
								filter: function () {
									if (qtoMainHeaderDataService.getSelected()) {
										return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
									}
								},
								displayMember: 'BriefInfo.Description'
							},
							width: 80
						},
						{
							id: 'SourceBoqItemCode',
							field: 'SourceBoqItemFk',
							name$tr$: 'qto.main.sourceBoqItem',
							editor: '',
							editorOptions: null,
							readyonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqItemLookupDataService',
								dataServiceName: 'boqItemLookupDataService',
								filter: function (dataContext) {
									if (dataContext) {
										return dataContext.SourceBoqHeaderFk;
									}
								},
								displayMember: 'Reference'
							},
							width: 100
						},
						{
							id: 'SourceBoqItemReference',
							field: 'SourceBoqItemFk',
							name$tr$: 'qto.main.sourceBoqItemBrief',
							editor: '',
							editorOptions: null,
							formatter: 'lookup',
							readyonly: true,
							isTextEditable: false,
							formatterOptions: {
								lookupType: 'boqItemLookupDataService',
								dataServiceName: 'boqItemLookupDataService',
								filter: function (dataContext) {
									if (dataContext) {
										return dataContext.SourceBoqHeaderFk;
									}
								},
								displayMember: 'BriefInfo.Description'
							},
							width: 100
						},
						{
							id: 'BasUomFk',
							field: 'BasUomFk',
							name$tr$: 'cloud.common.entityUoM',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Uom',
								displayMember: 'Unit'
							},
							width: 100
						},
						{
							id: 'QtoDetailReference',
							field: 'QtoDetailReference',
							name$tr$: 'qto.main.QtoDetailReference',
							formatter: 'description',
							width: 120
						},
						{
							id: 'PrjLocationFk',
							field: 'PrjLocationFk',
							name$tr$: 'qto.main.PrjLocation',
							editor: 'lookup',
							disableDataCaching: true,
							'editorOptions': {
								'lookupDirective': 'basics-lookup-data-by-custom-data-service',
								'lookupType': 'qtoProjectLocationLookupDataService',
								'lookupOptions': {
									'enableCache': false,
									'lookupType': 'qtoProjectLocationLookupDataService',
									'dataServiceName': 'qtoProjectLocationLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'Code',
									'filter': function () {
										var projectId = qtoMainDetailService.getSelectedProjectId();
										return projectId === null ? -1 : projectId;
									},
									'lookupModuleQualifier': 'qtoProjectLocationLookupDataService',
									'showClearButton': true,
									'columns': [
										{
											'id': 'Code',
											'field': 'Code',
											'name': 'Code',
											'formatter': 'code',
											'name$tr$': 'cloud.common.entityCode'
										},
										{
											'id': 'Description',
											'field': 'DescriptionInfo.Translated',
											'name': 'Description',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityDescription'
										}
									],
									'treeOptions': {
										'parentProp': 'LocationParentFk', 'childProp': 'Locations'
									}
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'qtoProjectLocationLookupDataService',
								dataServiceName: 'qtoProjectLocationLookupDataService',
								filter: function () {
									var projectId = qtoMainDetailService.getSelectedProjectId();
									return projectId === null ? -1 : projectId;
								},
								displayMember: 'Code'
							},
							width: 100
						},
						{
							id: 'PrjLocationDesc',
							field: 'PrjLocationFk',
							name$tr$: 'qto.main.PrjLocationDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'qtoProjectLocationLookupDataService',
								dataServiceName: 'qtoProjectLocationLookupDataService',
								filter: function () {
									var projectId = qtoMainDetailService.getSelectedProjectId();
									return projectId === null ? -1 : projectId;
								},
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 120
						},
						{
							id: 'AssetMasterFk',
							field: 'AssetMasterFk',
							name$tr$: 'qto.main.AssetMaster',
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-asset-master-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'AssertMaster',
								displayMember: 'Code'
							},
							width: 100
						},
						{
							id: 'AssetMasterDesc',
							field: 'AssetMasterFk',
							name$tr$: 'qto.main.AssetMasterDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'AssertMaster',
								displayMember: 'Description'
							},
							width: 100
						},
						{
							id: 'QtoLineTypeFk',
							field: 'QtoLineTypeFk',
							name$tr$: 'qto.main.QtoLineType',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'QtoLineType',
								displayMember: 'Code'
							},
							validator: 'qtoLineTypeValidator',
							width: 130,
							disable: true
						},
						{
							id: 'QtoLineTypeDesc',
							field: 'QtoLineTypeFk',
							name$tr$: 'qto.main.QtoLineTypeDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'QtoLineType',
								displayMember: 'Description'
							},
							width: 130
						}
					]
				};
			};

			return service;
		}]);

	/**
	 * @ngdoc service
	 * @name qtoMainSearchDetailDataWizardService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * data service for qto wizard 'search Quantity Takeoff detail'.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('qtoMainSearchDetailDataWizardService', [
		'$q', '$window', '$http', '$translate', 'platformContextService', 'platformCreateUuid', 'platformSidebarWizardCommonTasksService', 'qtoMainDetailService',
		'estSearchQtoDetailColumnsDef', 'basicsLookupdataLookupDescriptorService', 'qtoMainSearchDataDetailDialogService', 'qtoMainHeaderDataService',
		'qtoHeaderReadOnlyProcessor',
		function ($q, $window, $http, $translate, platformContextService, platformCreateUuid, platformSidebarWizardCommonTasksService, qtoMainDetailService,
			columnsDef, lookupDescriptorService, qtoSearchDataDetailDialogService, qtoMainHeaderDataService,qtoHeaderReadOnlyProcessor) {

			var service = {};
			service.showQtoDetailPortalDialog = function showQtoDetailPortalDialog() {
				var selectedQtoHeader = qtoMainHeaderDataService.getSelected(),
					title = 'qto.main.wizard.qtoDetail.title',
					msg = $translate.instant('qto.main.wizard.create.wip.NoSelectedQto');

				var qtoStatusItem =qtoHeaderReadOnlyProcessor.getItemStatus(selectedQtoHeader);
				var readOnlyStatus = qtoStatusItem && qtoStatusItem.IsReadOnly;
				selectedQtoHeader = !readOnlyStatus ? selectedQtoHeader : null;
				msg = !readOnlyStatus ? msg : $translate.instant('qto.main.wizard.QtoProved');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedQtoHeader, title, msg)) {
					qtoSearchDataDetailDialogService.showDialog({
						columns: columnsDef,
						gridData: [],
						inquiryDataFn: inquiryData,
						requestDataFn: requestData
					}).then(function (result) {
						if (result.ok) {
							createData();
						}
					});
				}
			};

			// open the new window of the 4.0 system
			function inquiryData(requestId) {
				var companyCode = platformContextService.getApplicationValue('desktop-headerInfo').companyName.split(' ')[0];
				var roleId = platformContextService.getContext().permissionRoleId;
				var api = '#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=qto.main&requestid=' + requestId + '&company=' + companyCode + '&roleid=' + roleId;
				var url = $window.location.origin + globals.appBaseUrl + api;
				var win = $window.open(url);

				if (win) {
					win.focus();
				}
			}

			// return the select datas to currenct window
			function requestData(requestId, selectQtoHeaderId) {
				return $http.post(globals.webApiBaseUrl + 'qto/main/detail/requestqtodetails', {Value: requestId, SelectQtoHeaderId: selectQtoHeaderId}).then(function (response) {
					var data = response.data;
					angular.forEach(data, function (item) {
						// page number+line reference+line index, if lineReference.length > 1, it is Onorm qto
						if (item.LineReference.length > 1)
						{
							item.QtoDetailReference = padLeft(item.PageNumber.toString(), 4)  + item.LineReference.toString() + padLeft(item.LineIndex.toString(), 3);
						}
						else
						{
							item.QtoDetailReference = padLeft(item.PageNumber.toString(), 4) + item.LineReference.toString() + item.LineIndex.toString();
						}

						item.Code = item.QtoDetailReference; // TODO: when bulk edit,show the code
					});

					return response;
				});
			}

			function padLeft(num, n) {
				var len = num.toString().length;
				while (len < n) {
					num = '0' + num;
					len++;
				}
				return num;
			}

			// click OK button to create the data
			function createData() {
				var copyData = qtoSearchDataDetailDialogService.dataService.getList();
				if (copyData.length > 0) {
					var oldQtoHeaderFk = copyData[0].oldQtoHeaderFk;
					qtoMainDetailService.copyPaste(true, copyData, oldQtoHeaderFk, undefined, undefined, undefined, undefined, true);
				}
			}

			return service;
		}
	]);
})(angular);

