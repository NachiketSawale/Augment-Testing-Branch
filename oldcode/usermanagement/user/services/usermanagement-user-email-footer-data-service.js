/**
 * Created by baf on 04.03.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	const module = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name usermanagementUserEmailFooterDataService
	 * @description provides methods to access, create and update Project Main Activity entities
	 */
	module.service('usermanagementUserEmailFooterDataService', UsermanagementUserEmailFooterDataService);

	UsermanagementUserEmailFooterDataService.$inject = ['platformSpecificationContainerDataServiceFactory', 'usermanagementUserMainService'];

	function UsermanagementUserEmailFooterDataService(platformSpecificationContainerDataServiceFactory, usermanagementUserMainService) {
		const self = this;
		const usermanagementUserEmailFooterDataServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'usermanagementUserEmailFooterDataService',
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'EmailFooter', parentService: usermanagementUserMainService, parentChildProp: "BlobsEmailFooterFk"}
				}
			}
		};

		const serviceContainer = platformSpecificationContainerDataServiceFactory.createDataService(usermanagementUserEmailFooterDataServiceOption, self);
	}
})(angular);