/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
     * @name hsqeCheckListDataReadonlyProcessor
     */
	angular.module(moduleName).factory('hsqeCheckListDataReadonlyProcessor', ['$injector', '_', 'basicsCommonReadOnlyProcessor', 'cloudDesktopPinningContextService', 'platformRuntimeDataService', 'checkListNumberGenerationSettingsService','basicsLookupdataLookupDescriptorService',
		function ($injector, _, commonReadOnlyProcessor, cloudDesktopPinningContextService, platformRuntimeDataService, checkListNumberGenerationSettingsService,lookupDescriptorService) {
			var service = commonReadOnlyProcessor.createReadOnlyProcessor({
				typeName: 'HsqCheckListDto',
				moduleSubModule: 'Hsqe.CheckList',
				readOnlyFields: ['Code', 'BpdBusinesspartnerFk', 'BpdSubsidiaryFk', 'BpdContactFk']
			});

			let isPortalUser = false;
			let codeHelperService = $injector.get('procurementCommonCodeHelperService');
			codeHelperService.IsPortalUser().then(function (val) {
				isPortalUser = val;
			});

			service.handlerItemReadOnlyStatus = function (item) {
				// service.setFieldsReadOnly(item);
				var statusList = lookupDescriptorService.getData('checkliststatus');
				var isReadOnly = _.get(_.find(statusList, {Id: item.HsqChlStatusFk}), 'IsReadonly');
				if (item.IsSameContextProjectsByCompany){
					isReadOnly = true;
				}
				item.IsReadonlyStatus = isReadOnly;
				service.setRowReadOnly(item, isReadOnly);
				platformRuntimeDataService.readonly(item, isReadOnly);
			};

			service.updateReadOnlyFiled = function setFieldsReadOnly(item, readOnyStatus) {
				service.setRowReadOnly(item, readOnyStatus);
			};
			service.hasToGenerateCode = function hasToGenerateCode(item) {
				var checkListTypeId = item.HsqChkListTypeFk;
				var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				var checkListType = _.find(lookupDescriptorService.getData('HsqeCheckListType'), {Id: checkListTypeId});
				if(null !== checkListType && !angular.isUndefined(checkListType)) {
					var basRubricCategoryFk = checkListType.BasRubricCategoryFk;
					return checkListNumberGenerationSettingsService.hasToGenerateForRubricCategory(basRubricCategoryFk);
				}
				return false;
			};
			service.setFieldReadonlyOrNot = function (entity, propertyName, readOnlyOrNot) {
				var fields = [];
				fields.push({
					field: propertyName,
					readonly: readOnlyOrNot
				});

				platformRuntimeDataService.readonly(entity, fields);
			};
			service.getCellEditable = function getCellEditable(item, model) {
				if (item.IsReadonlyStatus) {
					return false;
				}
				if(item.IsSameContextProjectsByCompany){
					return false;
				}
				switch (model) {
					case 'Code':
						var hasToGennerateCode = service.hasToGenerateCode(item);
						return !(item.Version === 0 && hasToGennerateCode);
					case 'BpdBusinesspartnerFk':
						return !isPortalUser && !(item.PesHeaderFk || item.ConHeaderFk);
					case 'BpdSubsidiaryFk':
						return !isPortalUser && !(item.PesHeaderFk || item.ConHeaderFk);
					case 'BpdContactFk':
						return !isPortalUser && !(item.PesHeaderFk || item.ConHeaderFk);
					default :
						return true;
				}
			};
			return service;
		}
	]);
})(angular);
