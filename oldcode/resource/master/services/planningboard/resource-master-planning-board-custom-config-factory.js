(function (angular) {

	'use strict';
	const module = angular.module('resource.reservation');
	module.service('resourceMasterPlanningBoardCustomConfigFactory', ResourceMasterPlanningBoardCustomConfigFactory);

	ResourceMasterPlanningBoardCustomConfigFactory.$inject = ['_','moment','$injector','platformDataServiceFactory',];

	function ResourceMasterPlanningBoardCustomConfigFactory(_, moment, $injector, platformDataServiceFactory) {

		let serviceConfigOption = {};

		this.getConfig = function getConfig(option) {

			if(option.uuid){
				serviceConfigOption.uuid = option.uuid;
			}
			let customConfigService = platformDataServiceFactory.createNewComplete(serviceConfigOption);

			customConfigService.validOnDueDateConfig = function validOnDueDateConfig() {
			return 	{
					rows: [
						{
							gid: '1',
							rid: 'resourceValidOn',
							validator: validatorOnDueDate,
							label: 'resourceValidOnForCustomDate',
							label$tr$: 'resource.reservation.validOnCheckBox',
							type: 'boolean',
							model: 'validOnCheckBox',
							visible: true,
							sortOrder: 99,
						},
						{
							gid: '1',
							rid: 'resourceValidOn',
							label: 'resourceValidOnDueDate',
							label$tr$: 'resource.reservation.validOnDueDate',
							type: 'date',
							model: 'validOnDueDate',
							visible: true,
							readonly: false,
							sortOrder: 100,
						}
					]
				};
			};

			// private function
			function validatorOnDueDate(entity, value) {
				if(!value){
					moment.utc(entity.validOnDueDate).format();
					entity.validOnDueDate = '';
				} else{
					if(!entity.validOnDueDate || entity.validOnDueDate === ''){
						entity.validOnDueDate =  moment.utc (new Date()).format();
					}
				}
			}

			customConfigService.service.getUUid = function getUUid() {

			};

			return customConfigService;
		};

		// define function service
		let serviceOption2 = {};
		this.getService = function getService() {
			let helperTools = platformDataServiceFactory.createNewComplete(serviceOption2);

			helperTools.datesAreBetweenValidSpan = function datesAreBetweenValidSpan(resource, aimDate ) {
				let isValid = false;

				if(!resource.Validfrom && !resource.Validto){
					isValid = true;
				}
				if (resource.Validfrom && moment(resource.Validfrom).isBefore(aimDate) && resource.Validto && moment(resource.Validto).isAfter(aimDate)) {
					isValid = true;
				}
				if (resource.Validfrom && moment(resource.Validfrom).isBefore(aimDate) && !resource.Validto) {
					isValid = true;
				}
				if (resource.Validto && moment(resource.Validto).isAfter(aimDate) && !resource.Validfrom) {
					isValid = true;
				}
				return isValid;
			};

			helperTools.hasToFilterByValidOnDueDate = function hasToFilterByValidOnDueDate() {
				let gridSettings = helperTools.getGridSettings();
				return gridSettings && gridSettings.validOnCheckBox && gridSettings.validOnDueDate ? true : false;
			};

			helperTools.filterResourcesValidOnDueDate = function filterResourcesValidOnDueDate(resources) {
				let filteredResources = [];
				let gridSettings =  helperTools.getGridSettings();

				_.forEach(resources, function (resource) {
					if(helperTools.datesAreBetweenValidSpan(resource, moment.utc(gridSettings.validOnDueDate))){
						// is in valid range
						filteredResources.push(resource);
					}
				});
				return filteredResources;
			};

			helperTools.getGridSettings = function getGridSettings() {
				let dialogConfig = $injector.get('platformPlanningBoardConfigService').getConfigByUUID(serviceConfigOption.uuid);
				return _.find(dialogConfig, {id: 'planningBoard.chart.gridSettings'});
			};

			return helperTools;
		};

	}
})(angular);
