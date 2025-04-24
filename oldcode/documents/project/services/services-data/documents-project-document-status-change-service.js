/**
 * Created by lja on 2016-2-14.
 */
(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentProjectDocumentsStatusChangeService',
		[
			'_',
			'basicsCommonChangeStatusService',
			'documentsProjectDocumentDataService',
			'basicsLookupdataSimpleLookupService',
			function (_,basicsCommonChangeStatusService,
				documentsProjectDocumentDataService,
				basicsLookupdataSimpleLookupService) {
				function provideStatusChangeInstance(mainService, moduleName, id) {
					var config = {};
					// trigger document save if the document item is new
					config.mainService = documentsProjectDocumentDataService.getService(
						{
							moduleName: moduleName,
							parentService: mainService
						}
					);
					config.getDataService = function () {
						return documentsProjectDocumentDataService.getService({moduleName: moduleName});
					};
					config.statusName = 'prjdocument';
					config.codeField = 'Description';
					config.descField = 'Description';
					config.statusField = 'PrjDocumentStatusFk';
					config.statusDisplayField = 'Description';
					config.projectField = 'PrjProjectFk';
					config.title = 'cloud.common.documentsStatusChange';
					config.statusProvider = function (entity) {
						return basicsLookupdataSimpleLookupService.refreshCachedData({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'documents.project.documentstatus',
							filter: {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {
							return _.filter(respond, function (item) {
								return (item.RubricCategoryFk === entity.RubricCategoryFk && item.isLive) || (entity.PrjDocumentStatusFk === item.Id);
							});
						});
					};
					config.updateUrl = 'documents/projectdocument/changestatus';
					config.id = id || 12345;

					return basicsCommonChangeStatusService.provideStatusChangeInstance(config);
				}

				return {
					provideStatusChangeInstance: provideStatusChangeInstance
				};
			}]);
})(angular);