/**
 * Created by shen on 10/27/2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name ProjectTextModuleTypeLookupDataService
	 * @description provides lookup methods for project header text entities
	 */
	angular.module(moduleName).service('projectTextModuleTypeLookupDataService', ProjectTextModuleTypeLookupDataService);

	ProjectTextModuleTypeLookupDataService.$inject = ['_', '$http', '$injector'];

	function ProjectTextModuleTypeLookupDataService(_, $http, $injector) {
		let textModuleTypeIdsWithIsGlobal = [];

		let lookup = $injector.get('basicsLookupdataSimpleLookupService');

		function getTextModuleTypeIdsWithIsGlobal(){
			lookup.getList({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.textmoduletype',
				filter: {
					customBoolProperty: 'ISGLOBAL'
				}
			}).then(function (response) {
				if(response) {
					textModuleTypeIdsWithIsGlobal = _.map(_.filter(response, {Isglobal: true}), function (item) {
						return item.Id;
					});
				}
			});
		}

		getTextModuleTypeIdsWithIsGlobal();


		this.getTextModuleTypeIdsWithIsGlobal = function getTextModuleTypeIdsWithIsGlobal(){
			return textModuleTypeIdsWithIsGlobal;
		};


	}
})(angular);

