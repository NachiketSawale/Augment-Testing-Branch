(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('boqMainGaebExportController', ['$scope',
		'$timeout',
		'$injector',
		'platformTranslateService',
		'platformDialogService',
		'basicsLookupdataLookupFilterService',
		'boqMainGaebHelperService',
		'boqMainGaebExportService',
		'platformRuntimeDataService',
		'boqMainLineTypes',
		function ($scope, $timeout, $injector, platformTranslateService, platformDialogService, basicsLookupdataLookupFilterService, boqMainGaebHelperService, boqMainGaebExportService, platformRuntimeDataService, boqMainLineTypes) {

			var _options = $scope.$parent.modalOptions.options;

			// default value
			$scope.entity = {
				gaebFormatId: boqMainGaebHelperService.getGaebFormatId(_options.wizardParameter.DefaultGaebExtension || '.x83'),
				gaebTypeId: boqMainGaebHelperService.getGaebTypeId(_options.wizardParameter.DefaultGaebExtension || '.x83'),
				selectedVersion : null,
				gaebtype: null,
				selectionType: boqMainGaebHelperService.getSelectionTypeId('Complete_BoQ_Document'),
				specification : false,
				quantityAdj : false,
				price: false,
				isUrb: false,
				from: null,
				to : null,
				fromBoqItemLineType : null,
				toBoqItemLineType: null
			};

			$scope.path = globals.appBaseUrl;
			var formConfig =
			{
				showGrouping: true,
				groups: [
					{
						gid: '1',
						header: 'Format',
						header$tr$: 'boq.main.Format',
						isOpen: true,
						visible: true,
						sortOrder: 1
					},
					{
						gid: '2',
						header: 'Selection',
						header$tr$: 'boq.main.Selection',
						isOpen: true,
						visible: true,
						sortOrder: 2
					},
					{
						gid: '3',
						header: 'Settings',
						header$tr$: 'boq.main.Settings',
						isOpen: true,
						visible: true,
						sortOrder: 3
					}
				],
				rows: [
					{
						gid: '1',
						rid: 'GaebType',
						label$tr$: 'boq.main.Gaebtype',
						type: 'directive',
						model: 'gaebTypeId',
						directive: 'boq-main-gaeb-export-type-combobox',
						options: {
							filterKey: 'boqMainGaebAllowedType',
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										$scope.entity.gaebtype = args.selectedItem.phase;
										if($scope.entity.selectedVersion && $scope.entity.gaebtype){
											onSelectionFormatChanged($scope.entity.gaebtype , $scope.entity.selectedVersion);
										}else{
											let selectedVersion = boqMainGaebHelperService.getVersionByGaebFormatId($scope.entity.gaebFormatId);
											onSelectionFormatChanged($scope.entity.gaebtype , selectedVersion);
										}
									}
								}
							]

						}
					},
					{
						gid: '1',
						rid: 'GaebFormat',
						label$tr$: 'boq.main.GaebFormat',
						type: 'directive',
						model: 'gaebFormatId',
						directive: 'boq-main-gaeb-export-format-combobox',
						options: {
							filterKey: 'boqMainGaebAllowedFormat',
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										$scope.entity.selectedVersion = args.selectedItem.name;
										if($scope.entity.selectedVersion && $scope.entity.gaebtype){
											onSelectionFormatChanged($scope.entity.gaebtype , $scope.entity.selectedVersion);
										}else{
											let selectedType = boqMainGaebHelperService.getFormatByGaebTypeId($scope.entity.gaebTypeId);
											onSelectionFormatChanged(selectedType, $scope.entity.selectedVersion);
										}
									}
								}
							]
						}
					},
					{
						gid: '2',
						rid: 'SelectionType',
						label$tr$: 'boq.main.SelectionType  ',
						type: 'directive',
						model: 'selectionType',
						directive: 'boq-main-gaeb-export-selection-type-combobox',
						options: {
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										let selectedItem = args.selectedItem;
										$scope.entity.selectionType = selectedItem.name;
										if($scope.entity.selectionType === 'BoQ_Area'){
											setReadOnly('from',false);
											setReadOnly('to',false);
										} else if($scope.entity.selectionType === 'Complete_BoQ_Document') {
											$scope.entity.from = null;
											$scope.entity.to = null;
											$scope.entity.fromBoqItemLineType = null;
											$scope.entity.toBoqItemLineType = null;
											setReadOnly('from', true);
											setReadOnly('to',true);
										}
									}
								}
							]
						}
					},
					{
						gid: '2',
						rid: 'from',
						label$tr$: 'boq.main.From',
						type: 'directive',
						model: 'from',
						directive: 'basics-lookup-data-by-custom-data-service',
						'options': {
							'dataServiceName': 'boqItemLookupDataService',
							'valueMember': 'Id',
							'displayMember': 'Reference',
							'disableDataCaching': false,
							'filter': function () {
								return _options.boqMainService.getSelectedHeaderFk()
							},
							'isClientSearch': true,
							'lookupModuleQualifier': 'boqItemLookupDataService',
							'columns': [
								{
									'id': 'Brief',
									'field': 'BriefInfo.Description',
									'name': 'Brief',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityBrief'
								},
								{
									'id': 'Reference',
									'field': 'Reference',
									'name': 'Reference',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityReference'
								}
							],
							'treeOptions': {
								'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
							},
							'lookupType': 'boqItemLookupDataService',
							'showClearButton': true,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										if (args.selectedItem) {
											$scope.entity.fromBoqItemLineType = args.selectedItem.BoqLineTypeFk;
										}
									}
								}
							]
						}
					},
					{
						gid: '2',
						rid: 'to',
						label$tr$: 'boq.main.To',
						type: 'directive',
						model: 'to',
						directive: 'basics-lookup-data-by-custom-data-service',
						'options': {
							'dataServiceName': 'boqItemLookupDataService',
							'valueMember': 'Id',
							'displayMember': 'Reference',
							'filter': function () {
								return _options.boqMainService.getSelectedHeaderFk()
							},
							'lookupType': 'boqItemLookupDataService',
							'disableDataCaching': false,
							'showClearButton': true,
							'isClientSearch': true,
							'lookupModuleQualifier': 'boqItemLookupDataService',
							'columns': [
								{
									'id': 'Brief',
									'field': 'BriefInfo.Description',
									'name': 'Brief',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityBrief'
								},
								{
									'id': 'Reference',
									'field': 'Reference',
									'name': 'Reference',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityReference'
								}
							],
							'treeOptions': {
								'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										if (args.selectedItem) {
											$scope.entity.toBoqItemLineType = args.selectedItem.BoqLineTypeFk;
										}
									}
								}
							]
						}
					},
					{
						gid: '3',
						rid: 'specification',
						label$tr$: 'boq.main.Specification',
						type: 'boolean',
						model: 'specification',
						sortOrder: 1
					},
					{
						gid: '3',
						rid: 'AQ-Quantity',
						label$tr$: 'boq.main.QuantityAdj',
						type: 'boolean',
						model: 'quantityAdj',
						sortOrder: 2
					},
					{
						gid: '3',
						rid: 'price',
						label$tr$: 'boq.main.Prices',
						type: 'boolean',
						model: 'price',
						sortOrder: 3,
					},
					{
						gid: '3',
						rid: 'isUrb',
						label$tr$: 'boq.main.UrBreakdown',
						type: 'boolean',
						model: 'isUrb',
						sortOrder: 4,
					}
				]
			};

			// object holding translated strings
			// $scope.translate = {};

			$scope.formOptions = {
				configure: formConfig
				// validationMethod:
			};

			$scope.canExecuteOkButton = function () {
				return true;
			};

			$scope.okClicked = function () {
				if ($scope.entity.gaebFormatId === 0) {
					let boqStructure = _options.boqMainService.getBoqStructure();
					if (boqStructure.Boqmask.length === 0 || boqStructure.Boqmask.length > 9) {
						platformDialogService.showInfoBox('boq.main.gaeb90ExportInfo');
						return;
					}
				}

				if($scope.entity.selectionType === 1 && !$scope.entity.from && !$scope.entity.to)
				{
					platformDialogService.showInfoBox('boq.main.fromToNotNullError');
					return;
				}
				if ($scope.entity.selectionType === 1 && $scope.entity.fromBoqItemLineType !== boqMainLineTypes.root && !($scope.entity.fromBoqItemLineType >= boqMainLineTypes.level1 && $scope.entity.fromBoqItemLineType <= boqMainLineTypes.level9))
				{
					platformDialogService.showInfoBox('boq.main.rootAndDivisionAllowedInFrom');
					return;
				}
				if ($scope.entity.selectionType === 1 && $scope.entity.toBoqItemLineType !== boqMainLineTypes.root && !($scope.entity.toBoqItemLineType >= boqMainLineTypes.level1 && $scope.entity.toBoqItemLineType <= boqMainLineTypes.level9))
				{
					platformDialogService.showInfoBox('boq.main.rootAndDivisionAllowedInTo');
					return;
				}

				_options.selectedExt = boqMainGaebHelperService.getGaebExt($scope.entity.gaebFormatId, $scope.entity.gaebTypeId);
				_options.selectionType = $scope.entity.selectionType;
				_options.specification = $scope.entity.specification;
				_options.quantityAdj = $scope.entity.quantityAdj;
				_options.price = $scope.entity.price;
				_options.isUrb = $scope.entity.isUrb;
				if($scope.entity.selectionType === 1) {
					_options.from = $scope.entity.from;
					_options.to = $scope.entity.to;
				}
				exportBoq();
			};

			function exportBoq() {
				boqMainGaebExportService.doExport(_options).then(function () {
					$timeout(function () {
						$scope.close(true);
					}, 0);
				});
			}

			$scope.initialize = function initialize() {
				if($scope.entity.gaebFormatId === 2 && $scope.entity.gaebTypeId === 2 && $scope.entity.selectionType === 0){
					$scope.entity.specification = true;
					$scope.entity.quantityAdj = false;
					$scope.entity.isUrb = true;
					$scope.entity.price = false;
					setReadOnly('quantityAdj',true);
					setReadOnly('price',true);
					setReadOnly('from', true);
					setReadOnly('to',true);
				}
			};

			$scope.initialize();

			function onSelectionFormatChanged(format, selectedVersion) {
				if(format && selectedVersion){
					switch (format) {
						case '81':
							setReadOnly('selectionType',false);
							switch (selectedVersion) {
								case 'GAEB_90':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = false;
									$scope.entity.isUrb = false;
									$scope.entity.price = false;
									setReadOnly('quantityAdj',true);
									setReadOnly('price',false);
									break;
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = true;
									$scope.entity.isUrb = false;
									$scope.entity.price = false;
									setReadOnly('quantityAdj',false);
									setReadOnly('price',false);
									break;
							}
							break;
						case '82':
							setReadOnly('selectionType',false);
							switch (selectedVersion) {
								case 'GAEB_90':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = false;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									setReadOnly('quantityAdj',true);
									setReadOnly('price',true);
									break;
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = true;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									setReadOnly('quantityAdj',false);
									setReadOnly('price',true);
									break;
							}
							break;
						case '83':
							setReadOnly('selectionType',false);
							switch (selectedVersion) {
								case 'GAEB_90':
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = false;
									$scope.entity.isUrb = true;
									$scope.entity.price = false;
									setReadOnly('quantityAdj',true);
									setReadOnly('price',true);
									break;
							}
							break;
						case '84':
							setReadOnly('selectionType',true);
							$scope.entity.from = null;
							$scope.entity.to = null;
							$scope.entity.selectionType = 0;
							setReadOnly('from',true);
							setReadOnly('to',true);

							switch (selectedVersion) {
								case 'GAEB_90':
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = false;
									$scope.entity.quantityAdj = false;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									setReadOnly('specification',true);
									setReadOnly('quantityAdj',true);
									setReadOnly('price',true);
									break;
							}
							break;
						case '85':
							setReadOnly('selectionType',false);
							switch (selectedVersion) {
								case 'GAEB_90':
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = true;
									$scope.entity.quantityAdj = false;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									setReadOnly('quantityAdj',true);
									setReadOnly('price',true);
									break;
							}
							break;
						case '86':
							setReadOnly('selectionType',false);
							switch (selectedVersion) {
								case 'GAEB_90':
									$scope.entity.specification = true;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									$scope.entity.quantityAdj = false;
									setReadOnly('quantityAdj',true);
									setReadOnly('price',true);
									break;
								case 'GAEB_2000':
								case 'GAEB_XML':
									$scope.entity.specification = true;
									$scope.entity.price = true;
									$scope.entity.isUrb = true;
									$scope.entity.quantityAdj = false;
									setReadOnly('quantityAdj',false);
									setReadOnly('price',true);
									break;
							}
							break;
					}
				}else{
					console.log('Select format & version');
				}
			}

			function setReadOnly(field , readOnly) {
				let fields = [];
				fields.push({field: field, readonly: readOnly});
				platformRuntimeDataService.readonly($scope.entity, fields);
			}

			$scope.close = function(success) {
				$scope.$parent.$close(success || false);
			};

			$scope.isBusy = false;
			$scope.busyInfo = '';

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}
			boqMainGaebExportService.busyStatusChanged.register(busyStatusChanged);

			var init = function() {
				platformTranslateService.translateFormConfig(formConfig);
			};
			init();

			var allowedExt = boqMainGaebHelperService.getAllowedGaebExt(_options.wizardParameter);

			var filters = [
				{
					key: 'boqMainGaebAllowedFormat',
					serverSide: false,
					fn: function (item) {
						if (allowedExt.findIndex(function(ext) { return ext.toLowerCase().startsWith(item.pattern); }) === -1) {
							return false;
						}
						else {
							return true;
						}
					}
				},
				{
					key: 'boqMainGaebAllowedType',
					serverSide: false,
					fn: function (item) {
						if (allowedExt.findIndex(function(ext) { return ext.toLowerCase().endsWith(item.phase); }) === -1) {
							return false;
						}
						else {
							return true;
						}
					}
				}

			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}
	]);
})();
