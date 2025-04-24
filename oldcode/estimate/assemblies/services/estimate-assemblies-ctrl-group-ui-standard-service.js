/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateAssembliesCtrlGroupUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angModule.factory('estimateAssembliesCtrlGroupUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, basicsLookupdataConfigGenerator) {

				function createUnitGroupDetailLayout() {
					return {
						'fid': 'estimate.assemblies.groupdetailform',
						'addValidationAutomatically': true,
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['controllinggroupfk', 'controllinggroupdetailfk']
							}
						],
						'overloads': {
							'controllinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupLookupDataService',
								enableCache: true
							}),
							'controllinggroupdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (item) {
									return item && item.ControllinggroupFk ? item.ControllinggroupFk : null;
								},
								enableCache: true
							})
						}
					};
				}

				let BaseService = platformUIStandardConfigService,
					lineItem2CtrlGrpAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'EstLineitem2CtrlGrpDto',
						moduleSubModule: 'Estimate.Assemblies'
					});

				if (lineItem2CtrlGrpAttributeDomains) {
					lineItem2CtrlGrpAttributeDomains = lineItem2CtrlGrpAttributeDomains.properties;
				}

				function GroupUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				GroupUIStandardService.prototype = Object.create(BaseService.prototype);
				GroupUIStandardService.prototype.constructor = GroupUIStandardService;

				return new GroupUIStandardService(createUnitGroupDetailLayout(), lineItem2CtrlGrpAttributeDomains, estimateAssembliesTranslationService);
			}]);
})();
