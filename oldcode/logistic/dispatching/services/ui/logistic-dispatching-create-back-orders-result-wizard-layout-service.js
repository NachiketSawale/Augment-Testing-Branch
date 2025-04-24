/**
 * Created by nitsche on 03.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingCreateBackOrdersResultLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching dispatching entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingCreateBackOrdersResultLayoutService', LogisticDispatchingCreateBackOrdersResultLayoutService);

	LogisticDispatchingCreateBackOrdersResultLayoutService.$inject = [
		'platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues',
		'logisticDispatchingTranslationService', 'platformLayoutHelperService'
	];

	function LogisticDispatchingCreateBackOrdersResultLayoutService(
		platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues,
		logisticDispatchingTranslationService, platformLayoutHelperService) {
		let self = this;

		this.getListLayout = function getListLayout() {
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory(
				'1.0.0',
				'logistic.dispatching.createbackorderwizardsresultlist',
				['description']
			);
			res.overloads = {};//platformLayoutHelperService.getOverloads([], self);
			res.overloads.description = {width : 700};
			return res;
		};
		this.getOverload = function getOverload(overload) {
			let ovl = null;
			switch (overload) {
				case 'resrequisitionFk':
					ovl = {
						navigator: {
							moduleName: 'resource.requisition'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									lookupType: 'resourceRequisition',
									showClearButton: true
								},
								directive: 'resource-requisition-lookup-dialog-new'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'resourceRequisition',
								version: 3,
								displayMember: 'Description'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'resource-requisition-lookup-dialog-new',
								descriptionMember: 'Description',
								displayMember: 'Code',
								showClearButton: true
							}
						}
					};
					break;
			}
			return ovl;
		};
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: self.getListLayout(),
			dtoSchemeProperties: {Description: {domain: 'description'}},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);