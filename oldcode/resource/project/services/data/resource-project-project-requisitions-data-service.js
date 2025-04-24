/**
 * Created by shen on 11.04.2024
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectProjectRequisitionsDataService
	 * @description pprovides methods to access, create and update resource project requisitions entities
	 */
	myModule.service('resourceProjectProjectRequisitionsDataService', ResourceProjectProjectRequisitionsDataService);

	ResourceProjectProjectRequisitionsDataService.$inject = ['_', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'platformDataServiceProcessDatesBySchemeExtension', 'resourceProjectDataService'];
	function ResourceProjectProjectRequisitionsDataService(_, platformDataServiceFactory, platformRuntimeDataService,
		platformDataServiceProcessDatesBySchemeExtension, resourceProjectDataService) {
		let self = this;
		let resourceProjectRequisitionServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceProjectProjectRequisitionsDataService',
				entityNameTranslationID: 'resourceProjectRequisitionsEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'resource/requisition/'},
				httpUpdate: {route: globals.webApiBaseUrl + 'resource/requisition/', endUpdate: 'update'},

				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'lookuplistbyfilter',
					initReadData: function initReadData(readData) {
						let selected = resourceProjectDataService.getSelected();
						readData.projectFk = selected.Id;
					},
					usePostForRead: true
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'RequisitionDto',
					moduleSubModule: 'Resource.Requisition'
				}), {processItem:function (item) {
					if(item.IsReadOnlyStatus) {
						platformRuntimeDataService.readonly(item, true);
					}
					else {
						platformRuntimeDataService.readonly(item, [{field:'ProjectFk', readonly :true}]);
					}
				}}],
				entityRole: {
					leaf: {itemName: 'Requisitions', parentService: resourceProjectDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceProjectRequisitionServiceOption, self);
		serviceContainer.data.Initialised = true;

		this.canDelete = function canDelete() {
			let result = true;
			let selected = self.getSelected();
			if(!selected || selected.IsReadOnlyStatus || !_.isNil(selected.ReservedFrom) || !_.isNil(selected.ReservedTo)){
				result = false;
			}
			return result;
		};
	}
})(angular);
