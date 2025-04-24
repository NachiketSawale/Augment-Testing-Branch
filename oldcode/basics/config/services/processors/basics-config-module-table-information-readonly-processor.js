/**
 * Created by baf on 30.01.2022
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleTableInformationReadonlyProcessor
	 * @description readonly processing of loaded module table information entities
	 */
	angular.module(moduleName).service('basicsConfigModuleTableInformationReadonlyProcessor', BasicsConfigModuleTableInformationReadonlyProcessor);

	BasicsConfigModuleTableInformationReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function BasicsConfigModuleTableInformationReadonlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(tableInfo) {
			platformRuntimeDataService.readonly(tableInfo, [
				{ field: 'IsNewWizardActive', readonly: !tableInfo.CanNewWizardBeActived || tableInfo.Version === 0 },
				{ field: 'IsAddMandatoryActive', readonly: !tableInfo.CanMandatoryFieldsBeActived || tableInfo.Version === 0 },
				{ field: 'IsAddReadOnlyActive', readonly: !tableInfo.CanReadonlyFieldsBeActived || tableInfo.Version === 0 }]
			);

			// There may be wrong data available, therefore we correct it
			if(!tableInfo.CanNewWizardBeActived) {
				tableInfo.IsNewWizardActive = false;
			}
			if(!tableInfo.CanMandatoryFieldsBeActived) {
				tableInfo.IsAddMandatoryActive = false;
			}
			if(!tableInfo.CanReadonlyFieldsBeActived) {
				tableInfo.IsAddReadOnlyActive = false;
			}
		};
	}
})(angular);
