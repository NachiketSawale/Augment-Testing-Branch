(function () {
	'use strict';
	var moduleName = 'project.main';
	var serviceName = 'prjMainBoqChangeOverviewService';

	/**
     * @ngdoc service
     * @name prjMainBoqChangeOverviewService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('prjMainBoqChangeOverviewService',
		['$translate', 'platformDataServiceFactory', 'projectMainService',
			function ( $translate, platformDataServiceFactory, projectMainService) {

				var selectedPrjHeaderFk = 0;

				var prjBoqChangeOverviewServiceOption = {
					flatNodeItem: {
						module: moduleName,
						serviceName: serviceName,
						entityNameTranslationID: 'project.main.projectBoqChangeOverview',
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/boqchangeoverview/',
							initReadData: function initReadData(readData) {
								var prjHeader = projectMainService.getSelected() || {};
								selectedPrjHeaderFk = prjHeader.Id || 0;
								readData.filter = '?prjFk=' + selectedPrjHeaderFk;
							},
						},
						actions: {  canCreateCallBackFunc: function(){return false;},  delete: {}, canDeleteCallBackFunc: function(){return false;} },
						entitySelection: {},
						setCellFocus:true,
						presenter: {

						},
						entityRole: { node: { moduleName:moduleName,  parentService: projectMainService}},
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

				var serviceContainer = platformDataServiceFactory.createNewComplete(prjBoqChangeOverviewServiceOption);

				return serviceContainer.service;
			}]);

})(angular);