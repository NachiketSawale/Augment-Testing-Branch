(function () {
	'use strict';
	var companyModule = angular.module('basics.company');
	companyModule.factory('basicsCompanyNumberService', ['$http', 'globals','_', 'platformDataServiceFactory', 'basicsCompanyRubricCategoryIndexService', 'platformObjectHelper', 'basicsCompanyMainService','platformRuntimeDataService',

		function ($http, globals,_, platformDataServiceFactory, basicsCompanyRubricCategoryIndexService, platformObjectHelper, basicsCompanyMainService, platformRuntimeDataService) {

			var basicsCompanyNumberOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyNumberService',
					entityNameTranslationID: 'basics.company.entityNumber',
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/company/number/', endCreate: 'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/company/number/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initNumberReadData(readData) {
							var comp = basicsCompanyMainService.getSelected();
							if (basicsCompanyMainService.isSelection(comp)) {
								readData.SuperEntityId = comp.Id;
							}
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: canCreate,
						canDeleteCallBackFunc: canDelete,
					},
					entityRole: {
						leaf: {
							itemName: 'CompanyNumber',
							parentService: basicsCompanyMainService
						}
					},
					presenter: {
						list: {
							initCreationData: function initNumberCreationData(creationData) {
								var comp = basicsCompanyMainService.getSelected();
								var rci = basicsCompanyRubricCategoryIndexService.getSelected();
								creationData.SuperEntityId = comp.Id;
								creationData.SuperEntityBigId = rci.RubricId;
								creationData.EntityId = rci.RubricCategoryId;
								creationData.EntityBigId = rci.IndexId;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyNumberOption);
			var data = serviceContainer.data;
			var service = serviceContainer.service;

			function canCreate() {
				var res = false;
				if (!service.hasSelection() && basicsCompanyMainService.hasSelection()) {
					var rci = basicsCompanyRubricCategoryIndexService.getSelected();
					// rubrics dont have an number
					if (platformObjectHelper.isSet(rci) && rci.Type !== 'Rubric') {
						res = true;
					}
				}
				if(isProfitCenter()) {
					setCurrentItemToReadonly();
					res = false;
				}
				return res;
			}

			function canDelete() {
				let res = true;
				if(isProfitCenter()) {
					res = false;
				}
				return res;
			}

			function setCurrentItemToReadonly(){
				let currentItem = service.getSelected();
				if(!_.isNil(currentItem)){
					platformRuntimeDataService.readonly(currentItem, true);
				}
			}

			function isProfitCenter(){
				return  basicsCompanyMainService.getSelected() && basicsCompanyMainService.getSelected().CompanyTypeFk === 3;
			}

			function adjustSelection() {
				var rci = basicsCompanyRubricCategoryIndexService.getSelected();
				if (!platformObjectHelper.isSet(rci) || rci.Type === 'Rubric') {
					service.deselect();
				}
				else {
					var filterCrit = {
						RubricFk: rci.RubricId,
						RubricCategoryFk: rci.RubricCategoryId,
						NumberIndex: rci.IndexId || 0
					};// The "|| 0" is necessary, as NumberIndex is not nullable in database and is defaulted with "0" on company number

					var toSel = _.find(data.itemList, filterCrit) || null;
					service.setSelected(toSel);
					if (toSel === null) {
						data.selectionChanged.fire(null, toSel);
					}
				}
			}

			service.addUsingContainer = function addUsingContainer(guid) {
				data.addUsingContainer(guid);

				if (data.usingContainer.length === 1) {
					basicsCompanyRubricCategoryIndexService.registerSelectionChanged(adjustSelection);
					data.listLoaded.register(adjustSelection);
				}
			};

			service.removeUsingContainer = function removeUsingContainer(guid) {
				data.removeUsingContainer(guid);
				if (data.usingContainer.length === 0) {
					basicsCompanyRubricCategoryIndexService.unregisterSelectionChanged(adjustSelection);
					data.listLoaded.unregister(adjustSelection);
				}
			};

			service.getSequenceById = function getSequenceById(id) {
				return $http.get(globals.webApiBaseUrl + 'basics/company/number/getSequenceById?Id=' + id);
			};

			return service;
		}]);
})(angular);

