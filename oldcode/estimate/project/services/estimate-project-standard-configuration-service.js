/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for project estimate header container
	 */
	angular.module(moduleName).factory('estimateProjectStandardConfigurationService', ['_', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'estimateProjectUIConfigurationService',

		function (_, platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, estimateProjectUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			/**
			 * @ngdoc function
			 * @name addPrefixToProperties
			 * @function
			 * @description Adds the given prefix to all keys of the given original object and returns a copy of this object with the prefixed keys
			 * @param {Object} original object whose keys are to be prefixed
			 * @param {String} prefix that's to be added to the keys of the copied renamed object
			 * @returns {Object} copy of the original whose keys are prefixed
			 */
			let addPrefixToKeys = function addPrefixToKeys(original, prefix){

				if(angular.isUndefined(original) || original === null || !angular.isString(prefix)){
					return original;
				}

				let renamed = {};
				let renamedKey;
				let historyKeys = ['Inserted', 'InsertedAt', 'InsertedBy', 'Updated', 'UpdatedAt', 'UpdatedBy'];

				_.each(original, function(value, key) {
					// Leave the history properties unchanged. To the rest add the prefix.
					renamedKey = (historyKeys.indexOf(key) !== -1) ? key : prefix + '.' + key;
					renamed[renamedKey] = value;
				});

				return renamed;
			};

			let estimateProjectEstHeaderDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'EstHeaderDto', moduleSubModule: 'Estimate.Main'} );
			if(estimateProjectEstHeaderDomainSchema) {
				// Add the prefix 'BoqRootItem' to the keys of the properties information because we use them in the context of the BoqExtendedDto
				estimateProjectEstHeaderDomainSchema = addPrefixToKeys(estimateProjectEstHeaderDomainSchema.properties, 'EstHeader');
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
			let estimateProjectEstHeaderDetailLayout = estimateProjectUIConfigurationService.getEstimateProjectEstHeaderDetailLayout();
			return new BaseService( estimateProjectEstHeaderDetailLayout, estimateProjectEstHeaderDomainSchema, estimateMainTranslationService);
		}
	]);
})();
