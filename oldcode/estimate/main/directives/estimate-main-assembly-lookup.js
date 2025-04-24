/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainAssemblyLookup
	 * @requires  estimateMainLookupService
	 * @description modal dialog window with assemblies grid to select the assembly
	 */
	// TODO: add container to select assembly category

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('estimateMainAssemblyLookup', ['_', '$q', 'estimateMainLookupService', 'cloudCommonGridService', 'estimateMainCommonService', 'estimateAssembliesImageProcessor', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, estimateMainLookupService, cloudCommonGridService, estimateMainCommonService, estimateAssembliesImageProcessor, BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'estassemblies',
				isTextEditable: true,
				isColumnFilters: true,
				isClientSearch: true,
				disableDataCaching: false,
				autoComplete:false,
				isExactSearch: true,

				buildSearchString: function (value) { // do not remove
					return value;
				},

				treeOptions: {
					parentProp: 'EstLineItemFk', // AssembliesParentFk
					childProp: 'EstLineItems', // Assemblies
					initialState: 'expanded',
					inlineFilters: true,
					idProperty: 'Id',
					autoSearch: false,
					hierarchyEnabled: true,
					dataProcessor: function (dataList) {
						let output = [];
						cloudCommonGridService.flatten(dataList, output, 'EstLineItems'); // Assemblies

						_.forEach(output, function (item) {
							estimateAssembliesImageProcessor.processItem(item);
						});
						return dataList;
					}
				},

				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							estimateMainCommonService.setSelectedLookupItem(selectedItem);
						}
					}
				],
				uuid: 'c53f40933be548719b8c8b0e2ac72d5b',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 80,
						name$tr$: 'cloud.common.entityCode',
						searchable: true
					},

					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 140,
						name$tr$: 'cloud.common.entityDesc',
						searchable: true
					},

					{
						id: 'EstAssemblyCat',
						field: 'EstAssemblyCatFk',
						name: 'Asssembly Category',
						width: 140,
						name$tr$: 'cloud.common.entityDesc',
						searchable: true
					}
				],
				width: 1000,
				height: 800,
				title: {
					name: 'Assemblies',
					name$tr$: 'estimate.main.dialogLookupAssemblies'
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {

				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'EstimateMainAssembliesLookupDataHandler',

					getList: function () {
						let deferred = $q.defer();
						deferred.resolve(estimateMainLookupService.getEstAssembliesList());
						return deferred.promise;
					},

					getDefault: function () {
						return _.find(estimateMainLookupService.getEstAssembliesList(), {IsDefault: true});
					},

					getSearchList: function (value, field) {
						let resultItems = [];
						let list = estimateMainLookupService.getEstAssembliesList();

						if (value !== null && value !== '') {
							if (field === 'Code') {
								resultItems = _.filter(list, function (item) {
									return item.Code.toLowerCase().indexOf(value.toLowerCase()) !== -1;
								});
							}
							else if (field === 'DescriptionInfo.Description' || field === 'DescriptionInfo.Translated') {
								let property = field.substr(field.indexOf('.') + 1);
								let descWords = value.split(' ');

								resultItems = _.filter(list, function (item) {
									let desc = item.DescriptionInfo[property];
									let contains = false;
									for (let i = 0; i < descWords.length; ++i) {
										if (desc.toLowerCase().indexOf(descWords[i].toLowerCase()) !== -1) {
											contains = true;
											break;
										}
									}
									return contains;
								});
							}
						}

						let deferred = $q.defer();
						deferred.resolve(resultItems);
						return deferred.promise;
					}
				}
			});
		}
	]);
})(angular);
