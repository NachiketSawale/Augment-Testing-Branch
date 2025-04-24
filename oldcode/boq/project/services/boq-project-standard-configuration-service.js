/**
 * Created by bh on 13.03.2015.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.project';

	/**
	 * @ngdoc service
	 * @name boqProjectStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of boq root entities
	 */
	angular.module(moduleName).factory('boqProjectStandardConfigurationService',
		['platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', '$injector',
			function (platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, $injector) {

				function createBoqProjectDetailLayout() {
					return {
						'fid': 'boq.project.boqdetailform',
						'version': '1.0.0',
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'BasicData',
								'attributes': ['boqheader.boqstatusfk','boqrootitem.reference','boqrootitem.briefinfo','boqrootitem.finalprice','boqrootitem.finalgross','boqrootitem.externalcode','boqheader.bascurrencyfk','boqheader.isgcboq','boqheader.backupdescription','boqheader.backupcomment','boqheader.backupnumber']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'boqrootitem.reference': {
								navigator: {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, boqCompositeItem) {
										$injector.get('boqProjectService').prepareGoTo().then(function() {
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, boqCompositeItem, triggerFieldOption);
										});
									}
								},
								grid:{
									sortOptions: {
										numeric: true
									}
								},
							},
							'boqheader.boqstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.boqstatus', null, {
								showIcon: true
							}),
							'boqheader.bascurrencyfk': { readonly:true, formatter:'lookup', formatterOptions: { lookupType:'currency', displayMember:'Currency' } },
							'boqheader.backupdescription': { readonly:true, grid:{name$tr$:'boq.main.Backup.Description'} },
							'boqheader.backupcomment':     { readonly:true, grid:{name$tr$:'boq.main.Backup.Comment'} },
							'boqheader.backupnumber':      { readonly:true, grid:{name$tr$:'boq.main.Backup.Number'} }
						}
					};
				}

				var boqProjectDetailLayout = createBoqProjectDetailLayout();

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
				var boqProjectAttributeDomains = {};
				boqProjectAttributeDomains = _.merge(boqProjectAttributeDomains, boqItemAttributeDomains, boqHeaderAttributeDomains);

				function BoqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqUIStandardService.prototype.constructor = BoqUIStandardService;

				return new BoqUIStandardService(boqProjectDetailLayout, boqProjectAttributeDomains, boqMainTranslationService);
			}
		]);
})();
