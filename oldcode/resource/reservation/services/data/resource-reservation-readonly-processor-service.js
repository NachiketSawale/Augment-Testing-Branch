/**
 * Created by shen on 3/22/2022
 */


(function (angular) {
	'use strict';
	let moduleName = 'resource.reservation';

	/**
	 * @ngdoc service
	 * @name resourceReservationReadonlyProcessorService
	 * @description provides methods for resource reservation readonly entities
	 */
	angular.module(moduleName).service('resourceReservationReadonlyProcessorService', ResourceReservationReadonlyProcessorService);

	ResourceReservationReadonlyProcessorService.$inject = ['platformRuntimeDataService'];

	function ResourceReservationReadonlyProcessorService(platformRuntimeDataService) {
		let self = this;

		self.processItem = function (item) {
			let fields = [
				{
					field: 'TypeFk',
					readonly: true
				},
				{
					field: 'DispatcherGroupFk',
					readonly: true
				},
				{
					field: 'WorkingDays',
					readonly: true
				},
				{
					field: 'CalendarDays',
					readonly: true
				},
				{
					field: 'JobPreferredFk',
					readonly: true
				}
			];
			platformRuntimeDataService.readonly(item, fields);
			if(item.IsReadOnly){
				platformRuntimeDataService.readonly(item, true);
			}
		};
	}
})(angular);
