/**
 * Created by lnt on 6/6/2017.
 * Drastically improved by baf on 2018-02-14
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).service('basicsCustomizeBoQItemFlagValidationService', BasicsCustomizeBoQItemFlagValidationService);

	BasicsCustomizeBoQItemFlagValidationService.$inject = ['platformDataValidationService','basicsCustomizeInstanceDataService'];

	function BasicsCustomizeBoQItemFlagValidationService(platformDataValidationService,basicsCustomizeInstanceDataService){
		var self = this;
		this.validateCode = function validateCode(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCustomizeInstanceDataService.getList(), self, basicsCustomizeInstanceDataService);
		};
	}
})(angular);
