/**
 * Created by reimer on 05.02.2018
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainImportOptionsService', ['_', '$q', '$http', '$translate', 'basicsImportHeaderService',
		function (_, $q, $http, $translate, basicsImportHeaderService) {
			var service = {};

			var _boqMainService;

			var setRibExcelMappingNames = function (fields) {
				angular.forEach(fields, function (field) {
					if (Object.prototype.hasOwnProperty.call(field, 'ribFormatMappingName')) {
						field.MappingName = field.ribFormatMappingName;
					} else {
						field.MappingName = '';
					}
				});
			};

			var importOptions = {
				ModuleName: moduleName,
				DoubletFindMethodsPage: {
					skip: true     // search by reference is now hard-coded, search by Id is not required
				},
				FieldMappingsPage: {
					skip: false
				},
				EditImportPage: {
					skip: false
				},
				PreviewResultPage: {
					skip: false
				},
				ImportDescriptor: {
					DoubletFindMethods: [
						{
							Selected: false,
							Description: $translate.instant('boq.main.DoubletFindMethod0')
						},   // Id + ParentId
						{
							Selected: true,
							Description: $translate.instant('boq.main.DoubletFindMethod1'),
						}   // ReferenceNo
					],
					FieldProcessor: function (parentScope, oldProfile) {
						if (angular.isUndefined(oldProfile.ProfileAccessLevel)) {
							var excelHeaders = [];
							_.forEach(basicsImportHeaderService.getList(), function (header) {
								excelHeaders[header.description.toLowerCase()] = header.description;
							});

							_.forEach(parentScope.entity.ImportDescriptor.Fields, function (item) {
								if (item.PropertyName === 'UnitRate') {
									item.MappingName = excelHeaders[Object.keys(excelHeaders).filter(key => key.startsWith('unit rate (') && key.endsWith(')'))];
								}
								if (item.PropertyName === 'Discount') {
									item.MappingName = excelHeaders[Object.keys(excelHeaders).filter(key => key.startsWith('discount abs it (') && key.endsWith(')'))];
								}
							});
						}
					},
					Fields: [
						{
							PropertyName: 'Id',
							EntityName: 'BoqItem',
							DomainName: 'code',
							// Editor: 'domain'
							readonly: true,
							ribFormatMappingName: 'Id'    // mapping for RibExcelImport format
						},
						{
							PropertyName: 'ParentId',
							EntityName: 'BoqItem',
							DomainName: 'code',
							readonly: true,
							ribFormatMappingName: 'ParentId'
						},
						{
							PropertyName: 'ReferenceNo',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'Reference2',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'BoQLineType',
							EntityName: 'BoqItem',
							DomainName: 'integer',
							Editor: 'simplelookup',
							LookupQualifier: 'boq.main.linetype',
							ribFormatMappingName: 'Line Type'
						},
						{
							PropertyName: 'OutlineSpecification',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'Outline Spec'
						},
						{
							PropertyName: 'IsFreeQuantity',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'Free Quantity',
						},
						{
							PropertyName: 'Quantity',
							EntityName: 'BoqItem',
							DomainName: 'quantity',
							Editor: 'domain',
							ribFormatMappingName: 'Quantity'
						},
						{
							PropertyName: 'QuantityAdj',
							EntityName: 'BoqItem',
							DomainName: 'quantity',
							Editor: 'domain',
							ribFormatMappingName: 'Quantity'
						},
						{
							PropertyName: 'UoM',
							EntityName: 'BoqItem',
							DomainName: 'integer',
							Editor: 'simplelookup',
							LookupQualifier: 'basics.uom',
							ribFormatMappingName: 'UoM',
							DisplayMember: 'UOM'
						},
						{
							PropertyName: 'ItemTypeStandOpt',
							EntityName: 'BoqItem',
							DomainName: 'integer',
							Editor: 'simplelookup',
							LookupQualifier: 'basics.itemtype',
							DefaultValue: 0,
							ribFormatMappingName: 'Item Type Stand/Opt'
						},
						{
							PropertyName: 'ItemTypeBaseAlt',
							EntityName: 'BoqItem',
							DomainName: 'integer',
							Editor: 'simplelookup',
							LookupQualifier: 'basics.itemtype',
							ribFormatMappingName: 'Item Type Base/Alt'
						},
						{
							PropertyName: 'Factor',
							EntityName: 'BoqItem',
							DomainName: 'factor',
							Editor: 'domain'
						},
						{
							PropertyName: 'UnitRate',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'Unit Rate'
						},
						{
							PropertyName: 'IsUrb',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'URB',
						},
						{
							PropertyName: 'Urb1',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB1'
						},
						{
							PropertyName: 'Urb2',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB2'
						},
						{
							PropertyName: 'Urb3',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB3'
						},
						{
							PropertyName: 'Urb4',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB4'
						},
						{
							PropertyName: 'Urb5',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB5'
						},
						{
							PropertyName: 'Urb6',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain',
							ribFormatMappingName: 'URB6'
						},
						{
							PropertyName: 'ReferenceH1',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'H1',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceH2',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'H2',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceH3',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'H3',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceH4',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'H4',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceH5',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'H5',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceItem',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'Item',
							Only4RibFormat: true
						}, {
							PropertyName: 'ReferenceIx',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'Ix',
							Only4RibFormat: true
						}, {
							PropertyName: 'CommentContractor',
							EntityName: 'BoqItem',
							DomainName: 'remark',
							Editor: 'domain',
							ribFormatMappingName: 'Contractor Comment'
						}, {
							PropertyName: 'CommentClient',
							EntityName: 'BoqItem',
							DomainName: 'remark',
							Editor: 'domain',
							ribFormatMappingName: 'Planner Comment'
						},
						{
							PropertyName: 'Userdefined1',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'User-Defined 1'
						},
						{
							PropertyName: 'Userdefined2',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'User-Defined 2'
						},
						{
							PropertyName: 'Userdefined3',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'User-Defined 3'
						},
						{
							PropertyName: 'Userdefined4',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'User-Defined 4'
						},
						{
							PropertyName: 'Userdefined5',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'User-Defined 5'
						},
						{
							PropertyName: 'ExternalCode',
							EntityName: 'BoqItem',
							DomainName: 'code',
							Editor: 'domain',
							ribFormatMappingName: 'External Code'
						},
						{
							PropertyName: 'DeliveryDate',
							EntityName: 'BoqItem',
							DomainName: 'date',
							Editor: 'domain',
							ribFormatMappingName: 'Delivery Date'
						},
						{
							PropertyName: 'Material',
							EntityName: 'BoqItem',
							DomainName: 'integer',
							Editor: 'domain',
							ribFormatMappingName: 'Material'
						},
						{
							PropertyName: 'ProjectCharacteristic',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'Project Characteristic'
						},
						{
							PropertyName: 'WorkContent',
							EntityName: 'BoqItem',
							DomainName: 'description',
							Editor: 'domain',
							ribFormatMappingName: 'Work Content'
						},
						{
							PropertyName: 'DiscountPercent',
							EntityName: 'BoqItem',
							DomainName: 'percent',
							Editor: 'domain'
						},
						{
							PropertyName: 'DiscountPercentIt',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain'
						},
						{
							PropertyName: 'Discount',
							EntityName: 'BoqItem',
							DomainName: 'money',
							Editor: 'domain'
						}
					]
				},
				GetSelectedMainEntityCallback: function () {
					var boqItem = _boqMainService.getRootBoqItem();
					if (boqItem) {
						return boqItem.BoqHeaderFk;
					} else {
						return null;
					}
				},
				IsEmptyCallBack: function () {
					return _boqMainService.getList().length === 1;
				},
				OnImportSucceededCallback: function () {
					_boqMainService.refreshBoqData(true);
				},
				OnImportFormatChangedCallback: function (newFormat, importOptions) {
					if ([4,5,7].includes(newFormat)) {  // RibExcel  todo: use constants (Planner, Bidder, PES)
						// --> todo: move back to here (done in controller since screen must be updated)
						// importOptions.DoubletFindMethodsPage.skip = true;
						// importOptions.FieldMappingsPage.skip = true;
						// importOptions.EditImportPage.skip = true;
						// importOptions.PreviewResultPage.skip = true;
						// importOptions.ImportDescriptor.DoubletFindMethods[1].Selected = true;
						setRibExcelMappingNames(importOptions.ImportDescriptor.Fields);
					}
				},
				PreventNextStepAsync: function (currentStep, importFormat) {
					if (currentStep === 'fileselection' && importFormat === 3) {
						return $http.get(globals.webApiBaseUrl + 'boq/main/type/' + 'isorcanbefreeboqstructure?boqHeaderId=' + _boqMainService.getRootBoqItem().BoqHeaderFk)
							.then(function (response) {
								return response.data;
							});
					} else {
						return $q.when().then(function () {
							return null;
						});
					}
				},
				ShowProtocollAfterImport: true,
			};

			service.getImportOptions = function (boqMainService) {
				_boqMainService = boqMainService;

				importOptions.ExcelProfileContexts = [];
				if (boqMainService.getServiceName().includes('Pes')) {
					importOptions.ExcelProfileContexts.push('BoqPes');
				} else {
					importOptions.ExcelProfileContexts.push('BoqBidder');
					importOptions.ExcelProfileContexts.push('BoqPlanner');
				}

				return importOptions;
			};

			service.setRibExcelMappingNames = setRibExcelMappingNames;

			return service;
		}
	]);
})(angular);
