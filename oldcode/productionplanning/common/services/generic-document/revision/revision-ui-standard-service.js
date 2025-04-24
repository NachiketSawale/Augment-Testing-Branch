/**
 * Created by anl on 1/29/2023.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	let moduleName = 'productionplanning.common';
	let module = angular.module(moduleName);

	module.factory('ppsGenericDocumentRevisionUIStandardService', GenericDocumentRevisionUIStandardService);

	GenericDocumentRevisionUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'productionplanningCommonTranslationService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'platformObjectHelper'];

	function GenericDocumentRevisionUIStandardService(
		PlatformUIStandardConfigService,
		productionplanningCommonTranslationService,
		platformSchemaService,
		platformUIStandardExtentService,
		platformObjectHelper) {

		let groups = [{
			gid: 'basic',
			attributes: ['description', 'barcode', 'commenttext', 'originfilename']
		}, {
			gid: 'version',
			attributes: ['revision']
		}, {
			gid: 'entityHistory',
			isHistory: true
		}];
		let addition = {grid: platformObjectHelper.extendGrouping([])};

		let layout = {
			fid: 'productionplanning.common.generic.document.revision',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: groups,
			overloads: {
				originfilename: {readonly: true},
				revision: {readonly: true}
			},
			addition: addition
		};

		let properties = platformSchemaService.getSchemaFromCache({
			typeName: 'GenericDocumentRevisionDto',
			moduleSubModule: 'ProductionPlanning.Common'
		}).properties;

		let service = new PlatformUIStandardConfigService(layout, properties, productionplanningCommonTranslationService);
		platformUIStandardExtentService.extend(service, layout.addition, properties);

		return service;
	}
})(angular);