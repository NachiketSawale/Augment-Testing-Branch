/**
 * Created by lja on 2015/12/18.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).constant('procurementCommonSideBarInfoDependentDataUIConfig', {
		package: {
			panelType: 'text',
			header: 'getDPkgHeaderTitle()',
			model: 'headerItem.packageSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDPkgStatusIconUrl()'
				}
			]
		},
		requisition: {
			panelType: 'text',
			header: 'getDReqHeaderTitle()',
			model: 'headerItem.reqSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDReqStatusIconUrl()'
				}
			]
		},
		rfq: {
			panelType: 'text',
			header: 'getDRfqHeaderTitle()',
			model: 'headerItem.rfqSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDRfqStatusIconUrl()'
				}
			]
		},
		quote: {
			panelType: 'text',
			header: 'getDQtnHeaderTitle()',
			model: 'headerItem.qtnSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDQtnStatusIconUrl()'
				}
			]
		},
		contract: {
			panelType: 'text',
			header: 'getDConHeaderTitle()',
			model: 'headerItem.conSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDConStatusIconUrl()'
				}
			]
		},
		pes: {
			panelType: 'text',
			header: 'getDPesHeaderTitle()',
			model: 'headerItem.pesSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDPesStatusIconUrl()'
				}
			]
		},
		invoice: {
			panelType: 'text',
			header: 'getDInvHeaderTitle()',
			model: 'headerItem.invSelectedItem',
			showSlider: true,
			dataService: null,
			items: [
				{
					itemType: 'custom',
					customTemplate: null,
					model: 'CodeAndDescription',
					iconUrl: 'getDInvStatusIconUrl()'
				}
			]
		}
	});

	angular.module(moduleName).factory('procurementCommonSideBarInfoDependentDataUIService',
		['procurementCommonSideBarInfoDependentDataUIConfig',
			'procurementCommonSideBarInfoDependentDataService',
			function (uiConfig, dataService) {
				var service = {};

				service.createConfig = function ($scope, moduleName) {
					if (!angular.isString(moduleName)) {
						return;
					}

					var dataServices = dataService.dependentDataHandler($scope, moduleName);

					var result = [];

					for (var key in uiConfig) {
						if(Object.prototype.hasOwnProperty.call(uiConfig,key)) {
							if (key !== moduleName) {
								var item = uiConfig[key];
								item.dataService = dataServices[key].service;
								item.items[0].customTemplate = dataService.gotoModuleHandler($scope, key);// templates[key];
								result.push(uiConfig[key]);
							}
						}
					}

					return result;
				};

				return service;
			}]);
})(angular);