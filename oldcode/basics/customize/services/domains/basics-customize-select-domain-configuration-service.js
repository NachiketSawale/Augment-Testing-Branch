/**
 * Created by Frank Baedeker on 2020/10/23.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeSelectDomainConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides configuration of all icon columns in instance table
	 */
	angular.module(moduleName).service('basicsCustomizeSelectDomainConfigurationService', BasicsCustomizeSelectDomainConfigurationService);

	BasicsCustomizeSelectDomainConfigurationService.$inject = ['basicsConfigVisibilitySelectOptions','platformLayoutHelperService'];

	function BasicsCustomizeSelectDomainConfigurationService(basicsConfigVisibilitySelectOptions, platformLayoutHelperService) {
		var self = this;

		this.getDashBoardGroupOverload = function getDashBoardGroupOverload(selType, fieldProperty) {
			var ovl = {};
			if(fieldProperty.Name === 'Visibility') {
				ovl.grid = {editorOptions: basicsConfigVisibilitySelectOptions, width: 190};
			}
			if(fieldProperty.Name === 'AccrualType') {
				ovl.grid = {
					'editor': 'lookup',
						'editorOptions': {
						'lookupOptions': {'showClearButton': true},
						'directive': 'controlling-revenue-recognition-accrual-type-combobox'
					},
					'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'RevenueRecognitionAccrualType', 'displayMember': 'Description'},
					'width': 140
				};
			}
			if(fieldProperty.Name === 'ValueType') {
				ovl.grid = {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {'showClearButton': true},
						'directive': 'basics-customize-value-type-combobox'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'BasicsCustomizeValueType', 'displayMember': 'Description'},
					'width': 140
				};
			}
			return ovl;
		};

		this.getSelectOverload = function getSelectOverload(selType, fieldProperty) {
			var overload = {};

			if (selType.DBTableName === 'BAS_DASHBOARDGROUP') {
				overload = self.getDashBoardGroupOverload(selType, fieldProperty);
			}

			if(fieldProperty.Name === 'AccrualType') {
				overload = self.getDashBoardGroupOverload(selType, fieldProperty);
			}

			if(fieldProperty.Name === 'ValueType') {
				overload = self.getDashBoardGroupOverload(selType, fieldProperty);
			}
			return overload;
		};
	}
})();
