/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';
	const serviceName = 'modelAdministrationDynHlSchemeLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationDynHlSchemeLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to dynamic highlighting schemes for a lookup.
	 */
	angular.module(moduleName).factory(serviceName,
		modelAdministrationDynHlSchemeLookupDataService);

	modelAdministrationDynHlSchemeLookupDataService.$inject = ['_', 'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', 'basicsCommonConfigLocationListService',
		'ServiceDataProcessArraysExtension'];

	function modelAdministrationDynHlSchemeLookupDataService(_, platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator, basicsCommonConfigLocationListService,
		ServiceDataProcessArraysExtension) {

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
			uuid: '265133538a0d472fba4e54b30bc68f63'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/dynhlscheme/',
				endPointRead: 'listschemes'
			},
			listProcessor: [{
				processList: function (items) {
					const includedScopeLevels = {};
					items.forEach(function (item) {
						includedScopeLevels[item.ScopeLevel] = true;
						item.image = 'tlb-icons ico-view-ods';
					});

					const scopeLevels = basicsCommonConfigLocationListService.createItems(includedScopeLevels);

					items.push.apply(items, _.map(scopeLevels, function (sl) {
						return {
							Id: sl.id,
							DescriptionInfo: {
								Translated: sl.name
							},
							IsParentItem: true
						};
					}));
				}
			}],
			dataProcessor: [new ServiceDataProcessArraysExtension(['Children'])],
			tree: {
				parentProp: 'ScopeLevel',
				childProp: 'Children'
			},
			selectableCallback: function (item) {
				return !item.IsParentItem;
			}
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		return container.service;
	}
})(angular);
