/**
 * Created by lcn on 11/16/2021.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */

	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.package').factory('procurementPackage2ExtBidderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService',
			function (commonReadOnlyProcessor, procurementContextService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcPackage2ExtBidderDto',
					moduleSubModule: 'Procurement.Common',
					uiStandardService: 'procurementPackage2ExtBidderUIStandardService',
					readOnlyFields: ['SubsidiaryFk', 'ContactFk', 'BusinessPartnerFk', 'BpName1', 'BpName2', 'Street', 'City', 'Zipcode', 'Email',
						'CountryFk', 'Telephone', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'Remark']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					if(!procurementContextService.getMainService()){
						return;
					}
					service.setRowReadonlyFromLayout(item);
				};

				service.getCellEditable = function (item, model) {
					// eslint-disable-next-line no-unused-vars
					var mainService = procurementContextService.getMainService();
					var editable = true;
					if (procurementContextService.isReadOnly){
						return false;
					}
					if (model === 'SubsidiaryFk' || model === 'ContactFk') {
						editable = item.BusinessPartnerFk !== null;
					}
					else if (model === 'BpName2' || model === 'Street' ||
						model === 'City' || model === 'Zipcode' || model === 'Email' ||
						model === 'CountryFk' || model === 'Telephone' || model === 'UserDefined1' ||
						model === 'UserDefined2' || model === 'UserDefined3' || model === 'UserDefined4' ||
						model === 'UserDefined5' || model === 'CommentText' || model === 'Remark'){
						editable = item.BusinessPartnerFk === null;
					}
					if (model === 'BusinessPartnerFk') {
						editable = false;
					}

					return editable;
				};

				return service;
			}]);
})(angular);
