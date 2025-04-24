/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainResourceTypeLookup
	 * @requires  estimateMainLookupService
	 * @description ComboBox to select the resource Type
	 */

	angular.module(moduleName).directive('estimateMainResourceTypeLookup', ['$q', '$injector', 'platformGridAPI', 'estimateMainLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainResourceService', 'estimateMainResourceTypeLookupService', 'basicsLookupdataLookupFilterService',
		function ($q, $injector, platformGridAPI, estimateMainLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateMainResourceService, estimateMainResourceTypeLookupService, basicsLookupdataLookupFilterService) {
		// spec for valueMember, doesn't get from 'Id' column, but from other columns('EstResourceTypeFk')

			let lookupOptions = {};

			let defaults = {
				lookupType: 'resourcetype',
				valueMember: 'Id',
				displayMember: 'ShortKeyInfo.Translated',
				uuid: '96ceafc83087442fb71d537ddde18ba8',
				autoSearch: false,
				columns: [
					{
						id: 'ShortKey',
						field: 'ShortKeyInfo.Translated',
						name: 'ShortKey',
						formatter: 'description',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let selectedItem = args.selectedItem;
							let selectedResource = args.entity;
							if(selectedItem !== null && selectedItem.EstResourceTypeFk) {
								selectedResource.EstResourceTypeFk = selectedItem.EstResourceTypeFk;
								selectedResource.EstAssemblyTypeFk = selectedItem.EstAssemblyTypeFk ? selectedItem.EstAssemblyTypeFk : null;
								selectedResource.EstResKindFk = selectedItem.EstResKindFk ? selectedItem.EstResKindFk : null;
							}
							if(lookupOptions && lookupOptions.usageContext){
								let usageContextService = $injector.get(lookupOptions.usageContext);
								if(usageContextService && angular.isFunction(usageContextService.markItemAsModified)){
									usageContextService.markItemAsModified(selectedResource);
								}
							}else{
								estimateMainResourceService.markItemAsModified(selectedResource);
							}
						}
					}
				],
				filterKey: 'estimate-main-resource-type-lookup-filter',
				onDataRefresh: function ($scope) {
					estimateMainResourceTypeLookupService.reLoad().then(function (data) {
						let filterService = basicsLookupdataLookupFilterService.getFilterByKey('estimate-main-resource-type-lookup-filter');
						if (filterService.fn){
							data = _.filter(data, filterService.fn);
						}
						$scope.refreshData(data);
					});
				}
			};

			basicsLookupdataLookupFilterService.registerFilter({
				key: 'estimate-main-resource-type-lookup-filter',
				serverSide: false,
				fn: function (item) {
					return item.IsLive;
				}
			});

			let ret =  new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'estimateMainLookupTypes',
				dataProvider: {
					getList: function () {
						let deferred = $q.defer();
						deferred.resolve(estimateMainResourceTypeLookupService.getListFactory());
						return deferred.promise;
					},
					getItemByKey: function (value,option,scope) {
						let list = estimateMainResourceTypeLookupService.getList();
						let selectedResource = scope.entity;
						if(selectedResource && selectedResource.EstAssemblyTypeFk){
							return $q.when(_.find(list, {EstResourceTypeFk: selectedResource.EstResourceTypeFk, EstAssemblyTypeFk: selectedResource.EstAssemblyTypeFk}));
						}else  if(selectedResource && selectedResource.EstResKindFk){
							return $q.when(_.find(list, {EstResKindFk: selectedResource.EstResKindFk}));
						}
						return $q.when(_.find(list, {Id: value}));
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					angular.extend(lookupOptions, $scope.options);
				}]
			});

			return ret;
		}
	]);
})(angular);
