/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesReadonlyProcessor', basicsTextModulesReadonlyProcessor);

	basicsTextModulesReadonlyProcessor.$inject = [
		'_',
		'basicsCommonReadOnlyProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService'];

	function basicsTextModulesReadonlyProcessor(
		_,
		basicsCommonReadOnlyProcessor,
		basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService) {

		let options = {
			uiStandardService: 'basicsTextModulesStandardConfigurationService',
			readOnlyFields: ['Client', 'RubricFk', 'ClerkFk', 'AccessRoleFk', 'PortalUserGroupFk', 'TextFormatFk']
		};

		let service = basicsCommonReadOnlyProcessor.createReadOnlyProcessor(options);

		service.handlerItemReadOnlyStatus = handlerItemReadOnlyStatus;
		service.getCellEditable = getCellEditable;
		service.setFieldsReadOnly = setFieldsReadOnly;
		service.getTextModuleType = getTextModuleType;

		return service;

		function handlerItemReadOnlyStatus(item) {
			service.setRowReadonlyFromLayout(item, false);
			return false;
		}

		function getCellEditable(item, model, args) {
			let editable = true;
			let type = null;
			if (args && angular.isDefined(args.textModuleType)) {
				type = args.textModuleType;
			} else {
				type = getTextModuleType(item);
			}
			if (!type && (model === 'Client' ||
				model === 'RubricFk' ||
				model === 'ClerkFk' ||
				model === 'AccessRoleFk' ||
				model === 'PortalUserGroupFk')) {
				editable = false;
			}

			if (type &&
				((!type.HasRubric && model === 'RubricFk') ||
					(!type.HasCompany && model === 'Client') ||
					(!type.HasRole && model === 'AccessRoleFk') ||
					(!type.HasClerk && model === 'ClerkFk') ||
					(!type.HasPortalGrp && model === 'PortalUserGroupFk'))) {
				editable = false;
			}

			if (type && type.Id === 44 && model === 'TextFormatFk') {
				editable = false;
			}
			return editable;
		}

		function setFieldsReadOnly(item, args) {
			if (!options.readOnlyFields) {
				return;
			}

			if (item.__rt$data && item.__rt$data.readonly) {
				item.__rt$data.readonly = [];
			}

			let fields = [];
			angular.forEach(options.readOnlyFields, function (field) {
				const readonly = !service.getCellEditable(item, field, args);
				item[field] = field === 'TextFormatFk' && readonly ? null : item[field];
				fields.push({
					field: field,
					readonly: readonly
				});
			});

			platformRuntimeDataService.readonly(item, fields);
		}

		function getTextModuleType(item) {
			if (!item.TextModuleTypeFk) {
				return null;
			}
			let textModuleTypes = basicsLookupdataLookupDescriptorService.getData('textModuleType');
			return _.find(textModuleTypes, {Id: item.TextModuleTypeFk});
		}
	}

})(angular);