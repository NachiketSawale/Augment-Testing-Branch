(function (angular) {
	/* global _ */
	'use strict';
	angular.module('qto.main').factory('qtoHeaderReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor','basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', function (commonReadOnlyProcessor, basicsLookupdataLookupDescriptorService, runtimeDataService) {
			var service = commonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'qtoMainHeaderUIStandardService',
				readOnlyFields:['QtoTypeFk', 'QtoTargetType', 'BasRubricCategoryFk', 'Code', 'descriptioninfo', 'QtoDate',
					'IsLive', 'IsWQ', 'IsAQ','IsBQ','IsIQ','ClerkFk', 'PerformedFrom', 'PerformedTo', 'Goniometer','LineText',
					'NoDecimals', 'UseRoundedResults', 'Remark','BoqHeaderFk','QTOStatusFk','BusinessPartnerFk','ContractCode','PrcStructureFk','PrcBoqFk', 'PackageFk', 'Package2HeaderFK','OrdHeaderFk','ConHeaderFk'
				]
			});

			var itemStatus, readOnlyStatus;
			service.handlerItemReadOnlyStatus = function (item) {
				service.setFieldsReadOnly(item);

				itemStatus = service.getItemStatus(item);
				if (itemStatus) {
					readOnlyStatus = itemStatus.IsReadOnly;
				} else {
					readOnlyStatus = false;
				}

				if(readOnlyStatus || item.IsBackup) {
					service.setRowReadonlyFromLayout(item, true);
				}

				if(item && item.ProjectFk){
					service.updateReadOnly(item, ['ProjectFk'], true);
				}

				return readOnlyStatus;
			};

			service.updateReadOnly = function (item, modelArray, value) {
				_.forEach(modelArray, function (model) {
					runtimeDataService.readonly(item, [
						{field: model, readonly: value}
					]);
				});
			};

			service.getItemStatus = function getItemStatus(item) {
				if(item=== null || item === undefined){
					return null;
				}
				var conStatuses = basicsLookupdataLookupDescriptorService.getData('QtoStatus');
				if(conStatuses){
					return _.find(conStatuses, {Id: item.QTOStatusFk});
				}
				return null;
			};
			service.getCellEditable = function getCellEditable(item, model) {
				switch (model) {
					case 'PrcBoqFk':
						return !!item.PackageFk;
					case 'PackageFk':
						return !!item.ProjectFk;
					case 'Package2HeaderFK':
						return false;
					case'ConHeaderFk':
						return !!item.ProjectFk;
					case 'OrdHeaderFk':
						return !!item.ProjectFk;
					case 'Code':
						return !item.Code;
					case 'IsWQ':
						return !!(item.QtoTargetType === 3 || item.QtoTargetType === 4);
					case 'IsAQ':
						return !!(item.QtoTargetType === 3 || item.QtoTargetType === 4);
					case 'IsBQ':
						return !!(item.QtoTargetType === 2 || item.QtoTargetType === 1);
					case 'IsIQ':
						return !!(item.QtoTargetType === 2 || item.QtoTargetType === 1);
					case 'BasRubricCategoryFk':
						return false;
					case 'QtoTypeFk':
						return  false;
					default:
						return true;
				}
			};
			return service;
		}]);
})(angular);