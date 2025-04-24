/**
 * Created by zwz on 2021/4/7.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningActivityGotoBtnsExtension
	 * @function
	 * @requires _, $http, $injector, $q, $translate, platformModuleNavigationService, basicsLookupdataLookupDescriptorService
	 * @description
	 * productionplanningActivityGotoBtnsExtension provides goto-buttons for PPS activity list controller
	 */
	angModule.service('productionplanningActivityGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$injector', '$q', '$translate', 'platformModuleNavigationService', 'basicsLookupdataLookupDescriptorService','$rootScope', 'platformGridAPI'];

	function Extension(_, $http, $injector, $q, $translate, naviService, basicsLookupdataLookupDescriptorService,$rootScope, platformGridAPI) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for activity list controller.
		 * @param {Object} activityDataService: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (activityDataService) {
			return {
				id: 'goto',
				caption: $translate.instant('cloud.common.Navigator.goTo'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [{
						id: 'reportGoto',
						caption: $translate.instant('productionplanning.report.entityReport'),
						type: 'item',
						iconClass: 'app-small-icons ico-mounting-report',
						fn: function () {
							var navigator = { moduleName: 'productionplanning.report' };
							var selectedItem = activityDataService.getSelected();

							if (activityDataService.isSelection(selectedItem)) {
								if (_.isFunction(activityDataService.update)){
									$rootScope.$emit('before-save-entity-data');
									platformGridAPI.grids.commitAllEdits();
									activityDataService.update().then(function () {
										naviService.navigate(navigator, selectedItem);
										return $rootScope.$emit('after-save-entity-data');
									});
								}else{
									naviService.navigate(navigator, selectedItem);
								}
							}
						}
					}, {
						id: 'trsRequisitionGoto',
						caption: $translate.instant('transportplanning.requisition.entityRequisition'),
						type: 'item',
						iconClass: 'app-small-icons ico-transport-requisition',
						fn: function () {
							var navigator = { moduleName: 'transportplanning.requisition' };
							var selectedItem = activityDataService.getSelected();

							if (activityDataService.isSelection(selectedItem)) {
								if (_.isFunction(activityDataService.update)){
									$rootScope.$emit('before-save-entity-data');
									platformGridAPI.grids.commitAllEdits();
									activityDataService.update().then(function () {
										naviService.navigate(navigator, selectedItem, 'MountingAcitivity');
										return $rootScope.$emit('after-save-entity-data');
									});
								}else{
									naviService.navigate(navigator, selectedItem, 'MountingAcitivity');
								}

								//never start a dataservice list request for a root dataservice before finishing navigating to a new module!
								//$injector.get('transportplanningRequisitionMainService').searchItemByActivity(selectedItem);
							}

							var promises = [];
							promises.push($http.post(globals.webApiBaseUrl + 'basics/customize/transportrequisitionstatus/list'));
							promises.push($injector.get('basicsLookupdataSimpleLookupService').getList({
								lookupModuleQualifier: 'basics.customize.transportrequisitionstatus',
								displayMember: 'Description',
								valueMember: 'Id'
							}));
							return $q.all(promises).then(function (responses) {
								var orgStatus = _.sortBy(responses[0].data, 'Id');
								var lookupStatus = _.sortBy(responses[1], 'Id');
								var combinedStatus = angular.merge(orgStatus, lookupStatus);
								basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportrequisitionstatus', combinedStatus);
								basicsLookupdataLookupDescriptorService.updateData('TrsRequisitionStatus', combinedStatus);
							});
						}
					}]
				},
				disabled: function () {
					return _.isEmpty(activityDataService.getSelected());
				}
			};
		};
	}
})(angular);
