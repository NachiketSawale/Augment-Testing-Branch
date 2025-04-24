/**
 * Created by waz on 4/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	module.service('productionplanningCommonDocumentDataServiceSyncManager', DataServiceSyncManager);
	DataServiceSyncManager.$inject = ['basicsCommonDataServiceChangeManager', '$injector'];

	function DataServiceSyncManager(basicsCommonDataServiceChangeManager, $injector) {

		var Manager = function (dataServiceOptions, documentDataService) {
			this.documentDataService = documentDataService;
			this.dataServiceOptions = dataServiceOptions;
		};

		Manager.prototype.syncDocumentAndRevision = function () {
			var self = this;
			this.documentDataService.registerUploadDone(function (e, uploadFileItem) {
				if (!self.documentDataService.hasSelection()) {
					return;
				}

				var revisionDataService = $injector.get('productionplanningCommonDocumentDataServiceRevisionFactory').getService({
					parentContainerId: self.dataServiceOptions.containerId,
					grandfatherService: self.dataServiceOptions.parentService,
					foreignKey: self.dataServiceOptions.foreignKey
				});
				revisionDataService.createUploadRevision({}, uploadFileItem);
			});
		};

		return Manager;
	}
})(angular);