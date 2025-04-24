/**
 * Created by janas on 20.02.2018.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureWizardGenerateConstantsService
	 * @function
	 *
	 * @description
	 * controllingStructureWizardGenerateConstantsService is the data service for managing Constant key-value-pairs.
	 */
	controllingStructureModule.factory('controllingStructureWizardGenerateConstantsService',
		['_', 'controllingStructureContextService', 'projectMainForCOStructureService',
			function (_, controllingStructureContextService, projectMainForCOStructureService) {

				var constants = {};
				var service = {};

				service.init = function init() {
					var project = projectMainForCOStructureService.getSelected();
					constants.P = project ? project.ProjectNo : '';

					// get company
					var company = controllingStructureContextService.getCompany();
					constants.CC = company.Code;
					constants.PC = company.Profitcenter;

					// get asset master from selected project
					var assetMaster = projectMainForCOStructureService.getAssetMaster();
					constants.AM = assetMaster ? assetMaster.Code : '';
				};

				service.checkIsConstant = function checkIsConstant(expression) {
					var constantStr = _.get(constants, expression.entityName);
					return _.isString(constantStr);
				};

				service.getConstantByKey = function getConstantByKey(key) {
					return constants[key];
				};

				return service;
			}
		]);
})();
