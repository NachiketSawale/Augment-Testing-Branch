/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formworktype';
	/**
	 * @ngdoc service
	 * @name productionplanningFormworktypeConstantValues
	 * @function
	 *
	 * @description
	 * productionplanningFormworktypeConstantValues provides definitions and constants frequently used in productionplanning formworktype module
	 */
	angular.module(moduleName).value('productionplanningFormworktypeConstantValues', {
		schemes: {
			formworktype: { typeName: 'FormworkTypeDto', moduleSubModule: 'ProductionPlanning.FormworkType' },
		},
		uuid: {
			container: {
				formworktypeList: '1f1a4316f0fc4c81a8c9a070b9de7009',
				formworktypeDetails: '2441a13936c84120bfeb0cca18f93d34',
			}
		}
	});
})(angular);
