/**
 * Created by waz on 3/22/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var module = angular.module(moduleName);

	module.service('productionplanningActivityTrsRequisitionBundleDataServiceSyncManager', DataServiceSyncManager);
	DataServiceSyncManager.$inject = ['$http', 'basicsCommonDataServiceChangeManager'];

	function DataServiceSyncManager($http, basicsCommonDataServiceChangeManager) {

		var Manager = function (bundleDataService, documentDataService) {
			this.bundleDataService = bundleDataService;
			this.documentDataService = documentDataService;
		};

		Manager.prototype.syncBundleAndItemDocuments = function () {
			var subject = this.bundleDataService;
			var observer = this.documentDataService;
			basicsCommonDataServiceChangeManager.registerEvent(subject, observer, 'registerEntityAssigned', refreshDocumentService);
			basicsCommonDataServiceChangeManager.registerEvent(subject, observer, 'registerEntityRemoveAssigned', refreshDocumentService);
		};

		function refreshDocumentService(items, bundleService) {
			var self = this; /* jshint -W040 */ // jshint ignore:line
			var bundleIds = _.map(bundleService.getList(), 'Id');
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/ppsdocument/listForBundles', bundleIds).then(function (response) {
				self.setLoadedItems(response.data);
			});
		}

		return Manager;
	}
})(angular);