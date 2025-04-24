(function(angular){


	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';


	angular.module(moduleName).controller('procurementCommonUpdateWicFromBoqController',  updateWicFromBoqController);

	updateWicFromBoqController.$inject = ['$http', '$scope', '$translate', '$injector', 'platformGridAPI', 'platformModalService', 'platformTranslateService', 'basicsLookupdataLookupFilterService'];

	function updateWicFromBoqController($http, $scope, $translate, $injector, platformGridAPI, platformModalService, platformTranslateService, basicsLookupdataLookupFilterService){

		$scope.modalOptions = $scope.modalOptions || { };
		$scope.customOptions = {
			updateBtn:updateBtn,
		};
		const entity=$scope.modalOptions.requestData;
		$scope.currentItem = {
			QtnHeaderFk: entity.QtnHeaderFk || null,
			ConHeaderFk: entity.ConHeaderFk || null,
			BoQItemFk: entity.BoQItemFk,
			WicGroupFk: entity.WicGroupFk,
			BoqHeaderFk: entity.BoqHeaderFk,
			boqRef: entity.boqRef,
			boqOutlineSpec: entity.boqOutlineSpec
		};
		$scope.requsetData={
			BoqItemWicBoqFk: $scope.modalOptions.requestData.BoqItemWicBoqFk,
			BoqHeaderFk: $scope.modalOptions.requestData.BoqHeaderFk,
			IsUnitRate: false,
			IsQuantity: false,
			IsUoM: false,
			IsItemTypeStand: false,
			IsItemTypeBase: false,
		};

		var filters = [
			{
				key: 'procurement-price-comparison-copy-boq-qtn-filter',
				serverKey: 'procurement-price-comparison-copy-boq-qtn-filter',
				serverSide: true,
				fn: function () {

					var procurementPriceComparisonService = $injector.get('procurementPriceComparisonMainService');
					var rfqHeader = procurementPriceComparisonService.getSelected();
					var rfqHeaderId = rfqHeader ? rfqHeader.Id : -1;

					return {RfqHeaderFk: rfqHeaderId};
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		// ///////////////////////
		/*
		* please don`t leave registerFilter after $scope.lookupOptions definition.
		* */
		$scope.lookupOptions = {
			quote: {
				lookupDirective: 'procurement-quote-header-lookup',
				descriptionMember: 'Description',
				lookupOptions: {
					filterKey: 'procurement-price-comparison-copy-boq-qtn-filter',
					showClearButton: false
				}
			},
			sourceBoq: {
				lookupDirective: 'basics-lookup-data-by-custom-data-service',
				descriptionMember: 'BriefInfo.Translated',
				lookupOptions: {
					valueMember: 'Id',
					displayMember: 'Reference',
					showClearButton: false,
					lookupModuleQualifier: 'prcCommonRootBoqItemLookupService',
					dataServiceName: 'prcCommonRootBoqItemLookupService',
					lookupType: 'prcCommonRootBoqItemLookupService',
					columns: [
						{
							id: 'reference',
							field: 'Reference',
							name: 'Reference',
							formatter: 'description',
							name$tr$: 'boq.main.Reference'
						},
						{
							id: 'brief',
							field: 'BriefInfo',
							name: 'Outline Specification',
							formatter: 'translation',
							name$tr$: 'boq.main.BriefInfo'
						}
					],
					uuid: '49b49742451d430ca63453b7d9d03487',
					filter: function () {
						// currently, PKey1 means qtnHeaderId, PKey2 means conHeaderId.
						var qtnHeaderId = $scope.currentItem.QtnHeaderFk || -1;
						var conHeaderId = $scope.currentItem.ConHeaderFk || -1;

						return {PKey1: qtnHeaderId, PKey2: conHeaderId};
					},
					disableDataCaching: true,
					// enableCache: false,
					isClientSearch: false,
					isTextEditable: false,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var selectedItem = args.entity;
								var selectedLookupItem = args.selectedItem;

								if (selectedItem && selectedLookupItem) {
									selectedItem.BoqHeaderFk = selectedLookupItem.BoqHeaderFk;
									// set ReferenceNo and outline specification to xxx.
									selectedItem.boqRef = selectedLookupItem.Reference;
									selectedItem.boqOutlineSpec = selectedLookupItem.BriefInfo.Translated;
								}
							}
						}
					]
				}
			},
			wicGroup: {
				lookupDirective: 'basics-lookup-data-by-custom-data-service',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					valueMember: 'Id',
					displayMember: 'Code',
					lookupModuleQualifier: 'estimateAssembliesWicGroupLookupDataService',
					dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
					showClearButton: false,
					lookupType: 'estimateAssembliesWicGroupLookupDataService',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode',
							readOnly: true
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					uuid: 'aee374374c634e27ba45e6e145f872ae',
					isTextEditable: false,
					treeOptions: {
						parentProp: 'WicGroupFk',
						childProp: 'WicGroups',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
				}
			}
		};

		$scope.fieldConfigs = {
			sourceBoq: {
				rt$readonly: true
			},
			wicGroup: {
				rt$readonly: true
			}
		};

		/*
		* update wic boq.
		* **/
		function updateBtn(){
			$scope.modalOptions.dialogLoading = true;
			$scope.updateBtnDisabled=true;
			const requestData=$scope.requsetData;
			$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/UpdateWicFromBoqOfQtn?', requestData).then(function () {
				// const result = res.data;
				const message = 'procurement.common.updateWicFromBoq.updateSuccessfully';
				const title = 'cloud.common.informationDialogHeader';
				platformModalService.showMsgBox(message, title, 'info').then(function () {
					// close dialog.
					$scope.$close(true);
				});

			}).finally(function () {
				$scope.modalOptions.dialogLoading = false;
			});
		}
	}

})(angular);