(function (angular) {
	'use strict';
	/* global _ */
	/**
     * @ngdoc service
     * @name constructionSystemMasterResourceValidationService
     * @description provides validation methods for constructionSystemMasterResource
     */
	angular.module('constructionsystem.master').factory('constructionSystemMasterResourceValidationService',
		['$injector', 'constructionsystemMasterResourceDataService', 'estimateMainResourceProcessor',

			function ($injector, constructionsystemMasterResourceDataService, estimateMainResourceProcessor) {
				var service = {};

				service.validateIsDisabled = function validateIsDisabled(entity, value, model){

					let considerDisabledDirect = $injector.get('constructionsystemMasterLineItemDataService').getConsiderDisabledDirect();
					entity.IsDisabledDirect = considerDisabledDirect ? value : false;

					let traverseResource = function traverseResource(resources, disabled, fieldName){
						_.forEach(resources, function(resource){
							let isDisabled =  considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== entity.Id ? resource[fieldName] : disabled) : disabled;
							resource[fieldName] = isDisabled;

							constructionsystemMasterResourceDataService.markItemAsModified(resource);

							if (resource.HasChildren){
								traverseResource(resource.EstResources, isDisabled, fieldName);
							}
						});
					};

					traverseResource([entity], value, model);
					// estimateMainResourceProcessor.processItems(constructionsystemMasterResourceDataService.getList());
					estimateMainResourceProcessor.setDisabledChildrenReadOnly(constructionsystemMasterResourceDataService.getList());
					constructionsystemMasterResourceDataService.gridRefresh();
					return true;
				};

				return service;
			}
		]);
})(angular);
