/**
 * Created by Benny on 19.10.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesAssemblyTypeLookupDataService
	 * @function
	 *
	 * @description
	 * estimateAssembliesAssemblyTypeLookupDataService is the data service for all assembly type functionality.
	 */
	angular.module(moduleName).factory('estimateAssembliesAssemblyTypeLookupDataService', ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateAssembliesAssemblyTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'ShortKeyInfo.Translated',
				uuid: 'af87381a307c4e7088ea77a4f1fd689d',
				columns: [
					{
						id: 'ShortKey',
						field: 'ShortKeyInfo',
						name: 'ShortKey',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChanged(e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							if(selectedItem){
								args.entity.EstAssemblyTypeLogicFk = selectedItem.EstAssemblyTypeLogicFk;

								// eslint-disable-next-line no-prototype-builtins
								if (Object.hasOwnProperty.call(args.entity, 'PrjProjectFk') && args.entity.PrjProjectFk){
									$injector.get('projectAssemblyStructureProcessor').processItem(args.entity);
								}else{
									$injector.get('estimateAssembliesStructureProcessor').processItem(args.entity);
								}

							}
						}
					}
				]
			});

			let estAssemblyTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/assemblies/assemblytype/', endPointRead: 'list'}
			};
			return platformLookupDataServiceFactory.createInstance(estAssemblyTypeLookupDataServiceConfig).service;
		}]);
})(angular);
