/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationLanguageValidationService
	 * @description provides validation methods for translation language entities
	 */
	cloudTranslationModule.service('cloudTranslationLanguageValidationService', cloudTranslationLanguageValidationService);
	cloudTranslationLanguageValidationService.$inject = ['platformRuntimeDataService', '_'];

	function cloudTranslationLanguageValidationService(platformRuntimeDataService, _) {

		function getReadonlyFieldsForSystemLanguages(){
			let fields = ['Description', 'IsDefault', 'Culture', 'LanguageId', 'IsSystem', 'ExportColumnName'];
			let readonlyFields = [];
			_.forEach(fields, function (field){
				readonlyFields.push({field:field, readonly:true});
			});
			return readonlyFields;
		}

		this.isSystemProcessor = function (item){
			if(item.IsSystem){
				platformRuntimeDataService.readonly(item, getReadonlyFieldsForSystemLanguages());
			}
			return {valid: true};
		};

		this.getIsSystemProcessor = function (){
			return {processItem: this.isSystemProcessor};
		};
	}

})(angular);
