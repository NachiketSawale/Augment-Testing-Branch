/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	const serviceName = 'modelAdministrationDynHlItemByMappingLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationDynHlItemByMappingLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to dynamic highlighting items for a lookup.
	 */
	angular.module(moduleName).factory(serviceName, modelAdministrationDynHlItemByMappingLookupDataService);

	modelAdministrationDynHlItemByMappingLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', 'modelEvaluationRuleset2HlSchemeMappingDataService'];

	function modelAdministrationDynHlItemByMappingLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator, modelEvaluationRuleset2HlSchemeMappingDataService) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			dispMember: 'DescriptionInfo.Translated',
			valMember: 'Id',
			columns: [{
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 150,
				name$tr$: 'cloud.common.entityDescription'
			}],
			uuid: '14cb3171ac524a77b1af70a675f327ee'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/dynhlitem/',
				endPointRead: 'headersbyscheme'
			},
			dataProcessor: [{
				processItem: function (item) {
					item.CompleteId = item.Id;
					item.Id = item.Id.Id;
				}
			}],
			filterParam: 'schemeFk'
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		const state = {
			attachmentCount: 0
		};

		function mappingSelectionUpdated() {
			const selMapping = modelEvaluationRuleset2HlSchemeMappingDataService.getSelected();
			if (selMapping) {
				container.service.setFilter(selMapping.HighlightingScheme.Id);
			} else {
				container.service.setFilter(-1);
			}
		}

		container.service.attachToMappingService = function () {
			if (state.attachmentCount <= 0) {
				modelEvaluationRuleset2HlSchemeMappingDataService.registerSelectionChanged(mappingSelectionUpdated);
				modelEvaluationRuleset2HlSchemeMappingDataService.addUsingContainer(serviceName);
			}
			state.attachmentCount++;
		};

		container.service.detachFromMappingService = function () {
			if (state.attachmentCount > 1) {
				state.attachmentCount--;
			} else {
				if (state.attachmentCount === 1) {
					modelEvaluationRuleset2HlSchemeMappingDataService.removeUsingContainer(serviceName);
					modelEvaluationRuleset2HlSchemeMappingDataService.unregisterSelectionChanged(mappingSelectionUpdated);
				}
				state.attachmentCount = 0;
			}
		};

		return container.service;
	}
})(angular);
