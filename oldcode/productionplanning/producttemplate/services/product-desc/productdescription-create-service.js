
(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName).factory('productionplanningProducttemplateProductDescriptionCreateOption', ['productionplanningProducttemplateProductDescriptionUICreateService',
		function (productionplanningProducttemplateProductDescriptionUICreateService) {
		return {
			rootService: 'productionplanningProducttemplateMainService',
			dataService: 'productionplanningProductTemplateCreateService',
			uiStandardService: productionplanningProducttemplateProductDescriptionUICreateService,
			validationService: 'productionplanningProducttemplateProductDescriptionValidationForCreateService',
			fields: ['EngDrawingFk', 'MdcProductDescriptionFk', 'Code'],
			creationData: {'PKey1': null, 'PKey3': null},
			title: ('cloud.common.toolbarInsert'),
			fid: 'basic.lookup.newDialog',
			attributes: {}
		};
	}]);

	angular.module(moduleName).factory('productionplanningProductTemplateCreateService', [
		'$q', 'productionplanningProducttemplateMainService',
		'platformDataValidationService','basicsLookupdataLookupFilterService','productionplanningItemDataService','basicsLookupdataLookupDescriptorService',
		function ($q, productionplanningProducttemplateMainService,
			platformDataValidationService,basicsLookupdataLookupFilterService,productionplanningItemDataService, basicsLookupdataLookupDescriptorService) {
			var service = {};
			let mdcMaterialFk = 0;
			service.createItem = function (creationOptions, customCreationData) {
				mdcMaterialFk = customCreationData.PKey3;
				return productionplanningProducttemplateMainService.createItemByMaterial(creationOptions, customCreationData, function (data) {
					service.updateData = data;
					let mdcProductTemplate = basicsLookupdataLookupDescriptorService.getLookupItem('MDCProductDescriptionTiny', data.MdcProductDescriptionFk);
					service.updateData.Code = mdcProductTemplate !== null ? mdcProductTemplate.Code : '';
					return data;
				});
			};
			service.update = function () {
				if(_.isNil(service.updateData.Code)) {
					service.updateData.Code = 'Is generated'; // the Code will be generated at server side, just to avoid .not core validation issue
				}
				return productionplanningProducttemplateMainService.updateByMaterial({
					'ProductDescriptions': [service.updateData],
					'EntitiesCount': 1,
					'MainItemId': service.updateData.Id,
					'CopyFromMdcProductDescription': true
				}).then(function (result) {
					service.updateData = result.data.ProductDescriptions[0];
					clearValidationErrors();
				});
			};
			service.deleteItem = function () {
				clearValidationErrors();
				service.updateData = null;
				return $q.when(true);
			};
			var filters = [
				{
					key: 'pps-mdc-productdesc-by-material-filter',
					fn: function (entity) {
						return entity.MaterialFk === mdcMaterialFk && entity.IsLive;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			function clearValidationErrors() {
				platformDataValidationService.removeDeletedEntityFromErrorList(service.updateData, productionplanningProducttemplateMainService);
			}

			service.isOkDisable = function isOkDisable (){
				return _.isNil(service.updateData) || _.isNil(service.updateData.EngDrawingFk) || service.updateData.EngDrawingFk === 0 ;
			}

			return service;
		}]);

})(angular);
