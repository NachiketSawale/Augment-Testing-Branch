/**
 * Created by zwz on 2020/7/28.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningPpsMaterialPropertychangedExtension
	 * @function
	 * @requires _, $injector
	 * @description
	 * productionplanningPpsMaterialPropertychangedExtension provides functionality of PpsMaterial Entity
	 */
	module.service('productionplanningPpsMaterialEntityPropertychangedExtension', Extension);

	Extension.$inject = ['_', '$injector'];

	function Extension(_, $injector) {
		var ppsMaterialProperties = ['IsBundled', 'ProdMatGroupFk', 'BasClobsPqtyContent', 'BasClobsBqtyContent', 'BasUomPlanFk', 'BasUomBillFk',
			'MatSiteGrpFk', 'QuantityFormula', 'MatGroupOvrFk', 'MaterialOvrFk', 'IsOverrideMaterial', 'BasUomOvrFk', 'SummarizeMode', 'SummarizeGroup',
			'IsSerialProduction', 'IsForSettlement', 'IsReadonly'];

		function isTextForTemplateNotNull(ppsMaterial) {
			return ppsMaterial.UserdefinedForProddesc1 !== null ||
				ppsMaterial.UserdefinedForProddesc2 !== null ||
				ppsMaterial.UserdefinedForProddesc3 !== null ||
				ppsMaterial.UserdefinedForProddesc4 !== null ||
				ppsMaterial.UserdefinedForProddesc5 !== null;
		}
		function isPpsMaterialNotEmpty(ppsMaterial) {
			return ppsMaterial.IsBundled !== undefined ||
				ppsMaterial.ProdMatGroupFk !== undefined ||
				ppsMaterial.BasClobsPqtyContent !== undefined ||
				ppsMaterial.BasClobsBqtyContent !== undefined ||
				ppsMaterial.BasUomPlanFk !== undefined ||
				ppsMaterial.BasUomBillFk !== undefined ||
				ppsMaterial.MatSiteGrpFk !== undefined ||
				ppsMaterial.QuantityFormula !== undefined ||
				ppsMaterial.MatGroupOvrFk !== undefined ||
				ppsMaterial.MaterialOvrFk !== undefined ||
				ppsMaterial.IsOverrideMaterial !== undefined ||
				ppsMaterial.BasUomOvrFk !== undefined ||
				ppsMaterial.SummarizeMode !== undefined ||
				ppsMaterial.SummarizeGroup !== undefined ||
				ppsMaterial.IsSerialProduction !== undefined ||
				ppsMaterial.IsForSettlement !== undefined ||
				ppsMaterial.IsReadonly !== undefined ||
				isTextForTemplateNotNull(ppsMaterial);
		}

		function isPpsMaterialExistUndefinedProperty(ppsMaterial) {
			return ppsMaterial.IsBundled === undefined ||
				ppsMaterial.ProdMatGroupFk === undefined ||
				ppsMaterial.BasClobsPqtyContent === undefined ||
				ppsMaterial.BasClobsBqtyContent === undefined ||
				ppsMaterial.BasUomPlanFk === undefined ||
				ppsMaterial.BasUomBillFk === undefined ||
				ppsMaterial.MatSiteGrpFk === undefined ||
				ppsMaterial.QuantityFormula === undefined ||
				ppsMaterial.MatGroupOvrFk === undefined ||
				ppsMaterial.MaterialOvrFk === undefined ||
				ppsMaterial.IsOverrideMaterial === undefined ||
				ppsMaterial.BasUomOvrFk === undefined ||
				ppsMaterial.SummarizeMode === undefined ||
				ppsMaterial.SummarizeGroup === undefined ||
				ppsMaterial.IsSerialProduction === undefined ||
				ppsMaterial.IsForSettlement === undefined ||
				ppsMaterial.IsReadonly === undefined;
		}

		this.onPpsMaterialPropertyChanged = function onPpsMaterialPropertyChanged(entity, field) {

			if ((field === 'IsProduct' && _.isNil(entity.PpsMaterial)) || (isPpsMaterialNotEmpty(entity.PpsMaterial) && isPpsMaterialExistUndefinedProperty(entity.PpsMaterial))) {
				var validationService = $injector.get('productionplanningPpsMaterialValidationService');
				const platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				//init mandatory default
				if(_.isNil(entity.PpsMaterial)){
					entity.PpsMaterial = {};
				}
				entity.PpsMaterial.IsBundled = entity.PpsMaterial.IsBundled === undefined ? false : entity.PpsMaterial.IsBundled;
				entity.PpsMaterial.BasClobsPqtyContent = entity.PpsMaterial.BasClobsPqtyContent === undefined ? 'return 1;' : entity.PpsMaterial.BasClobsPqtyContent;
				entity.PpsMaterial.BasClobsBqtyContent = entity.PpsMaterial.BasClobsBqtyContent === undefined ? 'return 1;' : entity.PpsMaterial.BasClobsBqtyContent;
				entity.PpsMaterial.QuantityFormula = entity.PpsMaterial.QuantityFormula === undefined ? 'return value;' : entity.PpsMaterial.QuantityFormula;
				entity.PpsMaterial.IsOverrideMaterial = entity.PpsMaterial.IsOverrideMaterial === undefined ? false : entity.PpsMaterial.IsOverrideMaterial;
				entity.PpsMaterial.BasUomPlanFk = entity.PpsMaterial.BasUomPlanFk === undefined ? entity.UomFk : entity.PpsMaterial.BasUomPlanFk;
				entity.PpsMaterial.BasUomBillFk = entity.PpsMaterial.BasUomBillFk === undefined ? entity.UomFk : entity.PpsMaterial.BasUomBillFk;
				entity.PpsMaterial.SummarizeMode = entity.PpsMaterial.SummarizeMode === undefined ? 0 : entity.PpsMaterial.SummarizeMode;
				entity.PpsMaterial.IsSerialProduction = entity.PpsMaterial.IsSerialProduction === undefined ? false : entity.PpsMaterial.IsSerialProduction;
				entity.PpsMaterial.IsForSettlement = entity.PpsMaterial.IsForSettlement === undefined ? false : entity.PpsMaterial.IsForSettlement;
				entity.PpsMaterial.IsReadonly = entity.PpsMaterial.IsReadonly === undefined ? false : entity.PpsMaterial.IsReadonly;
				ppsMaterialProperties.forEach(function (propertyName) {
					// init undefined properties
					if (entity.PpsMaterial[propertyName] === undefined) {
						entity.PpsMaterial[propertyName] = null;
					}
					// do validation for each PpsMaterail property (if it has corresponding validation function)
					var tempFunc = validationService['validatePpsMaterial$' + propertyName];
					if (_.isFunction(tempFunc)) {
						const model = 'PpsMaterial.' + propertyName;
						const result = tempFunc(entity, entity.PpsMaterial[propertyName], model);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}
				});
			}if(field === 'PpsMaterial.SummarizeMode'){
				let ppsMaterialSumService = $injector.get('productionplanningPpsMateriaSummarizedDataService');
				ppsMaterialSumService.updateMode(entity.PpsMaterial.SummarizeMode);
			}
		};
	}
})(angular);
