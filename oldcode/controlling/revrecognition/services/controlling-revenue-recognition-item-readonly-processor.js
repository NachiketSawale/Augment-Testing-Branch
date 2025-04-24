/**
 * Created by alm on 9/04/2021.
 */

(function (angular) {
	'use strict';
	angular.module('controlling.revrecognition').factory('controllingRevenueRecognitionItemReadonlyProcessor',
		['platformRuntimeDataService','platformSchemaService','basicsCommonReadOnlyProcessor','controllingRevenueRecognitionHeaderDataService',
			function (platformRuntimeDataService,platformSchemaService,commonReadOnlyProcessor,parentService) {


				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrrItemDto',
					moduleSubModule: 'Controlling.RevRecognition',
					readOnlyFields: ['Code','Description','AmountContract','AmountContractCo','AmountContractTotal','AmountPervious','AmountInc','AmountTotal','Percentage','HeaderDate','PrrAccrualType','RelevantDate','Remark','PostingNarrative']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var parentReadOnly = !parentService.getHeaderEditAble();
					if(parentReadOnly){
						service.setRowReadOnly(item,parentReadOnly);
					}
					else {
						service.setFieldsReadOnly(item);
					}
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'Remark':
							return (item.ItemType>0)&&(item.PrrConfigurationFk>0);
						case 'AmountInc':
							return item.ItemType>0&&item.ItemAmountEditable;
						case 'AmountTotal':
							return (item.ItemType===1||item.ItemType===3||item.ItemType===4||item.ItemType===5)&&item.ItemAmountEditable;
						case 'Percentage':
							return (item.ItemType===1)&&item.ItemAmountEditable;
						case 'PostingNarrative':
							return (item.PrrConfigurationFk!==null)&&(item.PrrConfigurationFk>0);
						default :
							return false;
					}
				};


				return service;
			}]);

})(angular);
