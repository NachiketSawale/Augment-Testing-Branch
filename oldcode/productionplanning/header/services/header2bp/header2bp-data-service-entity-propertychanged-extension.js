/**
 * Created by zwz on 10/09/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeader2BpDataServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningHeader2BpDataServiceEntityPropertychangedExtension provides entity property-changed functionality for header2bp data service
	 *
	 */
	angular.module(moduleName).factory('productionplanningHeader2BpDataServiceEntityPropertychangedExtension', Service);

	Service.$inject = ['$http', '$injector'];

	function Service($http, $injector) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onBusinessPartnerFkChanged = function (entity, field, dataService) {
			if (entity.BusinessPartnerFk > 0) {
				$http.get(globals.webApiBaseUrl + 'businesspartner/main/subsidiary/lookup?bpId=' + entity.BusinessPartnerFk).then(function (result) {
					if (result && result.data.length > 0) {
						var sub = _.first(_.filter(result.data, function (item) {
							return item.IsMainAddress === true;
						}));
						if (sub) {
							entity.SubsidiaryFk = sub.Id;
							var validateServ = $injector.get('productionplanningHeader2BpValidationService');
							if(validateServ.validateSubsidiaryFk){
								var validateResult = validateServ.validateSubsidiaryFk(entity,entity.SubsidiaryFk, 'SubsidiaryFk');
								if ((validateResult === true || (validateResult && validateResult.valid)) && entity.__rt$data.errors && entity.__rt$data.errors.SubsidiaryFk) {
									delete entity.__rt$data.errors.SubsidiaryFk; // empty error of field SubsidiaryFk if vaildation result is valid
								}
							}
							dataService.gridRefresh();
						}
					}
				});
			}
		};

		return service;
	}
})(angular);