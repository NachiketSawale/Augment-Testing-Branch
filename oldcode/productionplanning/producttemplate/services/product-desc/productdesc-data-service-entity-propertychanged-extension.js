/**
 * Created by zwz on 5/13/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	/**
	 * @ngdoc service
	 * @name productionplanningProducttemplateDataServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningProducttemplateDataServiceEntityPropertychangedExtension provides entity property-changed functionality for general product tempalte(product description) data service
	 *
	 */
	angular.module(moduleName).factory('productionplanningProducttemplateDataServiceEntityPropertychangedExtension', service);

	service.$inject = ['$injector'];

	function service($injector) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onMaterialFkChanged = function (entity, field, dataService) {
			if (entity.MaterialFk) {
				// check "IsDefault" of MDC_PRODUCTDESCRIPTION
				var mdcProductDescSrv = $injector.get('productionplanningPpsMaterialProductDescDataService');
				mdcProductDescSrv.getDefaultByMaterial(entity.MaterialFk).then(function (response) {
					if (response.data) {
						let needRefresh = false;
						if (entity.Version <= 0 && response.data.PpsMaterial) { // set defaultUoms for creating ProductDescription(HP-ALM #136483)
							entity.UomFk = response.data.PpsMaterial.BasUomPlanFk;
							entity.UomBillFk = response.data.PpsMaterial.BasUomBillFk;
							needRefresh = true;
						}
						if (response.data.Main) {
							// if true, set default values to empty fields
							var desc = response.data.Main; //MdcProductDescriptionDto
							updateEntity(entity, desc, dataService);
							needRefresh = true;
						}
						if(needRefresh){
							dataService.gridRefresh();
						}
					}
				});
			}
		};

		function updateEntity(entity, mdcProductDesc) {
			// set value for empty described fields according to MDC Product Description
			var fields = ['Code', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'];
			_.each(fields, function (field) {
				if (!entity[field] && mdcProductDesc[field]) {
					entity[field] = mdcProductDesc[field];

					var validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationService');
					if(validationService['validate'+field]){
						validationService['validate'+field](entity,mdcProductDesc[field],field);
					}
					// remark: here we only actually validate mandatory field Code
				}
			});
			if (!entity.DescriptionInfo.Translated && mdcProductDesc.DescriptionInfo.Translated) {
				entity.DescriptionInfo.Translated = mdcProductDesc.DescriptionInfo.Translated;
			}

			// set value for dimensions fields according to MDC Product Description
			fields = ['Length', 'Width', 'Height', 'Weight', 'Area', 'UomFk', 'UomLengthFk', 'UomWidthFk', 'UomHeightFk', 'UomWeightFk', 'UomAreaFk'];
			_.each(fields, function (field) {
				var relField = field;
				if (_.startsWith(field, 'Uom') && field !== 'UomFk') {
					relField = 'Bas' + field;
				}
				entity[field] = mdcProductDesc[relField];
			});

			// remark: regarding validation after field-changed
			// 1. Here we don't validate mandatory fields Length,Width,Height,Weight,Area,UomFk,UomLengthFk,UomWidthFk,UomHeightFk,UomWeightFk and UomAreaFk, because even though value of them are 0, value 0 is a valid value for these fields.
		}

		return service;
	}
})(angular);