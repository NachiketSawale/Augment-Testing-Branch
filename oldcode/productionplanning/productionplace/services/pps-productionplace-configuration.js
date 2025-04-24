(function () {
	'use strict';
	/* global angular _ */

	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceLayoutFactory', [
		'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsCommonUomDimensionFilterService',
		function (platformLayoutHelperService, basicsLookupdataConfigGenerator,
			uomFilterService) {

			function getOverloads(overloads) {
				var ovls = {};
				if (overloads) {
					_.forEach(overloads, function (ovl) {
						var ol = getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}

				return ovls;
			}

			function getOverload(overload) {
				var ovl = null;
				switch (overload) {
					case 'islive':
						ovl = {readonly: true};
						break;
					case 'ppsprodplacetypefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsproductplacetype', null, {
							showIcon: true,
							customBoolProperty: 'CANHAVECHILDREN'
							// customIntegerProperty: 'CANHAVECHILDREN',
							// customIntegerProperty1: 'ISMANUAL'
						});
						break;
					case 'resresourcefk':
						ovl = platformLayoutHelperService.provideResourceLookupOverload();
						var additionalFilters = [{
							getAdditionalEntity: function (prodPlace) {
								return {
									siteId: prodPlace.BasSiteFk
								};
							},
							siteFk: 'siteId',
							siteFkReadOnly: true
						}];
						_.set(ovl, 'grid.editorOptions.lookupOptions.additionalFilters', additionalFilters);
						_.set(ovl, 'detail.options.lookupOptions.additionalFilters', additionalFilters);
						break;
					case 'bassitefk':
						ovl = {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-site-site-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SiteNew',
									displayMember: 'Code',
									version: 3
								},
								width: 70
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupOptions: {
										version: 3
									},
									lookupDirective: 'basics-site-site-lookup',
									descriptionMember: 'DescriptionInfo.Description'
								}
							}
						};
						break;
					case 'basuomlengthfk':
					case 'basuomwidthfk':
					case 'basuomheightfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							filterKey: uomFilterService.registerLengthDimensionFilter(1)
						});
						break;
				}
				return ovl;
			}

			function createLayout() {
				var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.productionplace.detailform',
					['code', 'description', 'sorting', 'ppsprodplacetypefk', 'resresourcefk', 'bassitefk', 'positionx',
						'positiony', 'positionz', 'islive'],
					[{
						gid: 'dimensions',
						attributes: ['length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk']
					}]);

				layout.overloads = getOverloads(['ppsprodplacetypefk', 'resresourcefk', 'bassitefk', 'islive', 'basuomlengthfk', 'basuomwidthfk', 'basuomheightfk']);
				layout.addAdditionalColumns = true;
				return layout;
			}

			return {
				createLayout: createLayout
			};
		}
	]);

	angular.module(moduleName).factory('ppsProductionPlaceLayoutConfig', [
		'platformObjectHelper',
		function (platformObjectHelper) {
			return {
				addition: {
					grid: platformObjectHelper.extendGrouping([
						{
							afterId: 'bassitefk',
							id: 'siteDesc',
							field: 'BasSiteFk',
							name: 'Site Description',
							name$tr$: 'basics.site.entityDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SiteNew',
								displayMember: 'DescriptionInfo.Description',
								width: 140,
								version: 3
							}
						}
					])
				}
			};
		}
	]);
})();