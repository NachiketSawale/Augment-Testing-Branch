/**
 * Created by wwa on 9/2/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemMainValidationEnhanceService',
		['platformSchemaService', '$injector', 'constructionSystemMainInstanceService',
			function (platformSchemaService, $injector, constructionSystemMainInstanceService) {
				function extendStatusValidate(validateService, options) {

					var mandatoryValidateProperties = [],
						ignoreField = ['InsertedAt', 'InsertedBy','UpdatedAt','UpdatedBy', 'Version', 'DescriptionInfo',
							'IsDistinctInstances', 'MasterHeaderCode', 'MasterHeaderDescription', 'Status' ].concat(options.ignoreValidateField || []);

					var onlyValidateField = options.onlyValidationFields || [];

					var domains;
					if (!options.typeName || !options.moduleSubModule) {
						return;
					}

					if (mandatoryValidateProperties.length === 0 && onlyValidateField.length === 0) {
						domains = platformSchemaService.getSchemaFromCache({
							typeName: options.typeName,
							moduleSubModule: options.moduleSubModule
						}).properties;

						for (var prop in domains) {
							if (Object.prototype.hasOwnProperty.call(domains,prop) && ignoreField.indexOf(prop) === -1) {
								mandatoryValidateProperties.push(prop);
							}
						}
					}else{
						mandatoryValidateProperties = onlyValidateField;
					}

					angular.forEach(mandatoryValidateProperties, function (prop) {
						var tempProp = prop.replace(/\./g, '$');
						var syncProp = 'validate' + tempProp;

						var validateFn = validateService[syncProp];
						if (validateFn){
							validateService[syncProp] = function(){
								constructionSystemMainInstanceService.updateStatusToModified();
								return validateFn.apply(null, arguments);
							};
						} else{
							validateService[syncProp] = function(){
								constructionSystemMainInstanceService.updateStatusToModified();
								return true;
							};
						}
					});
				}

				return {
					extendValidate: extendStatusValidate
				};

			}]);

})(angular);