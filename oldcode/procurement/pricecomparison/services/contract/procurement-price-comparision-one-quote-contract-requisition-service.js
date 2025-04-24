/**
 * Created by chi on 5/6/2016.
 */
(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonOneQuoteContractRequisitionService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * A service for creating a contract for the bidder with it's all quote procurement item(s).
	 */
	angular.module(moduleName).factory('procurementPriceComparisonOneQuoteContractRequisitionService', [
		'_',
		'platformDataServiceFactory',
		'procurementPriceComparisonOneQuoteContractMainService',
		'platformRuntimeDataService',
		'procurementPriceComparisonCreateContractWizardGridService',
		'ServiceDataProcessDatesExtension',
		'SchedulingDataProcessTimesExtension',
		function (
			_,
			platformDataServiceFactory,
			procurementPriceComparisonOneQuoteContractMainService,
			platformRuntimeDataService,
			procurementPriceComparisonCreateContractWizardGridService,
			ServiceDataProcessDatesExtension,
			SchedulingDataProcessTimesExtension
		) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonOneQuoteContractRequisitionService',
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: '',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				},
				httpRead: {
					useLocalResource: true,
					resourceFunction: getData
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},
				isInitialSorted: false,
				dataProcessor: [
					new ServiceDataProcessDatesExtension(['DateReceived', 'DateEffective', 'DateDelivery', 'DatePriceFixing', 'DeadlineDate','DateRequired']),
					new SchedulingDataProcessTimesExtension(['DeadlineTime'])
				]
			};

			let service = platformDataServiceFactory.createNewComplete(serviceOption).service;
			let options = {};
			service.updateCheckedItems = updateCheckedItems;
			service.setOptions = function (_options) {
				options = angular.extend(options, _options);
			};
			procurementPriceComparisonCreateContractWizardGridService.registerOnSelectedQuoteChanged.register(service.load);

			function incorporateDataRead(readData, data) {

				// set child field 'IsCheck' readonly according to different cases
				_.forEach(readData, function (base) {
					_.forEach(base.Children, function (child) {
						if (base.isChecked && child.Id < 0) { // if the base is req header, the variant should be readonly
							platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
						}
						if (child.isForPartialReqAssigned) { // if the child is variant which is assigned to rfq bidders, then it should be readonly
							platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
						}
						if (child.Children && child.Children.length > 0) { // if the child is co req header
							_.forEach(child.Children, function (variant) {
								if (child.isChecked && variant.Id < 0) { // if the base is co (change order) req header, the variant should be readonly
									platformRuntimeDataService.readonly(variant, [{field: 'isChecked', readonly: true}]);
								}
								if (variant.isForPartialReqAssigned) { // if the child is variant which is assigned to rfq bidders, then it should be readonly
									platformRuntimeDataService.readonly(variant, [{field: 'isChecked', readonly: true}]);
								}
							});
						}
					});
				});
				return data.handleReadSucceeded(readData, data);
			}

			function getData() {
				let allReqHeaders;
				let addSelectedReqHeader;
				if (options.dataSource === 'wizard') {
					allReqHeaders = procurementPriceComparisonCreateContractWizardGridService.getAllReqHeaders();
					addSelectedReqHeader = procurementPriceComparisonCreateContractWizardGridService.addSelectedReqHeader;
				} else {
					allReqHeaders = procurementPriceComparisonOneQuoteContractMainService.getAllReqHeaders();
					addSelectedReqHeader = procurementPriceComparisonOneQuoteContractMainService.addSelectedReqHeader;
				}

				_.forEach(allReqHeaders, function (parent) {
					let isChecked = false;
					let hasPartialReqAssigned = false;
					parent.Children = _.filter(allReqHeaders, function (item) {
						if (item.ReqHeaderFk === parent.Id) {
							if (!item.isChecked && parent.isChecked && item.Id > 0) { // if parent is checked, then co reqHeader should be checked
								if (item.Id > 0) {
									item.isChecked = true;
									addSelectedReqHeader(item);
								}
							}

							if (item.isForPartialReqAssigned) {
								hasPartialReqAssigned = true;
							}
						}
						return item.ReqHeaderFk === parent.Id;
					});

					// if there are no variants which are assigned to rfq bidders, judge whether the parent need to check or not according to the co reqheader is checked or not.
					if (!hasPartialReqAssigned) {
						isChecked = parent.Children && parent.Children.length > 0 ?
							parent.Children.filter(e => e.Id > 0).some(e => e.isChecked) : false;
					}
					if (isChecked && !parent.isChecked) {
						parent.isChecked = isChecked;
						addSelectedReqHeader(parent);
					}
				});
				return _.filter(allReqHeaders, function (item) {
					return !item.ReqHeaderFk;
				});
			}

			function updateCheckedItems(item) {
				if (options.dataSource === 'wizard') {
					procurementPriceComparisonCreateContractWizardGridService.updateSelectedReqHeaderIds(item);
				} else {
					procurementPriceComparisonOneQuoteContractMainService.updateSelectedReqHeaderIds(item);
				}
			}

			return service;
		}
	]);
})(angular);