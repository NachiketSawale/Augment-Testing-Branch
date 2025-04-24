/**
 * Created by waz on 3/28/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	module.service('productionplanningCommonDocumentRevisionDataServiceSyncManager', DataServiceSyncManager);
	DataServiceSyncManager.$inject = ['basicsCommonDataServiceChangeManager'];

	function DataServiceSyncManager(basicsCommonDataServiceChangeManager) {

		var Manager = function (revisionDataService, documentDataService) {
			this.revisionDataService = revisionDataService;
			this.documentDataService = documentDataService;
		};

		Manager.prototype.syncDocumentAndRevision = function () {
			basicsCommonDataServiceChangeManager.registerEvent(this.revisionDataService, this.documentDataService, 'registerUploadDone', updateDocument);
		};

		function updateDocument(uploadFileItem) {
			var self = this; // jshint ignore:line
			self.updateLoadedDocument(self.getSelected(), uploadFileItem);
			self.markItemAsModified(self.getSelected());
		}

		return Manager;
	}
})(angular);