/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobLocation2DataService
	 * @description pprovides methods to access, create and update logistic job  entities
	 */
	myModule.service('logisticJobLocation2DataService', LogisticJobLocation2DataService);

	LogisticJobLocation2DataService.$inject = [
		'logisticJobLocationDataServiceFactory', '$injector', '$http', '$translate', 'moment', 'platformDataServiceEntityReadonlyProcessor',
		'platformModalFormConfigService', 'platformDataServiceHttpResourceExtension','platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'logisticJobDataService'];

	function LogisticJobLocation2DataService(
		logisticJobLocationDataServiceFactory, $injector, $http, $translate, moment, platformDataServiceEntityReadonlyProcessor,
		platformModalFormConfigService, platformDataServiceHttpResourceExtension, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, logisticJobDataService
	) {
		var self = this;
		var config = {
			serviceName: 'logisticJobLocation2DataService',
			module: myModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					var selected = logisticJobDataService.getSelected();
					readData.JobFk = selected.Id;
				},
				endRead: 'listbyparentpaging'
			},
			entityRole:{
				parentService: logisticJobDataService
			},
			presenter: {
				list: {
					enablePaging: true
				}
			}
		};
		let serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'logisticJobPlantLocation2LayoutService',
			'logistic.job.plantLocation2ListTitle',
			'logistic.job.listJobTitle'
		);
		return serviceContainer.service;
	}
})(angular);
