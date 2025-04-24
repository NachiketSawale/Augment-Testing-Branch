/**
 * @ngdoc controller
 * @name procurementContractReportsController
 * @function
 *
 * @description
 * Controller for reporting sidebar.
 */

(function () {
	'use strict';

	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,console,_ */
	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('procurementContractReportsController',
		['$scope', 'procurementContractHeaderDataService', 'platformContextService', 'cloudDesktopSidebarService', 'platformModalService', 'reportingPlatformService', 'platformTranslateService',
			function ($scope, procurementContractHeaderDataService, platformContextService, cloudDesktopSidebarService, platformModalService, reportingPlatformService, platformTranslateService) {

				function createOrderReport() {
					if (procurementContractHeaderDataService.hasSelection()) {
						var report = {
							Name: 'Order',
							TemplateName: 'Order_fonsize10.frx',
							Path: 'system\\procurement\\contract'
						};

						// noinspection JSCheckFunctionSignatures
						reportingPlatformService.getParameters(report).then(function (result) {
							report.Parameters = result;

							_.each(result, function(param) {
								switch (param.Name) {
									case 'CompanyID':
										param.ParamValue = platformContextService.signedInClientId;
										break;

									case 'ConHeaderID':
										param.ParamValue = procurementContractHeaderDataService.getSelected().Id;
										break;
								}
							});

							console.log(result);
							// noinspection JSCheckFunctionSignatures
							reportingPlatformService.prepare(report).then(reportingPlatformService.show);
						});
					}
				}

				var reportsList = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Contract',
							text$tr$: 'procurement.contract.reportsContractGroupTitle',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 11,
									text: 'Order',
									text$tr$: 'procurement.contract.orderReportTitle',
									type: 'item',
									showItem: true,
									fn: createOrderReport
								}
							]
						}
					]
				};

				$scope.sidebarOptions = {
					name: cloudDesktopSidebarService.getSidebarIds().reports,
					title: 'Reports',
					reports: reportsList,
					showItemFunction: showItemFunction
				};

				function showItemFunction(id) {
					var itemById;
					// get group-element in list
					for(var i=0; i < reportsList.items.length; i++) {
						// get list-Element from found group-element
						itemById = _.find(reportsList.items[i].subitems, 'id', id);
						// Execute function
						if(itemById) {
							itemById.fn();
							break;
						}
					}
				}

				var loadTranslations = function () {
					platformTranslateService.translateObject(reportsList, ['text']);
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// un-register on destroy
				$scope.$on('$destroy', function () {
					// platformTranslateService.translationChanged.unregister(loadTranslations);
				});

			}]);
})();