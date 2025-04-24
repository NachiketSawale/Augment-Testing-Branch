/**
 * Created by zwz on 03/15/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, globals */

	let moduleName = 'productionplanning.product';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningProductEngProdCompMapCheckBtnExtension
	 * @function
	 * @requires _, $translate
	 * @description
	 * productionplanningProductEngProdCompMapCheckBtnExtension provides Mapped Product Component checking functionality for Product Component list controller
	 */
	angModule.service('productionplanningProductEngProdCompMapCheckBtnExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', 'platformModalService'];

	function Extension(_, $http, $translate, platformModalService) {

		/**
		 * @ngdoc function
		 * @name createBtn
		 * @description Public function that creates Mapped Product Component checking button for Product Component list controller.
		 * @param {Object} dataService: The dataService that functionality of button depends on.
		 **/
		this.createBtn = function (dataService, $scope) {
			let isShowingDialog = false;
			return {
				id: 't1',
				caption: 'productionplanning.product.engProdComponent.engPropCompMapDialogTitle',
				type: 'item',
				iconClass: 'control-icons ico-criterion-lookup',
				fn: function () {
					isShowingDialog = true;
					let selected = dataService.getSelected();
					let filterObj = {
						originProductId: selected.PpsProductOriginFk,
						targetEngProdComponentId: selected.Id,
					};
					$http.post(globals.webApiBaseUrl + 'productionplanning/product/engprodcomponentwithmap/list', filterObj).then(function (response) {
						function showDialog(engProdComponentWithMapInfoArray) {
							var modalCreateConfig = {
								width: '960px',
								resizeable: true,
								templateUrl: globals.appBaseUrl + 'productionplanning.product/templates/pps-product-engprodcompmap-dialog.html',
								controller: 'productionplanningProductEngProdCompMapDialogController',
								resolve: {
									'$options': function () {
										return {
											engProdComponentWithMapInfos: engProdComponentWithMapInfoArray,
											targetEngProdComponent: dataService.getSelected()
										};
									}
								}
							};
							platformModalService.showDialog(modalCreateConfig).then(function (){
								isShowingDialog = false;
								$scope.tools.update();
							});
						}

						if (response.data) {
							showDialog(response.data);
						}
					});

				},
				disabled: function () {
					if(isShowingDialog){
						return true;
					}
					let selected = dataService.getSelected();
					return !selected
						|| selected.EngDrwCompTypeFk !== 5 // 5 maps `Product` type
						|| _.isNil(selected.PpsProductOriginFk);
				}
			};
		};
	}
})(angular);
