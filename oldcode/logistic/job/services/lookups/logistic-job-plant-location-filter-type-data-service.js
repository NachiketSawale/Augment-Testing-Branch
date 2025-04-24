/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobLookupDataService
	 * @function
	 *
	 * @description
	 * logisticJobLookupDataService is the data service for requisition look ups
	 */
	angular.module('logistic.job').service('logisticJobPlantLocationFilterTypeDataService', LogisticJobPlantLocationFilterTypeDataService);

	LogisticJobPlantLocationFilterTypeDataService.$inject = ['_', '$q'];

	const filterTypes = [
		{ Id: 1, Code: 'Plant Group', Description: 'Filter by Plant Group' },
		{ Id: 2, Code: 'Plant Type', Description: 'Filter by Plant Type' },
		{ Id: 3, Code: 'Plant Kind', Description: 'Filter by Plant Kind' },
		{ Id: 4, Code: 'Workoperation Type', Description: 'Filter by Workoperation Type' }
	];

	function LogisticJobPlantLocationFilterTypeDataService(_, $q) {
		let self = this;

		this.setCache = _.noop;

		this.getListSync = function getListSync() {
			return filterTypes;
		};

		this.getList = function getList() {
			return $q.when(filterTypes);
		};

		this.getFilteredListSync = function getFilteredListSync() {
			return filterTypes;
		};

		this.getFilteredList = function getFilteredList() {
			return $q.when(filterTypes);
		};

		this.getLookupData = function getLookupData() {
			return $q.when(filterTypes);
		};

		this.getDefault = function getDefault() {
			return filterTypes[0];
		};

		this.getItemById = function getItemById(id) {
			return _.find(filterTypes, function (ft) {
				return ft.Id === id;
			});
		};

		this.getItemByIdAsync = function getItemByIdAsync(id) {
			let item = self.getItemById(id);

			return $q.when(item);
		};
	}
})(angular);
