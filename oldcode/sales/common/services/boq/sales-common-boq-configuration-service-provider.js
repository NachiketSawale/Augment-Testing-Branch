/**
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	var moduleName = 'sales.common';
	/**
	 * @ngdoc service
	 * @name salesCommonBoqConfigurationServiceProvider
	 * @function
	 *
	 * @description
	 * creates instances of boq configuration services
	 */
	angular.module(moduleName).factory('salesCommonBoqConfigurationServiceProvider',
		['_', 'platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'boqMainTranslationService',
			function (_, platformUIStandardConfigService, basicsLookupdataConfigGenerator, platformSchemaService, boqMainTranslationService) {

				var BoqConfigurationServiceProvider = function (fid, additionalAttributes) {

					function createBoqDetailLayout(fid, additionalAttrs) {

						var formConfig = {
							'fid': fid,
							'version': '1.0.0',
							addValidationAutomatically: true,
							'groups': [
								{
									'gid': 'BasicData',
									'attributes': ['boqheader.boqstatusfk', 'boqrootitem.reference', 'boqrootitem.briefinfo', 'boqrootitem.finalprice', 'boqrootitem.finalgross', 'boqrootitem.finalpriceoc', 'boqrootitem.finalgrossoc', 'boqrootitem.externalcode', 'boqheader.bascurrencyfk', 'boqheader.isgcboq']
								},
								{
									'gid': 'entityHistory',
									'isHistory': true
								}
							],
							'overloads': {
								'boqheader.bascurrencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'basicsCurrencyLookupDataService',
									enableCache: true,
									readonly: true
								}),
								'boqheader.boqstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.boqstatus', null, {
									showIcon: true
								}),
								'boqrootitem.reference': {
									grid:{
										sortOptions: {
											numeric: true
										}
									},
								}
							}
						};

						if(_.isArray(additionalAttrs)) {
							_.each(additionalAttrs, function(attribute) {
								formConfig.groups[0].attributes.push(attribute);
							});
						}

						return formConfig;
					}

					var boqDetailLayout = createBoqDetailLayout(fid, additionalAttributes);
					var BaseService = platformUIStandardConfigService;

					/**
					 * @ngdoc function
					 * @name addPrefixToProperties
					 * @function
					 * @description Adds the given prefix to all keys of the given original object and returns a copy of this object with the prefixed keys
					 * @param {Object} original object whose keys are to be prefixed
					 * @param {String} prefix that's to be added to the keys of the copied renamed object
					 * @returns {Object} copy of the original whose keys are prefixed
					 */
					var addPrefixToKeys = function addPrefixToKeys(original, prefix) {

						if (angular.isUndefined(original) || original === null || !angular.isString(prefix)) {
							return original;
						}

						var renamed = {};
						var renamedKey;
						var historyKeys = ['Inserted', 'InsertedAt', 'InsertedBy', 'Updated', 'UpdatedAt', 'UpdatedBy'];

						_.each(original, function (value, key) {
							// Leave the history properties unchanged. To the rest add the prefix.
							renamedKey = (historyKeys.indexOf(key) !== -1) ? key : prefix + '.' + key;
							renamed[renamedKey] = value;
						});

						return renamed;
					};

					var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqItemDto',
						moduleSubModule: 'Boq.Main'
					});

					// Add the prefix 'BoqRootItem' to the keys of the properties information because we use them in the context of the BoqCompositeDto
					boqItemAttributeDomains = addPrefixToKeys(boqItemAttributeDomains.properties, 'BoqRootItem');

					var boqHeaderAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqHeaderDto',
						moduleSubModule: 'Boq.Main'
					});

					// Add the prefix 'BoqHeader' to the keys of the properties information because we use them in the context of the BoqCompositeDto
					boqHeaderAttributeDomains = addPrefixToKeys(boqHeaderAttributeDomains.properties, 'BoqHeader');

					// Merge those two ojects that make up the domain of the boqProject
					var boqAttributeDomains = {};
					boqAttributeDomains = _.merge(boqAttributeDomains, boqItemAttributeDomains, boqHeaderAttributeDomains);

					function BoqUIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					BoqUIStandardService.prototype = Object.create(BaseService.prototype);
					BoqUIStandardService.prototype.constructor = BoqUIStandardService;

					return new BoqUIStandardService(boqDetailLayout, boqAttributeDomains, boqMainTranslationService);
				};

				// service api
				return {
					getInstance: function (fid, additionalAttributes) {
						return new BoqConfigurationServiceProvider(fid, additionalAttributes);
					}
				};

			}]);
})();
