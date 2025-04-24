/**
 * Created by myh on 01/12/2022.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineItemDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * constructionsystemMainLineItemDynamicConfigurationService is the config service for constructionsysem lineitem.
	 */
	angular.module(moduleName).factory('constructionsystemMainLineItemDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			let options = {
				dynamicColDictionaryForDetail : {}
			};

			let service = estimateCommonDynamicConfigurationServiceFactory.getService('constructionsystemMainLineItemUIStandardService', 'constructionsystemMainValidationService', options);

			let originalgetStandardConfigForListView = service.getStandardConfigForListView;

			service.getStandardConfigForListView = function(){
				let configForList = originalgetStandardConfigForListView();
				var estAssemblyFkIdx = _.findIndex(configForList.columns, {id: 'estassemblyfk'});
				if (estAssemblyFkIdx > -1){
					var estAssemblyFkCol = configForList.columns[estAssemblyFkIdx];
					estAssemblyFkCol.$$postApplyValue = function (grid, item/* , column */) {
						if (Object.hasOwnProperty.call(item, 'EstAssemblyFkPrjProjectAssemblyFk')){
							item.EstAssemblyFk = item.EstAssemblyFkPrjProjectAssemblyFk;
						}
					};
				}
				return configForList;
			};

			return service;
		}
	]);
})(angular);