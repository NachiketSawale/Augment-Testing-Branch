/**
 * Created by luo on 1/4/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.rfq';
	/** @namespace selectedItem.IsTo */
	angular.module(moduleName).value('procurementRfqFaxRecipientColumnDef', {
		getStandardConfigForListView: function () {
			return {
				addValidationAutomatically: true,
				columns: [
					{
						id: 'isTo',
						field: 'IsTo',
						name: 'Select All',
						name$tr$: 'procurement.rfq.bidder.isTo',
						width: 100,
						editor: 'boolean',
						formatter: 'boolean',
						headerChkbox: true,
						cssClass: 'cell-center'
					},
					{
						id: 'businessPartnerName1',
						field: 'BusinessPartnerName1',
						name: 'Company Name',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerBPName1',
						width: 150,
						formatter: 'description'
					},
					{
						id: 'firstName',
						field: 'FirstName',
						name: 'Contact First Name',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactFirstName',
						width: 110,
						formatter: 'description'
					},
					{
						id: 'lastName',
						field: 'LastName',
						name: 'Contact Last Name',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactLastName',
						width: 110,
						formatter: 'description'
					},
					{
						id: 'to',
						field: 'To',
						name: 'Contact Fax Number',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactFax',
						width: 150,
						formatter: 'description'
					},
					{
						id: 'isCC',
						field: 'IsCc',
						name: 'CC ',
						name$tr$: 'procurement.rfq.bidder.isCc',
						width: 50,
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center'
					},
					{
						id: 'cc',
						field: 'Cc',
						name: 'CC Company Fax Number',
						name$tr$: 'procurement.rfq.bidder.cCFax',
						width: 150,
						formatter: 'description'
					}
				]
			};
		}
	});


	/**
	 * @ngdoc controller
	 * @name procurementRfqFaxRecipientController
	 * @requires []
	 * @description
	 * #
	 * Controller for wizard 'send fax' dialog form group 'recipient'.
	 */
	angular.module(moduleName).controller('procurementRfqFaxRecipientController', [
		'$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'procurementRfqFaxRecipientColumnDef', 'procurementRfqFaxRecipientService',
		function ($scope, $timeout, platformGridAPI, dialogGridControllerService, columnDef, dataService) {
			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: 'C3273D8B48C24579BBB619855F1C21BE',
				cellChangeCallBack: updateCellValue
			};

			$scope.gridData = [];

			dialogGridControllerService.initListController($scope, columnDef, dataService, {}, gridConfig);

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
				dataService.load();
			});

			/**
			 * unCheck 'CC' checkbox when email or fax recipient item first checkbox unchecked
			 */
			function updateCellValue(args) {
				var columns = platformGridAPI.columns.configuration($scope.gridId).visible;
				if (!_.isEmpty(columns) && columns[args.cell].field === 'IsTo') {
					var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;

					// if 'IsTo' unchecked, 'IsCc' should be unchecked.
					var selectedItem = dataView.getItem(args.row);
					if (!selectedItem.IsTo && selectedItem.IsCc) {
						selectedItem.IsCc = false;
						dataView.updateItem(selectedItem.Id, selectedItem);
					}
				}
			}
		}
	]);
})(angular);