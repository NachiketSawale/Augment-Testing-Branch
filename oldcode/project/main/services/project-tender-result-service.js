(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainTenderResultService
	 * @function
	 *
	 * @description
	 * projectMainTenderResultService is the data service for all tender result related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainTenderResultService', [
		'_', 'projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', '$injector',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues',
		function (
			_, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, $injector,
			basicsCommonMandatoryProcessor, projectMainConstantValues
		) {

			var tenderResultServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainTenderResultService',
					entityNameTranslationID: 'basics.tenderresult.entityTenderResult',
					presenter: {list: {
						initCreationData: function initCreationData(creationData) {
							var project = projectMainService.getSelected();
							creationData.Id = project.Id;
							delete creationData.MainItemId;
						}
					}},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectMainConstantValues.schemes.tenderResults)],
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/tenderresult/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/main/tenderresult/'},
					entityRole: {
						node: {
							itemName: 'TenderResults',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(tenderResultServiceInfo);
			container.data.Initialised = true;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'TenderResultDto',
				moduleSubModule: 'Project.Main',
				validationService: 'projectMainTenderResultValidationService'
			});

			container.service.updateRankings = function updateRankings() {
				var subMissions = null;

				var itemList = container.data.itemList;

				if(itemList.length > 0) {
					subMissions = _.groupBy(itemList, function (tr){
						if(_.isNumber(tr.SaleFk)) {
							return '' + tr.SaleFk;
						}
						return '_1';
					});
				}

				_.forOwn(subMissions, function (tenderResults) {
					var sortItem = _.sortBy(tenderResults, function (tr){ return tr.FinalQuotation;});
					var ranking = 1;

					_.forEach(sortItem, function (item) {
						if (item.IsActive) {
							if (item.Rank !== ranking) {
								item.Rank = ranking;
								container.service.markItemAsModified(item);
							}
							ranking++;
						}
					});

					_.forEach(sortItem, function (item) {
						if (!item.IsActive) {
							if (item.Rank !== ranking) {
								item.Rank = ranking;
								container.service.markItemAsModified(item);
							}
							ranking++;
						}
					});
				});

				container.data.listLoaded.fire();
			};

			return container.service;

		}]);
})(angular);
