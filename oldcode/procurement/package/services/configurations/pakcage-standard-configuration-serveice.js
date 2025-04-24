(function () {
	'use strict';
	const moduleName = 'procurement.package';

	angular.module(moduleName).factory('packageStandardConfigurationService', ['platformUIStandardConfigService', 'procurementPackageTranslationService', 'platformSchemaService', 'procurementPackageLayout',

		function (platformUIStandardConfigService, procurementPackageTranslationService, platformSchemaService, procurementPackageLayout) {

			const mappedColumns = ['projectfk', 'packagestatusfk', 'structurefk', 'currencyfk', 'code', 'description', 'plannedstart', 'plannedend',
				'actualstart', 'actualend','packagetypefk', 'clerkprcfk', 'clerkreqfk', 'activityfk', 'schedulefk',
				'configurationfk', 'companyfk', 'businesspartnerfk', 'assetmasterfk', 'prccontracttypefk', 'insertedat', 'insertedby', 'updatedat', 'updatedby', 'dateeffective', 'deadlinedate',
				'datedelivery', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5'];

			function getLayout() {
				procurementPackageLayout.overloads.quantitytotal = {};
				let deepCopyLayouts = angular.copy(procurementPackageLayout);
				let lowerCaseColumnArray = mappedColumns.toLocaleString().toLowerCase().split(',');
				// region remove group
				if(deepCopyLayouts.groups&&deepCopyLayouts.groups.length>0) {
					_.forEach(deepCopyLayouts.groups, function (groupItem) {
						groupItem.attributes = _.filter(groupItem.attributes, function (item) {
							let index = lowerCaseColumnArray.indexOf(item);
							if (index > -1) {
								return item;
							}
						});
						if (groupItem.gid === 'HeaderGroupHeader' && groupItem.attributes && groupItem.attributes.length > 0) {
							groupItem.attributes.push('description');
						}
					});
				}
				// endregion
				// region remove overloads
				if(deepCopyLayouts.overloads){
					for (let prop in  deepCopyLayouts.overloads) {
						let dataOverload = deepCopyLayouts.overloads[prop];
						if (dataOverload&&dataOverload.grid && dataOverload.grid.editorOptions && dataOverload.grid.editorOptions.lookupOptions) {
							if (dataOverload.grid.editorOptions.lookupOptions.addGridColumns&& dataOverload.grid.editorOptions.lookupOptions.addGridColumns.length > 0) {
								dataOverload.grid.editorOptions.lookupOptions.addGridColumns = [];
							}
							if (dataOverload.grid.editorOptions.lookupOptions.columns && dataOverload.grid.editorOptions.lookupOptions.columns.length > 0) {
								dataOverload.grid.editorOptions.lookupOptions.columns = [];
							}
						}
						if (prop==='projectfk'&&dataOverload&&dataOverload.grid){
							dataOverload.grid.name$tr$= 'procurement.common.import.project';
						}
					}
				}
				// endregion
				return deepCopyLayouts;
			}

			const BaseService = platformUIStandardConfigService;
			const packageDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'PrcPackageDto', moduleSubModule: 'Procurement.Package'});
			function PackageUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			PackageUIStandardService.prototype = Object.create(BaseService.prototype);
			PackageUIStandardService.prototype.constructor = PackageUIStandardService;
			 const entityInformation = { module: angular.module(moduleName), moduleName: 'Procurement.Package', entity: 'PrcPackage' };
			let deepCopyLayoutInfo=getLayout();
			return new BaseService(deepCopyLayoutInfo, packageDomainSchema.properties, procurementPackageTranslationService,entityInformation);
		}
	]);
})();