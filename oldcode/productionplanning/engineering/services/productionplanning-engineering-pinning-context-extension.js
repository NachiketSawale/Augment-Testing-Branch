/**
 * Created by zwz on 2020/1/7.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringPinningContextExtension
	 * @function
	 * @requires basicsLookupdataLookupDescriptorService, projectMainPinnableEntityService, productionplanningEngineeringPinnableEntityService, $q
	 * @description
	 * productionplanningEngineeringPinningContextExtension provides pinning context functionality for engineering task data service
	 */
	engtaskModule.service('productionplanningEngineeringPinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = [
		'basicsLookupdataLookupDescriptorService',
		'projectMainPinnableEntityService',
		'productionplanningEngineeringPinnableEntityService',
		'$q'];

	function PinningContextExtension(basicsLookupdataLookupDescriptorService,
									 projectMainPinnableEntityService,
									 productionplanningEngineeringPinnableEntityService,
									 $q) {

		// pinning context (project, engheader)
		function setEngineeringToPinningContext(projectId, engheader, dataservice) {
			var engheaderId = _.get(engheader, 'Id');
			if ((projectMainPinnableEntityService.getPinned() !== projectId) || (productionplanningEngineeringPinnableEntityService.getPinned() !== engheaderId)) {
				var ids = {};
				productionplanningEngineeringPinnableEntityService.appendId(ids, engheaderId);
				projectMainPinnableEntityService.appendId(ids, projectId);
				return productionplanningEngineeringPinnableEntityService.pin(ids, dataservice).then(function () {
					return true;
				});
			} else {
				return $q.when(false);
			}
		}

		function setCurrentPinningContext(dataService) {
			var curItem = dataService.getSelected();
			if (curItem) {

				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('EngHeader', curItem.EngHeaderFk)).then(function (header) {
					setEngineeringToPinningContext(header.ProjectFk, header, dataService).then(function () {
						dataService.PinningContextChanged.fire();
					});
				});
			}
		}

		this.createPinningOptions = function () {
			return {
				isActive: true,
				showPinningContext: [
					{ token: 'project.main', show: true },
					{ token: 'productionplanning.engineering', show: true }
				],
				setContextCallback: setCurrentPinningContext
			};
		};

		this.addPinningContextChanged = function (dataService) {
			dataService.PinningContextChanged = new Platform.Messenger();
		};

		this.setEngineeringToPinningContext = setEngineeringToPinningContext; // this.setEngineeringToPinningContext is referenced(for example, it's called by navigateTo() of productionplanningEngineeringMainService).

	}
})(angular);
