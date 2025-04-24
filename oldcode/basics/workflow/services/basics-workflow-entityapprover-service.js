(function (angular) {

	'use strict';
	var moduleName = 'basics.workflow';
	angular.module(moduleName).factory('basicsWorkflowEntityApproversDataService', [
		'globals',
		'_',
		'$http',
		'platformDataServiceFactory',
		'$q',
		'platformDataServiceProcessDatesBySchemeExtension',
		function (
			globals,
			_,
			$http,
			dataServiceFactory,
			$q,
			platformDataServiceProcessDatesBySchemeExtension) {

			var services = {
				controllerService:[],
				 wizardService:[]			 
			};

			function createDataService(parentService, options) {
				var serviceContainer = null,
					tmpServiceInfo = {
						flatLeafItem: {
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/workflow/approver/',
								endRead: 'getEntityApprovers',
								initReadData: function initReadData(readData) {
									var parentSelectedId = getContextFk();
									var entityId = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
									readData.filter = '?entityId=' + entityId + '&entityGUID=' + options.entityGUID;
								}
							},
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var selectedItemId = getContextFk();
										if (selectedItemId === null || selectedItemId === undefined) {
											throw new Error('Please select header data first!');
										}
										creationData.entityId = selectedItemId;
										creationData.entityGUID = options.entityGUID;
									}
								}
							},
							entityRole: {
								leaf: {itemName: 'EntityApprovers', parentService: parentService}
							},
							dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					        	typeName: 'WorkflowApproversDto',
					         	moduleSubModule: 'Basics.Workflow'
				            })],
							translation: {
								uid: options.uuid,
								title: options.title,
								columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
								dtoScheme: {typeName: 'WorkflowApproversDto', moduleSubModule: 'Basics.Workflow'}
							},
							actions: {delete: false, create: false}
						}
					};


				var getContextFk = function () {
					return parentService.getSelected().Id;
				};

				serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);

				var service = serviceContainer.service;

				service.isEntitySelected = function () {
					var selectedEntity = service.getSelected();
					return selectedEntity !== null && !_.isEmpty(selectedEntity);
				};

				var rootService = parentService;
				while (rootService.parentService() !== null) {
					rootService = rootService.parentService();
				}

				return service;
			}

			return {
				getGenericService: function (parentService, options) {
					if(options.isController)
					{
						if (!services.controllerService[options.uuid]) {
						services.controllerService[options.uuid] = createDataService(parentService, options);
						}
						return services.controllerService[options.uuid];
					}
					else
					{
						if (!services.wizardService[options.uuid]) {
						services.wizardService[options.uuid] = createDataService(parentService, options);
						}
						return services.wizardService[options.uuid];
					}
					
				}
			};
		}
	]);
})(angular);
