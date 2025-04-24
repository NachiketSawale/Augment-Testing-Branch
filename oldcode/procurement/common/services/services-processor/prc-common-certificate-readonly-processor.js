/**
 * Created by wwa on 1/4/2016.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('procurement.common').factory('procurementCommonCertificateReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService',
			function (commonReadOnlyProcessor, moduleContext) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcCertificateDto',
					moduleSubModule: 'Procurement.Common',
					uiStandardService: 'procurementCommonCertificateUIStandardService',
					readOnlyFields: ['RequiredAmount', 'BpdCertificateTypeFk', 'Isrequired', 'Ismandatory','Isrequiredsubsub','Ismandatorysubsub','RequiredBy','RequiredAmount','CommentText']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var MainService = moduleContext.getMainService();
					if(!MainService){
						return true;
					}
					var isPackage = MainService.name === 'procurement.package';
					var isContract = MainService.name === 'procurement.contract';
					let isRequisition = MainService.name === 'procurement.requisition';

					var readOnyStatus = false;

					if(isPackage ||isContract||isRequisition){
						readOnyStatus = moduleContext.isReadOnly;
					}
					service.setRowReadonlyFromLayout(item, readOnyStatus);
					return readOnyStatus;
				};

				service.getCellEditable = function (item, model) {
					var editable = true;

					if (model === 'RequiredAmount') {
						editable = item.IsValued;
					}

					var moduleName = moduleContext.getModuleName();
					if(moduleName === 'procurement.contract'){
						var leadingService = moduleContext.getLeadingService();
						if(leadingService !== null){
							var leadinSelectedItem = leadingService.getSelected();
							if( leadinSelectedItem !== null && leadinSelectedItem.ConHeaderFk !== null && leadinSelectedItem.ProjectChangeFk !== null){
								editable = false;
							}
						}
					}

					return editable;
				};

				return service;
			}]);
})(angular);