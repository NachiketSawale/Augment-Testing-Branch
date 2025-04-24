/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	// wizard 'seaqrch LineItem' dialog grid column definition
	angular.module(moduleName).value('estSearchAssembliesColumnsDef',
		{
			getStandardConfigForListView: function () {
				return {
					columns: [
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							formatter : 'code',
							name$tr$: 'cloud.common.entityCode',
							width: 100
						},
						{
							id: 'desc',
							field: 'DescriptionInfo.Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter : 'description',
							width: 100
						},
						{
							id: 'qty',
							field: 'Quantity',
							name: 'Quantity',
							formatter: 'quantity',
							name$tr$: 'cloud.common.entityQuantity',
							width: 100
						}
					]
				};
			}
		}
	);

	/**
	 * @ngdoc service
	 * @name estimateMainSearchLineItemWizardService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * data service for estimate wizard 'search lineItem'.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('estimateMainSearchAssembliesWizardService', [
		'$q', '$window', '$http', 'platformContextService', 'estimateMainService', 'platformCreateUuid','estSearchAssembliesColumnsDef',
		'basicsLookupdataLookupDescriptorService', 'estimateMainSearchAssembliesDialogService',
		'estimateProjectRateBookConfigDataService','platformWindowOpenerService',
		function ($q, $window, $http, platformContextService, estimateMainService, platformCreateUuid, columnsDef,
			lookupDescriptorService, estimateMainSearchAssembliesDialogService,
			estimateProjectRateBookConfigDataService, platformWindowOpenerService) {

			let service = {};
			service.showAssembliesPortalDialog = function showAssembliesPortalDialog() {
				estimateMainSearchAssembliesDialogService.showDialog({
					columns: columnsDef,
					gridData: [],
					inquiryDataFn: inquiryData,
					requestDataFn: requestData
				}).then(function (result) {
					if (result.ok) {
						createData();
					}
				});
			};

			function inquiryData(requestId) {
				let companyCode = platformContextService.getApplicationValue('desktop-headerInfo').companyName.split(' ')[0];
				let roleId = platformContextService.getContext().permissionRoleId;
				let api = '#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=estimate.assemblies&requestid=' + requestId + '&company=' + companyCode + '&roleid=' + roleId;

				// master data filter
				let ids = estimateProjectRateBookConfigDataService.getFilterIds(1);
				let projectId = estimateProjectRateBookConfigDataService.getProjectId();
				if (ids && ids.length > 0) {
					api += '&extparams=' + encodeURIComponent('(filterCategoryIds=' + ids.join(',') + '&projectId='+ projectId +')');
				}

				let url = $window.location.origin + globals.appBaseUrl + api;
				let win = platformWindowOpenerService.openWindow(url);                                         // $window.open(url);

				if (win) {
					win.focus();
				}
			}

			function requestData(requestId) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/requestlineitems', {Value: requestId});
			}

			function createData() {
				// add logic to create copied line items
				let data = {
					'LineItems': estimateMainSearchAssembliesDialogService.dataService.getList(),
					'ProjectId': estimateMainService.getSelectedProjectId(),
					'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
					'FromAssembly': 'AssemblyMaster',
					'IsLookAtCopyOptions': true,
					'IsCopyByDragDropSearchWizard': true
				};

				if (data.LineItems.length > 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/saverequestdata', data).then(function () {
						estimateMainService.load();
					});
				}
			}

			return service;
		}
	]);
})(angular);
