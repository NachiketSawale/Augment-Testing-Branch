(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemSourceLayout', PpsItemSourceLayout);
	PpsItemSourceLayout.$inject = ['$injector', 'basicsLookupdataConfigGenerator'];
	function PpsItemSourceLayout($injector, basicsLookupdataConfigGenerator) {
		return {
			fid: 'productionplanning.item.sourceLayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [{
					gid: 'baseGroup',
					attributes: ['ordheaderfk', 'boqitemfk', 'ppseventseqconfigfk', 'estheaderfk', 'estlineitemfk', 'estresourcefk', 'ppsplannedquantityfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
			overloads: {
				ordheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesCommonContractLookupDataService',
					moduleQualifier: 'salesCommonContractLookupDataService',
					desMember: 'Code',
					additionalColumns: true,
					addGridColumns: [{
						id: 'ordHeaderDescription',
						field: 'DescriptionInfo.Translated',
						name: 'Order Header Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}],
					filter: function (item) {
					 	return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					navigator: {
						moduleName: 'sales.contract'
					},
					readonly: true
				}),
				boqitemfk: {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BoqItem',
							displayMember: 'Reference'
						}
					},
					navigator: {
						moduleName: 'boq.main',
						navFunc: function (triggerFieldOption, item) {
							var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
							if (boqRuleComplexLookupService) {
								boqRuleComplexLookupService.setNavFromBoqProject();
								$injector.get('boqMainService').setList([]);
								var mainService = $injector.get('productionplanningItemDataService');
								if (mainService) {
									mainService.updateAndExecute(function () {
										var projectId = item.ProjectFk;
										boqRuleComplexLookupService.setProjectId(projectId);
										boqRuleComplexLookupService.loadLookupData().then(function () {
											var boqModule = {moduleName: 'boq.main'};
											item.ProjectFk = projectId;
											triggerFieldOption.NavigatorFrom = 'EstBoqItemNavigator';
											$injector.get('platformModuleNavigationService').navigate(boqModule, item, triggerFieldOption);
										});
									});
								}
							}
						}
					}
				},
				ppseventseqconfigfk: {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EventSequence',
							displayMember: 'Description',
							version: 3
						}
					}
				},
				estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'estimateMainHeaderLookupDataService',
					moduleQualifier: 'estimateMainHeaderLookupDataService',
					desMember: 'Code',
					additionalColumns: true,
					readonly: true,
					filter: function (item) {
						return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					navigator: {
						moduleName: 'estimate.main'
					}
				}),
				estlineitemfk: {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estlineitemlookup',
							displayMember: 'Code'
						}
					}
				},
				estresourcefk: {
					readonly: true,
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estresource4itemassignment',
							displayMember: 'Code'
						}
					}
				},
				ppsplannedquantityfk: {
					readonly: true,
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsPlannedQuantity',
							displayMember: 'Description',
							version: 3
						}
					}
				}
			}
		};
	}
})(angular);
