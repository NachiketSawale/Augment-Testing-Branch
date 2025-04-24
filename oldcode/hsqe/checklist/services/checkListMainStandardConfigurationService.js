(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'hsqe.checklist';

	angular.module(moduleName).factory('checkListMainStandardConfigurationService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'platformSchemaService', 'hsqeCheckListLayout',

		function (platformUIStandardConfigService, hsqeCheckListTranslationService, platformSchemaService, hsqeCheckListLayout) {

			function getLayout(){
				var layout = _.cloneDeep(hsqeCheckListLayout);
				_.each(['conheaderfk', 'checklistgroupfk', 'basclerkchkfk', 'pesheaderfk', 'prcstructurefk', 'bascompanyfk', 'prjprojectfk','basclerkhsqfk'], function (field) {
					if (layout.overloads[field]) {
						layout.overloads[field].grid.editorOptions.lookupOptions.additionalColumns = false;
					}
				});
				layout.overloads['etmplantfk'].grid.editorOptions.lookupOptions.addGridColumns = null;
				return layout;
			}

			var BaseService = platformUIStandardConfigService;
			var checkListDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'HsqCheckListDto', moduleSubModule: 'Hsqe.CheckList'} );
			if(checkListDomainSchema) {
				checkListDomainSchema = checkListDomainSchema.properties;
				checkListDomainSchema.Info ={ domain : 'image'};
				checkListDomainSchema.Rule ={ domain : 'imageselect'};
				checkListDomainSchema.Param ={ domain : 'imageselect'};
			}

			function CheckListUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CheckListUIStandardService.prototype = Object.create(BaseService.prototype);
			CheckListUIStandardService.prototype.constructor = CheckListUIStandardService;

			return new BaseService( getLayout(), checkListDomainSchema, hsqeCheckListTranslationService);
		}
	]);
})();