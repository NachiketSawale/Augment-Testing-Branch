/*
 * $Id: pps-cost-codes-ui-configuration-service.js 64239 2022-11-30 08:03:08Z jay.ma $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'productionplanning.ppscostcodes';

	/**
	 * @ngdoc service
	 * @name ppsCostCodesUIConfigurationService
	 * @function
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('ppsCostCodesUIConfigurationService', ['_', 'basicsCostCodesUIConfigurationService', 'basicsLookupdataConfigGenerator',
		function (_, basicsCostCodesUIConfigurationService, basicsLookupdataConfigGenerator) {
			const ppsCostCodeDetailLayout = {
				fid: 'pps.costcodes.form',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				change: 'change',
				groups: [{
					gid: 'ppsProperties',
					attributes: ['ppscostcode.newtkstimesymbolfk', 'ppscostcode.usetocreatecomponents', 'ppscostcode.usetoupdatephasereq', 'ppscostcode.showasslotonproduct',
						'ppscostcode.commenttext', 'ppscostcode.userdefined1', 'ppscostcode.userdefined2', 'ppscostcode.userdefined3',
						'ppscostcode.userdefined4', 'ppscostcode.userdefined5', 'ppscostcode.isreadonly']
				}],
				overloads: {
					'ppscostcode.newtkstimesymbolfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingTimeSymbolLookupDataService',
						showClearButton: true
					}),
					'ppscostcode.usetocreatecomponents': {
						formatter: 'boolean',
						width: 160,
					},
					'ppscostcode.usetoupdatephasereq': {
						formatter: 'boolean',
						width: 200,
					},
					'ppscostcode.showasslotonproduct': {
						formatter: 'boolean',
						width: 200,
					},
					'ppscostcode.commenttext': {
						maxLength : 255
					},
					'ppscostcode.isreadonly': {
						formatter: 'boolean',
					},
				},
			};

			const service = {};

			service.getDetailLayout = () => {
				const layout = getReadonlyBasCostCodeLayout();
				layout.groups = layout.groups.concat(ppsCostCodeDetailLayout.groups);

				for (let key in ppsCostCodeDetailLayout.overloads) {
					layout.overloads[key] = ppsCostCodeDetailLayout.overloads[key];
				}

				layout.fid = ppsCostCodeDetailLayout.fid;
				layout.change = ppsCostCodeDetailLayout.change;

				return layout;
			};

			function getReadonlyBasCostCodeLayout() {
				const basCostCodeLayout = _.cloneDeep(basicsCostCodesUIConfigurationService.getBasicsCostCodesDetailLayout());

				// make all fields readonly
				basCostCodeLayout.groups.forEach(grp => {
					if (grp.attributes) {
						grp.attributes.forEach(attr => {
							if (!Object.prototype.hasOwnProperty.call(basCostCodeLayout.overloads, attr)) {
								basCostCodeLayout.overloads[attr] = {};
							}
							basCostCodeLayout.overloads[attr].readonly = true;
						});
					}
				});

				return basCostCodeLayout;
			}

			return service;
		}
	]);
})(angular);
