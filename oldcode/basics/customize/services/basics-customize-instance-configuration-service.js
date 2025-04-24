/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for all entity types handled in customization module
	 */
	angular.module(moduleName).service('basicsCustomizeInstanceConfigurationService', BasicsCustomizeInstanceConfigurationService);

	BasicsCustomizeInstanceConfigurationService.$inject = ['_', 'platformUIConfigInitService', 'basicCustomizeTranslationService',
		'basicsCustomizeTypeDataService', 'basicsCustomizeInstanceSchemeService', 'basicsCustomizePropertyFilterService',
		'basicsCustomizeInstanceActionService', 'basicsCustomizeActionDomainConfigurationService', 'basicsCustomizeIconDomainConfigurationService',
		'basicsCustomizeLookupDomainConfigurationService', 'basicsCustomizeSelectDomainConfigurationService'];

	function BasicsCustomizeInstanceConfigurationService(_, platformUIConfigInitService, basicCustomizeTranslationService,
		basicsCustomizeTypeDataService, basicsCustomizeInstanceSchemeService, basicsCustomizePropertyFilterService,
		basicsCustomizeInstanceActionService, basicsCustomizeActionDomainConfigurationService, basicsCustomizeIconDomainConfigurationService,
		basicsCustomizeLookupDomainConfigurationService, basicsCustomizeSelectDomainConfigurationService) {
		var self = this;
		var selfData = {
			selType: null,
			configurations: {}
		};

		function getTextDomainOverload(fieldProperty) {
			if(fieldProperty.MaxLength >= 1) {
				return {
					regex: '^[\\s\\S]{0,' + fieldProperty.MaxLength + '}$'
				};
			}

			return null;
		}

		function getPrefixDomainOverload(fieldProperty) {
			if(fieldProperty.MaxLength >= 1) {
				return {
					regex:'^[A-Z_0-9]{0,16}$'
				};
			}

			return null;
		}

		function getColorDomainOverload(fieldProperty) {
			if(!fieldProperty.Required) {
				return {
					editor: 'color',
					editorOptions: {
						showClearButton: true
					}
				};
			}

			return null;
		}

		function addOverload(layout, fieldProperty, selType) {
			let overload = null;
			let input = null;
			if (basicsCustomizeLookupDomainConfigurationService.isReferenceDropDownColumn(fieldProperty)) {
				overload = basicsCustomizeLookupDomainConfigurationService.getLookupDropDownOverload(selType, fieldProperty);
			}

			switch(fieldProperty.Domain) {
				case 'lookup': input = basicsCustomizeLookupDomainConfigurationService.getLookupDomainOverload(selType, fieldProperty); break;
				case 'code': input = getTextDomainOverload(fieldProperty); break;
				case 'description': input = getTextDomainOverload(fieldProperty); break;
				case 'translation': input = getTextDomainOverload(fieldProperty); break;
				case 'comment': input = getTextDomainOverload(fieldProperty); break;
				case 'text': input = getTextDomainOverload(fieldProperty); break;
				case 'select': input = basicsCustomizeSelectDomainConfigurationService.getSelectOverload(selType, fieldProperty); break;
				case 'color': input = getColorDomainOverload(fieldProperty); break;
				default: break;
			}

			if(fieldProperty.Domain === 'code' && selType.DBTableName === 'EST_PARAMETER'){
				input = getPrefixDomainOverload(fieldProperty);
			}

			if(!_.isNil(input))
			{
				overload = angular.extend(overload || {}, input);
			}

			if (fieldProperty.IsIcon) {
				input = overload || {};
				overload = angular.extend(input, basicsCustomizeIconDomainConfigurationService.getIconOverload(selType, fieldProperty));
			}

			if (fieldProperty.IsReadonly) {
				input = overload || {};
				overload = angular.extend(input, {readonly: true});
			}

			layout.overloads[fieldProperty.Name.toLowerCase()] = overload;
		}

		function matchesFilter(prop, filter) {
			return !filter || filter.length === 0 || _.findIndex(filter, function (val) {
				return val === prop.Name;
			}) === -1;
		}

		function addTypeAttributes2Layout(layout, selType, filter) {
			if (selType && selType.Id) {
				_.forEach(selType.Properties, function (prop) {
					if (matchesFilter(prop, filter)) {
						if ((prop.IsVisible && prop.IsReadonly) || (prop.Name !== 'Id' && !prop.IsHistory)) {
							layout.groups[0].attributes.push(prop.Name.toLowerCase());
						}

						addOverload(layout, prop, selType);
					}
				});
			}
		}

		function createEntityClassDescriptionLayout(selType, filter) {
			var res = {
				fid: 'basics.customize.entityinstancedetailform',
				version: '0.2.4',
				showGrouping: true,
				addValidationAutomatically: true,
				addAdditionalColumns: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: []
					}
				],
				overloads: {}
			};

			if (selType && selType.Id) {
				res.groups.push(
					{
						gid: 'entityHistory',
						attributes: [],
						isHistory: true,
						showFields: true
					});
			}
			addTypeAttributes2Layout(res, selType, filter);

			return res;
		}

		var listConfig;
		var detailConfig;

		this.getListConfigForTypeData = function getListConfigForTypeData(selType) {
			var filteredProps = basicsCustomizePropertyFilterService.getHiddenFieldsForType(selType);
			listConfig = self.getListConfigForType(selType, filteredProps);

			/* Code not necessary in first version commented out - need to be included soon
			this.getActionColumns(selType, listConfig);
			if (selType && selType.InstanceAction) {
				var instanceActionColumn = basicsCustomizeInstanceActionService.getInstanceActionColumn(selfData);
				listConfig.columns.unshift(instanceActionColumn);
			}
			*/

			return listConfig;
		};

		this.onTypeSelectionChanged = function onTypeSelectionChanged() {
			selfData.selType = basicsCustomizeTypeDataService.getSelected();
			var filteredProps = basicsCustomizePropertyFilterService.getHiddenFieldsForType(selfData.selType);
			listConfig = self.getListConfigForType(selfData.selType, filteredProps);

			this.getActionColumns(selfData.selType, listConfig);
			if (selfData.selType && selfData.selType.InstanceAction) {
				var instanceActionColumn = basicsCustomizeInstanceActionService.getInstanceActionColumn(selfData);
				listConfig.columns.unshift(instanceActionColumn);
			}

			return listConfig;
		};

		function correctColumnIds(selType, listConfig) {
			if(selType && selType.DBTableName === 'MDC_WAGE_GROUP') {
				listConfig.columns[5].id = 'group_';
			}
		}

		this.getListConfigForType = function getListConfigForType(selType, filter) {
			const entityLayout = createEntityClassDescriptionLayout(selType, filter);
			const entityAttDomains = basicsCustomizeInstanceSchemeService.getSchemaForType(selType);
			detailConfig = platformUIConfigInitService.provideConfigForDetailView(entityLayout, entityAttDomains, basicCustomizeTranslationService);
			const listConfig = platformUIConfigInitService.provideConfigForListView(entityLayout, entityAttDomains, basicCustomizeTranslationService);
			correctColumnIds(selType, listConfig);
			return listConfig;
		};

		this.getActionColumns = function getColumnActions(selType, listConfig) {
			if (selType) {
				_.each(selType.Properties, function (property) {
					if (property.Action) {
						basicsCustomizeActionDomainConfigurationService.createActionColumn(property, listConfig);
					}
				});
			}
		};

		this.getStandardConfigForListView = function getStandardConfigForListView() {
			return listConfig;
		};

		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			return detailConfig;
		};

		this.getTableConfigurationCurrentSelection = function getGroupingForCurrentSelection() {

			if (selfData.selType !== null && selfData.configurations[selfData.selType.DBTableName]) {
				return selfData.configurations[selfData.selType.DBTableName];
			}

			return {
				grouping: [],
				columns: []
			};
		};

		this.storeTableConfigurationForCurrentSelection = function storeGroupingForCurrentSelection(config) {
			if (selfData.selType !== null) {
				selfData.configurations[selfData.selType.DBTableName] = config;
			}
		};

		this.onTypeSelectionChanged();
	}

})();
