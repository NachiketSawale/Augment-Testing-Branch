/**
 * Created by zwz on 12/16/2020.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.product';
	/**
	 * @ngdoc service
	 * @name productionplanningProductEngProdComponentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of EngProdComponent entities
	 */
	angular.module(moduleName).factory('productionplanningProductEngProdComponentUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformObjectHelper', 'drawingComponentTypes',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningProductTranslationService',
		'productionplanningProductEngProdComponentLayout',
		'productionplanningProductEngProdComponentLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformObjectHelper, drawingComponentTypes,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'EngProdComponentDto',
			moduleSubModule: 'ProductionPlanning.Product'
		});
		var schemaProperties = dtoSchema.properties;

		function EngProdComponentUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		EngProdComponentUIStandardService.prototype = Object.create(BaseService.prototype);
		EngProdComponentUIStandardService.prototype.constructor = EngProdComponentUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		let addition = {
			grid: _.concat(platformObjectHelper.extendGrouping([{
				afterId: 'mdcmaterialcostcodeproductfk',
				id: 'mdcmaterialcostcodeproductfkdescription',
				field: 'MdcMaterialCostCodeProductFk',
				name: '*Result Description',
				name$tr$: 'productionplanning.product.engProdComponent.engMdcMaterialCostCodeProductFkDesc',
				formatter: 'dynamic',
				domain: function (item, column) {
					var prop = drawingComponentTypes.lookupInfo[item.EngDrwCompTypeFk];
					if (prop && prop.column) {
						column.formatterOptions = _.clone(prop.lookup.formatterOptions);
						column.formatterOptions.displayMember = 'DescriptionInfo.Translated';
					} else {
						column.editorOptions = null;
						column.formatterOptions = null;
					}
					return 'lookup';
				}
			}]))
		};

		platformUIStandardExtentService.extend(service, addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
