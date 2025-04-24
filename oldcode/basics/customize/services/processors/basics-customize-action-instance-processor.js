(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeActionInstanceProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeActionInstanceProcessor
	 */

	angular.module(moduleName).service('basicsCustomizeActionInstanceProcessor', BasicsCustomizeActionInstanceProcessor);

	BasicsCustomizeActionInstanceProcessor.$inject = ['_', '$http', '$injector', '$translate', 'basicsCustomizeStatusTransitionService', 'basicsCustomizeTypeDataService', 'basicsCustomizeEditExternalConfigurationService'];

	function BasicsCustomizeActionInstanceProcessor(_, $http, $injector, $translate, basicsCustomizeStatusTransitionService, basicsCustomizeTypeDataService, basicsCustomizeEditExternalConfigurationService) {
		var self = this;
		var externalConfigId = 12;
		var externalSourceType = 14;
		var tableName = 'BAS_EXTERNALCONFIG';

		self.provideActionSpecification = function provideActionSpecification(tableNameAction, actionList) {
			switch (tableNameAction) {
				case tableName:
					actionList.push({
						toolTip: $translate.instant('basics.customize.enhancement'),
						icon: 'tlb-icons ico-settings',
						callbackFn: basicsCustomizeEditExternalConfigurationService.showDialog
					});
					break;
			}
		};

		self.processItem = function processItem(item) {
			var selectedTableName = basicsCustomizeTypeDataService.getSelected().DBTableName;
			if (tableName === selectedTableName && item.Id === externalConfigId && item.ExternalSourceTypeFk === externalSourceType) {
				self.isActionSupported(tableName, item);
			}

			if (tableName === selectedTableName && item.Id === 21) {
				var configService = $injector.get('basicsCustomizeDunsEditExternalConfigurationService');
				item.actionList = [];
				item.actionList.push({
					toolTip: $translate.instant('businesspartner.main.dunsUrl.urlConfigHelp'),
					    icon: 'tlb-icons ico-info',
					callbackFn: configService.showDialog
				}
				);
			}
		};

		self.isActionSupported = function isActionSupported(tableName, item) {
			item.actionList = [];
			self.provideActionSpecification(tableName, item.actionList);
		};

	}
})(angular);
