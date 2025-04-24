/**
 * Created by sandu on 27.01.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	/* define visibility selection values */
	angular.module('basics.config').value('basicsConfigVisibilityValues', [
		{Id: 1, description$tr$: 'basics.config.visibilityProperty.standardOnly'},
		{Id: 2, description$tr$: 'basics.config.visibilityProperty.portalOnly'},
		{Id: 3, description$tr$: 'basics.config.visibilityProperty.standardPortal'}
	]);

	configModule.factory('basicsConfigWizardGroupLayout', basicsConfigWizardGroupLayout);

	function basicsConfigWizardGroupLayout() {
		return {
			fid: 'basics.config.wizardgroup.layout',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'descriptioninfo', 'sorting', 'isdefault', 'icon', 'isvisible', 'accessrightdescriptor']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {
				'extraModules': ['basics.config'],
				'extraWords': {
					'Name': {location: 'basics.config', identifier: 'entityName', initial: 'Name'},
					'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
					'IsDefault': {location: 'basics.config', identifier: 'entityDefault', initial: 'Default'},
					'Icon': {location: 'basics.config', identifier: 'entityIcon', initial: 'Icon'},
					'IsVisible': {location: 'basics.config', identifier: 'entityIsVisible', initial: 'Is Visible'},
					'AccessRightDescriptor': {
						location: 'basics.config',
						identifier: 'descriptor',
						initial: 'Access Right Descriptor Name'
					}

				}
			},
			'overloads': {
				'icon': {
					'grid': {
						editor: 'imageselect',
						editorOptions: {serviceName: 'basicsConfigWizardGroupIconService'},
						formatter: 'imageselect',
						formatterOptions: {serviceName: 'basicsConfigWizardGroupIconService'}
					}
				},
				'accessrightdescriptor': {readonly: true}
			}
		};
	}

	configModule.factory('basicsConfigWizardXGroupLayout', basicsConfigWizardXGroupLayout);
	basicsConfigWizardXGroupLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector', 'basicsConfigVisibilityValues'];

	function basicsConfigWizardXGroupLayout(basicsLookupdataConfigGenerator, $injector, basicsConfigVisibilityValues) {

		var visibilitySelectOptions = {
			displayMember: 'description',
			valueMember: 'Id',
			items: basicsConfigVisibilityValues
		};

		return {
			fid: 'basics.config.wizardXgroup.layout',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'descriptioninfo', 'sorting', 'accessrightdescriptor', 'wizardfk', 'isvisible', 'visibility']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {
				'extraModules': ['basics.config'],
				'extraWords': {
					'Name': {location: 'basics.config', identifier: 'entityName', initial: 'Name'},
					'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
					'AccessRightDescriptor': {
						location: 'basics.config',
						identifier: 'descriptor',
						initial: 'Access Right Descriptor Name'
					},
					'WizardFk': {location: 'basics.config', identifier: 'wizardFk', initial: 'Wizard'},
					'IsVisible': {location: 'basics.config', identifier: 'entityIsVisible', initial: 'Is Visible'},
					'Visibility': {location: 'basics.config', identifier: 'tabVisibility', initial: 'Portal Visibility'},
				}
			},
			'overloads': {
				'wizardfk': (function () {
					var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsConfigWizardLookupService',
						filter: function () {
							var moduleId = 0;
							var act = $injector.get('basicsConfigMainService').getSelected();
							if (act) {
								moduleId = act.Id;
							}
							return moduleId;
						}
					});

					config.grid.$$postApplyValue = function (grid, item) {
						//	console.log('Test');
						var basicsConfigWizardXGroupPValueService = $injector.get('basicsConfigWizardXGroupPValueService');
						basicsConfigWizardXGroupPValueService.setWizardParamter(item.WizardFk);
					};
					return config;
				})(),
				accessrightdescriptor: {
					readonly: true
				},
				'visibility': {
					grid: {editorOptions: visibilitySelectOptions, width: 190},
					detail: {options: visibilitySelectOptions}
				}
			}
		};
	}

	configModule.factory('basicsConfigWizardXGroupPValueLayout', basicsConfigWizardXGroupPValueLayout);
	basicsConfigWizardXGroupPValueLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector'];

	function basicsConfigWizardXGroupPValueLayout(basicsLookupdataConfigGenerator, $injector) {
		return {
			fid: 'basics.config.wizardXgrouppv.layout',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['value', 'sorting', 'wizardparameterfk', 'domain']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {
				'extraModules': ['basics.config'],
				'extraWords': {
					'Value': {location: 'basics.config', identifier: 'entityValue', initial: 'Value'},
					'WizardParameterFk': {
						location: 'basics.config',
						identifier: 'entityWizardParameterFk',
						initial: 'Wizard Parameter'
					},
					'ReportFk': {location: 'basics.config', identifier: 'reportfk', initial: 'Report'},
					'Sorting': {location: 'cloud.common', identifier: 'entitySorting', initial: 'Sorting'},
					'Domain': {location: 'basics.config', identifier: 'entityDomain', initial: 'Domain'}

				}
			},
			'overloads': {
				'wizardparameterfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsConfigWizardParameterLookupService',
					filter: function () {
						var mainItemId = 0;
						var selected = $injector.get('basicsConfigWizardXGroupService').getSelected();
						if (selected) {
							mainItemId = selected.WizardFk;
						}
						return mainItemId;
					},
					readonly: true
				}),
				'reportfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsConfigReportLookupService',
					enableCache: true
				}),
				'domain': {readonly: true}

			}
		};
	}
})(angular);