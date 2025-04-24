(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyUtilisableGroupService
	 * @function
	 *
	 * @description
	 * basicsCompanyUtilisableGroupService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyUtilisableGroupService', ['_', 'globals', 'basicsCompanyMainService', 'platformDataServiceFactory',
		'basicsCompanyUtilisableGroupValidationProcessor', 'basicsCompanyUtilisableGroupEvaluateChildrenProcessor', 'platformRuntimeDataService',

		function (_, globals, basicsCompanyMainService, platformDataServiceFactory, basicsCompanyUtilisableGroupValidationProcessor,
			basicsCompanyUtilisableGroupEvaluateChildrenProcessor, platformRuntimeDataService) {

			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyUtilisableGroupService',
					entityNameTranslationID: 'basics.company.listUtilisableGroupTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/utilisablegroup/'
					},
					dataProcessor: [
						basicsCompanyUtilisableGroupEvaluateChildrenProcessor
					],

					actions: {
						delete: true, create: 'flat', canDeleteCallBackFunc: function (selectedGroup) {
							return !selectedGroup.isParentGroupWithAssignedChildren;
						}
					},
					entityRole: {leaf: {itemName: 'UtilisableGroup', parentService: basicsCompanyMainService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsCompanyUtilisableGroupValidationProcessor;

			service.takeOverUtilisableParents = function takeOverUtilisableParents(completeResponse, selectedCompanyId) {
				if (completeResponse.UtilisableGroupToSave && completeResponse.UtilisableGroupToSave.length && serviceContainer.data.itemList.length) {
					var item = serviceContainer.data.itemList[0];
					if (item.CompanyFk === selectedCompanyId) {
						var notify = false;
						_.forEach(completeResponse.UtilisableGroupToSave, function (group) {
							var result = !_.find(serviceContainer.data.itemList, function (item) {
								return group.Id === item.Id;
							});

							if (result) {
								serviceContainer.data.itemList.push(group);
								notify = true;
							}
						});

						if (notify) {
							serviceContainer.data.listLoaded.fire();
						}
					}
				}

				if (completeResponse.UtilisableGroupToDelete) {
					setParentsEditable(completeResponse.UtilisableGroupToDelete);
				}

			};

			function setParentsEditable(UtilisableGroupToDelete) {
				_.forEach(UtilisableGroupToDelete, function (itemDelete) {
					_.forEach(serviceContainer.data.itemList, function (item) {
						if (itemDelete.Id === item.ChildId) {
							item.isParentGroupWithAssignedChildren = false;
							platformRuntimeDataService.readonly(item, [
								{field: 'GroupFk', readonly: false}
							]);
						}
					});
				});
			}

			serviceContainer.service.canCreate = function canCreate() {
				let selComp = basicsCompanyMainService.getSelected();

				return !_.isNil(selComp) && selComp.CompanyTypeFk === 1;
			};

			return serviceContainer.service;

		}]);
})(angular);
