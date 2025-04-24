(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.configuration';
	angular.module(moduleName).directive('ppsConfigurationUpstreamItemTemplateLookup', upstreamItemTemplateLookUp);

	upstreamItemTemplateLookUp.$inject = ['$q', '$translate','BasicsLookupdataLookupDirectiveDefinition',
		'ppsConfigurationUpstreamItemTemplateDataService','ppsUpstreamItemTemplateUIStandardService'];

	function upstreamItemTemplateLookUp($q, $translate, BasicsLookupdataLookupDirectiveDefinition,
		ppsConfigurationUpstreamItemTemplateDataService, ppsUpstreamItemTemplateUIStandardService) {
		var uiService = ppsUpstreamItemTemplateUIStandardService.getService(ppsConfigurationUpstreamItemTemplateDataService);
		var gridColumns = [];
		if(uiService){
			gridColumns = _.cloneDeep(uiService.getStandardConfigForListView().columns);
		}
		_.forEach(gridColumns, function (o) {
			o.editor = null;
			o.navigator = null;
		});
		var defaults = {
			lookupType: 'UpstreamItemTemplate',
			valueMember: 'Id',
			displayMember: 'Code',
			columns: gridColumns,
			inputSearchMembers: ['Code', 'DescriptionInfo'],
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);