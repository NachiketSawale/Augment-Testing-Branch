(function (angular) {
	'use strict';


	var moduleName = 'basics.site';
	angular.module(moduleName).directive('basicsSiteTypeCombobox', BasicsSiteTypeCombobox);

	BasicsSiteTypeCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsSiteImageProcessor',
		'basicsSiteValidationService', '$http', 'platformDataValidationService', 'basicsSiteMainService',
		'platformRuntimeDataService'];

	function BasicsSiteTypeCombobox(BasicsLookupdataLookupDirectiveDefinition, basicsSiteImageProcessor,
		basicsSiteValidationService, $http, platformDataValidationService,
		basicsSiteMainService, platformRuntimeDataService) {

		var defaults = {
			lookupType: 'SiteType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			editable: 'false',
			events: [{
				name: 'onSelectedItemChanged',
				handler: function selectedSiteTypeChanged(e, args) {
					if (!args.entity.Version) {

						var entity = args.entity;
						var item = args.selectedItem;

						entity.SiteTypeFk = item.Id;
						basicsSiteImageProcessor.processItem(entity);

						var postData = {siteType: entity.SiteTypeFk};
						$http.post(globals.webApiBaseUrl + 'basics/site/getcode', postData).then(function (response) {
							entity.Code = response.data;

							platformDataValidationService.removeFromErrorList(entity, 'Code', basicsSiteValidationService, basicsSiteMainService);
							platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
							//basicsSiteMainService.gridRefresh();
						});
					}
				}
			}]
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);