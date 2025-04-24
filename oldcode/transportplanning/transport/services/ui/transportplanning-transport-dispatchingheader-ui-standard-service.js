/**
 * Created by zov on 26/11/2018.
 */
(function () {
	'use strict';
	/*global angular, _ */

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).service('trsTransportDispatchingHeaderUIConfigService', dispatchingHeaderUIService);
	dispatchingHeaderUIService.$inject = [
		'platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'
	];

	function dispatchingHeaderUIService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		var layout = _.cloneDeep(logisticDispatchingContainerInformationService.getLogisticDispatchingHeaderLayout());
		layout.overloads.code = {
			navigator: {
				moduleName: 'logistic.dispatching'
			}
		};
		platformUIConfigInitService.createUIConfigurationService({
			/*jshint validthis:true*/
			service: this,
			layout: layout,
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Dispatching',
				typeName: 'DispatchHeaderDto'
			},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);