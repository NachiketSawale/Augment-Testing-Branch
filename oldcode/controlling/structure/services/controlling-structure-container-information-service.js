/**
 * Created by janas on 19.05.2016.
 */

(function () {


	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureContainerInformationService
	 * @function
	 * @description
	 */
	controllingStructureModule.factory('controllingStructureContainerInformationService',
		['_', '$injector', function (_, $injector) {

			var service = {};

			/* jshint -W074 */ // ignore cyclomatic complexity warning
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;

				function createConfig(containerType, standardConfigurationServiceName, dataServiceName, validationServiceName) {
					layServ = $injector.get(standardConfigurationServiceName);
					config.layout = containerType === 'Grid' ? layServ.getStandardConfigForListView() : layServ.getStandardConfigForDetailView();
					config.ContainerType = containerType;
					config.standardConfigurationService = standardConfigurationServiceName;
					config.dataServiceName = dataServiceName;
					config.validationServiceName = validationServiceName;
				}

				switch (guid) {
					case '011CB0B627E448389850CDF372709F67': // controllingStructureGridController
						createConfig('Grid', 'controllingStructureUIStandardService', 'controllingStructureMainService', 'controllingStructureValidationService');

						// dynamic assignment column names
						$injector.get('controllingStructureDynamicAssignmentsService').setAssignmentColumnNames(_.get(config, 'layout.columns'));

						config.listConfig = {
							initCalled: false,
							columns: [],
							parentProp: 'ControllingunitFk',
							childProp: 'ControllingUnits',
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							cellChangeCallBack: $injector.get(config.dataServiceName).cellChangeCallBack
						};
						break;
					case '7D688DE3485B440D92154D7C19F376F7': // controllingStructureDetailController
						createConfig('Detail', 'controllingStructureUIStandardService', 'controllingStructureMainService', 'controllingStructureValidationService');

						// dynamic assignment row names
						$injector.get('controllingStructureDynamicAssignmentsService').setAssignmentLabels(_.get(config, 'layout.rows'));

						break;
					case '9E5B5809635C45DE90E27A567FF6B0E9': // controllingStructureUnitgroupListController
						createConfig('Grid', 'controllingStructureUnitgroupUIStandardService', 'controllingStructureUnitgroupService', 'controllingStructureUnitgroupValidationService');
						config.listConfig = {
							initCalled: false,
							columns: [],
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true}
						};
						break;
					case '9832DABE9F3E4EE8BF3A0B3010E2122F': // controllingStructureUnitgroupDetailController
						createConfig('Detail', 'controllingStructureUnitgroupUIStandardService', 'controllingStructureUnitgroupService', 'controllingStructureUnitgroupValidationService');
						break;
				}

				return config;
			};

			return service;
		}
		]);
})();
