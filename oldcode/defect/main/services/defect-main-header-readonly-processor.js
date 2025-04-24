/**
 * Created by wwa on 7/8/2016.
 */
/* global  */
(function (angular) {
	'use strict';

	var moduleName='defect.main';
	/* jshint -W072 */
	angular.module(moduleName).factory('defectMainHeaderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor','cloudDesktopPinningContextService','platformRuntimeDataService','defectNumberGenerationSettingsService',
			function (commonReadOnlyProcessor,cloudDesktopPinningContextService,platformRuntimeDataService,defectNumberGenerationSettingsService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'DfmDefectDto',
					moduleSubModule: 'Defect.Main',
					readOnlyFields: ['DfmDefectFk','PrjLocationFk','PsdScheduleFk','PsdActivityFk','MdcControllingunitFk','ConHeaderFk','OrdHeaderFk',
						'BpdBusinesspartnerFk','BpdSubsidiaryFk','BpdContactFk','BasClerkRespFk','ObjectSetKey','PrjLocationFk','Isexternal', 'DateRequired',
						'Code', 'Description', 'DfmStatusFk', 'BasDefectTypeFk', 'RubricCategoryFk', 'PrcStructureFk', 'DfmGroupFk','PrjProjectFk',
						'BasDefectPriorityFk', 'BasDefectSeverityFk', 'DateIssued','DateRequired', 'DateFinished', 'BasWarrantyStatusFk', 'EstimateCost',
						'BasCurrencyFk', 'BasClerkFk', 'DfmRaisedbyFk', 'Userdate1', 'Userdate2', 'Userdate3', 'Userdate4', 'Userdate5', 'Userdefined1',
						'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'MdlModelFk', 'MdlModelFk$Description', 'ObjectSetKey','Detail','HsqChecklistFk']
				});


				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				service.updateReadOnlyFiled = function setFieldsReadOnly(item,readOnyStatus) {
					service.setRowReadOnly(item, readOnyStatus);
				};
				service.hasToGenerateCode = function hasToGenerateCode(item){
					return defectNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk);
				};

				service.setFieldReadonlyOrNot=function(entity,propertyName,readOnlyOrNot){
					var fields = [];
					fields.push({
						field: propertyName,
						readonly: readOnlyOrNot
					});

					platformRuntimeDataService.readonly(entity, fields);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					if(item.IsReadonlyStatus){
						return false;
					}
					switch (model) {
						case 'DfmDefectFk':
						case 'PrjLocationFk':
						case 'PsdScheduleFk':
						case 'MdcControllingunitFk':
						case 'ObjectSetKey':
							return !!item.PrjProjectFk;
						case 'PsdActivityFk':
							return !!item.PsdScheduleFk;
						case 'ConHeaderFk':
							return !item.OrdHeaderFk;
						case 'OrdHeaderFk':
							return !item.ConHeaderFk;
						case 'BpdBusinesspartnerFk':
							return item.Isexternal===true && item.IsEditableByStatus;
						case 'BpdSubsidiaryFk':
							return item.Isexternal===true&&!!item.BpdBusinesspartnerFk && item.IsEditableByStatus;
						case 'BpdContactFk':
							return item.Isexternal===true && item.IsEditableByStatus;
						case 'BasClerkRespFk':
						case 'DateRequired':
						case 'Isexternal':
							return item.IsEditableByStatus;
						case 'Code':
							var hasToGennerateCode = service.hasToGenerateCode(item);
							return !(item.Version===0 && hasToGennerateCode);
						case 'HsqChecklistFk':
							/*
							if(item.HsqChecklistFk === null) { return false; }
							var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
							var statusData = basicsLookupdataLookupDescriptorService.getData('CheckListStatus');
							var defectStatus = _.filter(statusData, {IsDefect: true});
							var status = _.map(defectStatus, 'Id');
							var checklistEntity = basicsLookupdataLookupDescriptorService.getLookupItem('CheckList', item.HsqChecklistFk);
							return checklistEntity && status.indexOf(checklistEntity.HsqChlStatusFk) > -1;
							*/
							return true;
						default :
							return true;
					}
				};

				return service;
			}]);
})(angular);
