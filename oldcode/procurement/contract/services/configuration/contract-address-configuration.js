(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name projectMainKeyFigureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('procurementContractAddressConfigurationService',

		['projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter',
			// eslint-disable-next-line no-unused-vars
			function (projectMainTranslationService, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter) {

				function getLayout() {
					return {
						fid: 'address',
						version: '0.0.1',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['zipcode', 'addressline', 'address']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {}
					};
				}

				return {getConfig: getLayout};
			}
		]);
})();
