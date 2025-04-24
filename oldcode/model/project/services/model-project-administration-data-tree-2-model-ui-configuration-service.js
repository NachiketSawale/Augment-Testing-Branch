/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectAdministrationDataTree2ModelUiConfigurationService
	 * @function
	 *
	 * @description
	 * Provides the UI configuration for the data tree 2 model entity from model.administration.
	 */
	angular.module(moduleName).factory('modelProjectAdministrationDataTree2ModelUiConfigurationService',
		['basicsLookupdataConfigGenerator',

			function (basicsLookupdataConfigGenerator) {

				var service = {};

				service.getDataTree2ModelLayout = function getDataTree2ModelLayout () {
					return {
						fid: 'model.project.dataTree2ModelForm',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['datatreefk', 'assignlocations', 'overwritelocations']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							datatreefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'modelAdministrationDataTreeLookupDataService',
								enableCache: true,
								additionalColumns: false
							})
						}
					};
				};

				return service;
			}
		]);
})(angular);

