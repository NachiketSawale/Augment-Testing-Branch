/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';
	const serviceName = 'modelAdministrationDataTreeLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataTreeLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to model data trees for a lookup.
	 */
	angular.module(moduleName).factory(serviceName, modelAdministrationDataTreeLookupDataService);

	modelAdministrationDataTreeLookupDataService.$inject = ['_', '$translate',
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function modelAdministrationDataTreeLookupDataService(_, $translate,
		platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			dispMember: 'DescriptionInfo.Translated',
			valMember: 'Id',
			columns: [{
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 250,
				name$tr$: 'cloud.common.entityDescription'
			}, {
				id: 'LevelCount',
				field: 'LevelCount',
				formatter: 'integer',
				width: 100,
				name$tr$: 'model.administration.dataTree.levelCount'
			}, {
				id: 'PropKeys',
				field: 'PropertyKeyNames',
				formatter: 'description',
				width: 350,
				name$tr$: 'model.administration.dataTree.propKeyNames'
			}, {
				id: 'NodeCount',
				field: 'NodeCount',
				formatter: 'integer',
				width: 100,
				name$tr$: 'model.administration.dataTree.nodeCount'
			}],
			uuid: 'df2fcd3fcfdb47238d085109e6aafbf6'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/datatree/',
				endPointRead: 'listHeaders'
			},
			dataProcessor: [{
				processItem: function (item) {
					if (_.isEmpty(_.get(item, 'DescriptionInfo.Translated'))) {
						item.DescriptionInfo = {
							Translated: $translate.instant('model.administration.dataTree.defaultHierarchyDesc', {
								id: item.Id,
								propKeyNames: item.PropertyKeyNames,
								root: item.RootDescription || item.RootCode
							})
						};
					}
				}
			}]
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		return container.service;
	}
})(angular);
