
/**
 * Created by shen on 28.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectExePlannerItemDataService
	 * @description provides methods to access, create and update resource project execution planner item entities
	 */
	myModule.service('resourceProjectExePlannerItemDataService', ResourceProjectExePlannerItemDataService);

	ResourceProjectExePlannerItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'resourceProjectConstantValues', 'resourceProjectDataService', 'resourceProjectExecPlannerItemReadOnlyProcessor', 'basicsLookupdataLookupFilterService'];

	function ResourceProjectExePlannerItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceProjectConstantValues, resourceProjectDataService, resourceProjectExecPlannerItemReadOnlyProcessor, basicsLookupdataLookupFilterService) {
		let self = this;
		let resourceProjectExePlannerItemServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceProjectExePlannerItemDataService',
				entityNameTranslationID: 'resource.project.execPlannerItemEntity',
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/project/execplanneritems/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceProjectDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceProjectConstantValues.schemes.execPlannerItem), resourceProjectExecPlannerItemReadOnlyProcessor],
				presenter: {},
				entityRole: {
					leaf: {itemName: 'ExecPlannerItem', parentService: resourceProjectDataService}
				}
			}
		};


		let filter = [{
			key: 'document-project-filter',
			serverSide: true,
			serverKey: 'document-project-document-common-filter',
			fn: function () {
				let selected = resourceProjectDataService.getSelected();
				if (selected) {
					return { ProjectFk: selected.Id};
				} else {
					return {};
				}
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filter);


		let serviceContainer = platformDataServiceFactory.createService(resourceProjectExePlannerItemServiceOption, self);
		const service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceProjectExecPlannerItemValidationService'
		}, resourceProjectConstantValues.schemes.execPlannerItem));

		service.registerSelectionChanged(function (e, item) {
			if (item) {
				resourceProjectExecPlannerItemReadOnlyProcessor.processItem(item);
			}
		});

		service.canDelete = function canDelete() {
			var selection = service.getSelected();
			return !!selection && !selection.IsLinkedToRequisition;
		};
	}
})(angular);
