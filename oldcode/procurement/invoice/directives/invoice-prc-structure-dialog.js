(function (angular, globals, $) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,$ */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).directive('procurementInvoicePrcStructureDialog', [
		'BasicsLookupdataLookupDirectiveDefinition', '$http', '_', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $http, _, $injector) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcStructure($injector).lookupOptions, {
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					var getLastStructure = function () {
						var entity = $scope.entity;
						var id = entity.Id;
						var BusinessPartnerId = entity.BusinessPartnerFk;
						if (!_.isNull(BusinessPartnerId)) {
							var url = 'procurement/invoice/header/getLastestPrcStructure?id=' + id + '&busniessPartnerFk=' + BusinessPartnerId;
							$http.get(globals.webApiBaseUrl + url).then(function (response) {
								if (null !== response.data) {
									$scope.entity.PrcStructureFk = response.data;
								}
							});
						}

					};
					$.extend($scope.lookupOptions, {
						extButtons: [
							{
								class: 'control-icons ico-input-get',
								// style: lookupButtonStyle,
								execute: getLastStructure,
								canExecute: function () {
									var entity = $scope.entity;
									if (!entity) {
										return false;
									}
									if (entity.__rt$data && entity.__rt$data.locked) {
										return false;
									}
									if (entity.__rt$data && !_.isNil(entity.__rt$data.readonly)) {
										var arrReadonlyFields = entity.__rt$data.readonly;
										var readonlyField = _.find(arrReadonlyFields, function (o) {
											return o.field === 'PrcStructureFk' && o.readonly;
										});
										if (readonlyField) {
											return false;
										}
									}
									return true;
								}
							}
						]
					});

				}]
			});
		}
	]);
})(angular, globals, $);