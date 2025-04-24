/**
 * Created by Badugula on 20.10.2020.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.package';
	var serviceName = 'prcPackageBoqChangeOverviewService';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
     * @ngdoc service
     * @name prcPackageBoqChangeOverviewService
     * @function
     *
     * @description
     * prcPackageBoqChangeOverviewService is the data service for Prc Package Boq Change overview related functionality.
     */
	angular.module(moduleName).factory('prcPackageBoqChangeOverviewService',
		['$translate', 'platformDataServiceFactory', 'procurementPackagePackage2HeaderService',
			function ( $translate, platformDataServiceFactory, procurementPackagePackage2HeaderService) {

				// var canSubpackage = function canSubpackage() {
				//     var selectedPrcPackagepackge = procurementPackagePackage2HeaderService.getSelected();
				//     if(selectedPrcPackagepackge){
				//         return true;
				//     }else{
				//         return false;
				//     }
				// };

				var selectedPrcHeaderFk = 0;

				var prcPackageBoqChangeOverviewServiceOption = {
					flatNodeItem: {
						module: moduleName,
						serviceName: serviceName,
						entityNameTranslationID: 'procurement.package.packageBoqChangeOverview',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/common/boqchangeoverview/',
							initReadData: function initReadData(readData) {
								var prcHeader = procurementPackagePackage2HeaderService.getSelected() || {};
								selectedPrcHeaderFk = prcHeader.PrcHeaderFk || 0;
								var exchangeRate = prcHeader.ExchangeRate;
								readData.filter = '?prcHeaderFk=' + selectedPrcHeaderFk + '&prcPackageFk=' + prcHeader.PrcPackageFk + '&exchangeRate=' + exchangeRate;
							},
						},
						actions: {  canCreateCallBackFunc: function(){return false;},  delete: {}, canDeleteCallBackFunc: function(){return false;} },
						entitySelection: {},
						setCellFocus:true,
						presenter: {

						},
						entityRole: { node: { itemName: 'PrcBoqExtendedd', moduleName:moduleName,  parentService: procurementPackagePackage2HeaderService}},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: false,
								pattern: '',
								pageSize: 100,
								useCurrentClient: null,
								includeNonActiveItems: null,
								showOptions: false,
								showProjectContext: false,
							}
						},
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(prcPackageBoqChangeOverviewServiceOption);

				return serviceContainer.service;
			}]);

})(angular);