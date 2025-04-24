(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/**
	 * @ngdoc service
	 * @name constructionSystemProjectInstanceHeaderService
	 * @function
	 *
	 * @description
	 * data service for constructionsystem project instanceheader list controller.
	 */
	/* jshint -W072 */
	/* global globals */
	angular.module(moduleName).factory('constructionSystemProjectInstanceHeaderService', [
		'platformDataServiceFactory',
		'projectMainService',
		'basicsCommonReadOnlyProcessorExtension',
		'platformModalService',
		'$http',
		'platformRuntimeDataService',
		'basicsCommonMandatoryProcessor',
		function (
			platformDataServiceFactory,
			projectMainService,
			basicsCommonReadOnlyProcessorExtension,
			platformModalService,
			$http,
			platformRuntimeDataService,
			basicsCommonMandatoryProcessor) {

			var BasicsCommonReadOnlyProcessorExtension;
			BasicsCommonReadOnlyProcessorExtension = basicsCommonReadOnlyProcessorExtension;

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemProjectInstanceHeaderService',
					httpCreate: {route: globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/'},
					httpRead: {route: globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/'},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {
							itemName: 'CosInstanceHeader',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					dataProcessor: [new BasicsCommonReadOnlyProcessorExtension(['ModelFk', 'EstimateHeaderFk', 'BoqHeaderFk','Hint']), {
						processItem: function (item) {
							platformRuntimeDataService.readonly(item, [
								{field: 'ModelOldFk', readonly: !item.IsIncremental},
								{field: 'ModelFk', readonly: (item.ModelFk !== null && item.ModelFk !== undefined)},
								{field: 'Hint', readonly: true}
							]);
						}
					}],
					presenter: {
						list: {
							handleCreateSucceeded: function handleCreateSucceeded(newData) {
								newData.ProjectFk = projectMainService.getIfSelectedIdElse(-1);
							}
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.service.createDeepCopy = function createDeepCopy() {
				if (!container.service.getSelected()) {
					return;
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'constructionsystem.project/templates/copy-instance-header-template.html',
					controller: 'constructionSystemProjectCopyInstanceHeaderController',
					resolve: {
						modelKind: [function () {
							var selected = container.service.getSelected();
							if(selected.ModelFk) {
								return $http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/modelkind?modelId=' + selected.ModelFk).then(function (res) {
									return res.data;
								});
							}
							return 0;
						}]
					}
				}).then(function (res) {
					if (res.ok) {
						var dataList = container.service.getList();
						dataList.push(res.data);
						container.data.listLoaded.fire();
						container.service.setSelected(res.data);
						platformRuntimeDataService.readonly(res.data, [
							{field: 'ModelFk', readonly: (res.data.ModelFk !== null && res.data.ModelFk !== undefined)},
							{field: 'EstimateHeaderFk', readonly: true},
							{field: 'ModelOldFk', readonly: !res.data.IsIncremental},
							{field: 'Hint', readonly: true}
						]);
					}
				});
			};
			// user for reloading items after required  clearprojectstock wizard runed.
			container.service.callRefresh = container.service.refresh || container.data.onRefreshRequested;

			container.service.deepDelete = function () {
				var list = container.service.getList();
				var selected = container.service.getSelected();
				var index = list.indexOf(selected);

				if (selected.Version === 0) {
					container.service.deleteSelection();
				}
				else {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/deleteinstanceheader?InstanceHeaderId=' + selected.Id).then(function () {
						list.splice(index, 1);

						if (list.length > 0) {
							if (index < list.length) {
								selected = list[index];
							}
							else {
								selected = list[list.length - 1];
							}

							container.service.setSelected(selected);
						}

						container.service.gridRefresh();
					});
				}
			};

			let isFilterByCurrentInstance = true;
			container.service.setFilterByCurrentInstance= function(value){
				isFilterByCurrentInstance = value;
			};

			container.service.getFilterByCurrentInstance = function(){
				return isFilterByCurrentInstance;
			};

			// validation processor for new entities
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'InstanceHeaderDto',
				moduleSubModule: 'ConstructionSystem.Project',
				validationService: 'constructionSystemProjectInstanceHeaderValidationService',
				mustValidateFields: ['Code', 'ModelFk', 'EstimateHeaderFk']
			});

			return container.service;
		}
	]);
})(angular);
