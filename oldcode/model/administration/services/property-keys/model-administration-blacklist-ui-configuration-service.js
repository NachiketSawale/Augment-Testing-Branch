/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationUIConfigurationService
	 * @function
	 * @requires basicsCommonConfigLocationListService, basicsLookupdataConfigGenerator
	 *
	 * @description
	 * The UI configuration service for the model.administration module.
	 */
	angular.module(moduleName).factory('modelAdministrationBlackListUIConfigurationService', [
		function () {
			var service = {};

			service.getBlackListLayout = function () {
				return {
					fid: 'model.administration.blackList',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
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
						propertykeyfk :{
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

