/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelAdministrationUIConfigurationService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the model.administration module.
	 */
	angular.module(moduleName).factory('modelProjectPropertyKeyBlackListUIConfigurationService', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			var service = {};

			service.getBlackListLayout = function () {
				return {
					fid: 'model.project.blackList',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['propertykeyfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						propertykeyfk: {
							requiredInErrorHandling: true,
							grid: {
								required: true,
								editor: 'lookup',
								editorOptions: {
									directive: 'model-main-property-key-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PropertyKey',
									displayMember: 'PropertyName',
									version: 3
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'model-main-property-key-dialog',
								options: {
									descriptionMember: 'PropertyName'
								}
							}
						}
					}
				};
			};

			return service;
		}
	]);
})(angular);
