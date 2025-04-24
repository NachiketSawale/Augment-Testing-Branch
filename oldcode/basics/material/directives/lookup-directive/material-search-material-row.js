/**
 * Created by lja on 2015/8/18.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialCommodityRow
	 * @element div
	 * @restrict A
	 * @description material item directive
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialMaterialRow',
		['_', '$timeout', 'accounting', '$translate', 'platformDomainList', '$templateCache', '$compile', '$q','moment','platformContextService','platformLanguageService', 'cloudDesktopSidebarInquiryService',
			function (_, $timeout, accounting, $translate, platformDomainList, $templateCache, $compile, $q, moment,platformContextService,platformLanguageService, cloudDesktopSidebarInquiryService) { // jshint ignore:line

				function getTranslated(info) {
					return _.isNil(info) ? '' : info.Translated;
				}

				function commodityRowController($scope, basicsLookupdataPopupService, basicsMaterialPriceListLookupColumns, basicsMaterialPriceListLookupDataService,materialAlternativeDialogService) {

					function formatNumber(number){
						var floatNumber = parseFloat(number);
						var decimalPlaces = 2;
						var pow = Math.pow(10, decimalPlaces);
						var result = (Math.round(floatNumber * pow) / pow);

						var culture = platformContextService.culture();
						var cultureInfo = platformLanguageService.getLanguageInfo(culture);
						return accounting.formatNumber(result, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
					}

					var priceListTitle = $translate.instant('basics.material.priceList.priceList');
					$scope.leadTimeTitle = $translate.instant('basics.material.materialSearchLookup.htmlTranslate.leadTimes');
					$scope.minQuantityTitle = $translate.instant('basics.material.materialSearchLookup.htmlTranslate.minQuantity');
					$scope.co2ProjectTitle = $translate.instant('basics.material.record.entityCo2Project');
					$scope.co2SourceTitle = $translate.instant('basics.material.record.entityCo2Source');
					$scope.co2SourceNameTitle = $translate.instant('basics.material.record.entityBasCo2SourceFk');

					//price format
					$scope.getPriceInfo = function(){
						var priceUnit = '1 ' + getTranslated($scope.entity.UomInfo);
						if(getTranslated($scope.entity.PriceUnitUomInfo)){
							priceUnit =  $scope.entity.PriceUnit + ' ' + getTranslated($scope.entity.PriceUnitUomInfo);
						}
						var price = formatNumber($scope.entity.Cost) + ' ' + $scope.entity.Currency;
						return priceUnit + ' = ' + price;
					};

					$scope.getEstimatePriceInfo = function(){
						/*return formatNumber($scope.entity.EstimatePrice) +' ' +$scope.entity.Currency;*/
						$scope.entity.PriceForShow = $scope.entity.PriceForShow || $scope.entity.Cost;

						return formatNumber($scope.entity.PriceForShow);
						//return formatNumber($scope.entity.EstimatePrice);
					};
					$scope.getListPriceInfo = function(){
						$scope.entity.PriceReferenceForShow = $scope.entity.PriceReferenceForShow || $scope.entity.EstimatePrice;
						return formatNumber($scope.entity.PriceReferenceForShow);
						//return formatNumber($scope.entity.ListPrice);
					};
					$scope.getCostInfo = function(){
						return formatNumber($scope.entity.ShowCost);
					};
					$scope.getSubTotalInfo = function(){
						return formatNumber($scope.entity.subTotal);
					};

					$scope.getDayworkRate = function(){
						return formatNumber($scope.entity.DayworkRate);
					};

					$scope.getUom = function(){
						if($scope.entity.PriceUnit === 1){
							return uomPriceUnit($scope);
						}
						return $scope.entity.PriceUnit + '  ' + uomPriceUnit($scope);
						function uomPriceUnit($scope){
							if(_.isNil(getTranslated($scope.entity.PriceUnitUomInfo))){
								return ' ';
							}
							return getTranslated($scope.entity.PriceUnitUomInfo);
						}
					};

					//materialName
					$scope.getMaterialDescription = function(){

						var desc = $scope.entity.Code;
						if (getTranslated($scope.entity.DescriptionInfo)) {
							desc += ' / ' + getTranslated($scope.entity.DescriptionInfo);
						}
						if (getTranslated($scope.entity.DescriptionInfo2)) {
							desc += ' / ' + getTranslated($scope.entity.DescriptionInfo2);
						}
						return desc;
					};

					$scope.getSupplierInfo = function(){
						var supplierInfo = '';
						if ($scope.entity.Supplier || $scope.entity.AddressLine) {
							supplierInfo = $translate.instant('basics.material.materialSearchLookup.htmlTranslate.supplier') + ':';
						}
						if ($scope.entity.Supplier) {
							supplierInfo += ' ' + $scope.entity.Supplier;
						}
						if ($scope.entity.AddressLine) {
							if ($scope.entity.Supplier) {
								supplierInfo += ' , ';
							}
							supplierInfo += $scope.entity.AddressLine;
						}
						return supplierInfo;
					};

					$scope.getDeliverDate=function() {
						var deliverDate = '';
						var currentDate = (new Date()).getTime();

						var leadTime = 0;
						if ($scope.entity.LeadTime) {
							leadTime = $scope.entity.LeadTime;
						}
						var LeadTimeExtra = 0;
						if ($scope.entity.LeadTimeExtra) {
							LeadTimeExtra = $scope.entity.LeadTimeExtra;
						}
						deliverDate = currentDate + (leadTime + LeadTimeExtra) * 24 * 60 * 60 * 1000;
						deliverDate = moment(deliverDate);
						if (deliverDate._isValid) {
							return deliverDate.format('DD/MM/YYYY');
						}
						else {
							return moment(currentDate).format('DD/MM/YYYY');
						}
					};

					$scope.getStandardDeliverDate=function(){
						var deliverDate='';
						var currentDate=(new Date()).getTime();
						var leadTime = 0;
						if ($scope.entity.LeadTime) {
							leadTime = $scope.entity.LeadTime;
						}
						deliverDate=currentDate+leadTime*24*60*60*1000;
						deliverDate=moment(deliverDate).format('DD/MM/YYYY');
						return deliverDate;
					};


					$scope.rowClick = function (entity) {

						if (angular.isFunction($scope.onSelectedChanged)) {
							$scope.onSelectedChanged(entity);
						}
					};

					$scope.rowDoubleClick = function (entity) {

						if (angular.isFunction($scope.onRowDoubleClick)) {
							$scope.onRowDoubleClick(entity);
						}
					};

					$scope.getLeadTimes = function(entity){
						//var days= parseFloat(entity.LeadTime).toUserLocaleNumberString();
						var leadtime=parseInt(entity.LeadTime);
						var days=_.isInteger(entity.LeadTime)?leadtime:(leadtime+1);
						return days||0;
						//return  $translate.instant('basics.material.materialSearchLookup.htmlTranslate.days', {days:days}) || '0 Days';
					};

					$scope.getMinQuantity = function(entity){
						//return parseFloat(entity.MinQuantity).toUserLocaleNumberString();
						var intMinQuantity=parseInt(entity.MinQuantity);
						return  _.isInteger(entity.MinQuantity)?intMinQuantity:entity.MinQuantity;
					};

					$scope.getMinQuantityUom = function(entity) {
						var UomInfo=entity.UomInfo;
						var uom='';
						if(UomInfo) {
							uom=UomInfo.Translated ? UomInfo.Translated : UomInfo.Description;
							if(uom.length>0){
								uom='('+uom+')';
							}
						}
						return uom;
					};

					var helper = basicsLookupdataPopupService.getToggleHelper();

					$scope.getPriceListTitle = function (entity) {
						if (_.isNil(entity) || _.isNil(entity.MaterialPriceListFk) || !$scope.$parent.options.searchService || entity.MaterialPriceListFk < 0) {
							return priceListTitle;
						}

						var categories = $scope.$parent.options.searchService.data.categories;

						if (_.isNil(categories ) || !categories.length) {
							return priceListTitle;
						}

						var category = _.find(categories, {Id: entity.MdcMaterialCatalogFk});
						var priceList = _.find(entity.PriceLists, {Id: entity.MaterialPriceListFk});
						if(!priceList){
							return priceListTitle;
						}
						var priceVersion = _.find(category.PriceVersions, {Id: priceList.MaterialPriceVersionFk});
						if(!priceVersion){
							return priceListTitle;
						}
						return priceVersion.DescriptionInfo.Translated;
					};

					$scope.toggleAlternativeList = function (event, entity) {
						var materialId = entity.Id;
						var alternativeList=entity.AlternativeList;
						var code=entity.Code;
						var description=entity.DescriptionInfo.Translated?entity.DescriptionInfo.Translated:entity.DescriptionInfo.Description;
						materialAlternativeDialogService.showDialog({code:code,description:description,requestId: materialId,alternativeList:alternativeList});
					};

					$scope.togglePriceList = function (event, entity) {
						var priceVersionButton = angular.element(event.currentTarget.parentElement);

						var options = basicsLookupdataPopupService.buildGridPopupOptions({
							scope: $scope,
							gridId: '0CE3F0CAB1164242AED14E5AAE47EA45',
							columns: basicsMaterialPriceListLookupColumns,
							focusedElement: priceVersionButton,
							relatedTarget: priceVersionButton,
							dataProvider: {
								getList: function () {
									return $q.when(basicsMaterialPriceListLookupDataService.processBaseItem(entity.PriceLists));
								}
							},
							afterDataRefreshed: function (scope, ctrl) {
								ctrl.selectRowById(entity.MaterialPriceListFk);
							}
						});

						var popup = helper.toggle(options);

						if (popup) { // open
							popup.result.then(function (result) {
								if (result && result.isOk && result.value !== entity.MaterialPriceListFk) {
									entity.MaterialPriceListFk = result.value.Id;
									basicsMaterialPriceListLookupDataService.setState(entity, result.value);
									basicsMaterialPriceListLookupDataService.overridePrice(entity, result.value);

									var inquiryItems = cloudDesktopSidebarInquiryService.getInquiryItems();
									if(inquiryItems !== undefined && inquiryItems !== null && inquiryItems.length > 0){
										var inquiruyItem = _.find(inquiryItems, {materialId: entity.Id});
										if(inquiruyItem) {
											inquiruyItem.materialPriceListFk = entity.MaterialPriceListFk;
										}
									}
								}
							});
						}
					};
				}

				return {
					restrict: 'A',
					replace: false,
					scope: {
						entity: '=',
						onPreview: '=',
						onGotoMaterial:'=',
						onSelectedChanged: '=',
						onRowDoubleClick: '=',
						buttonPanel: '=',
						externalScope: '=',
						showHtmlSpec: '=',
						isPreview:'='
					},
					controller: ['$scope', 'basicsLookupdataPopupService', 'basicsMaterialPriceListLookupColumns', 'basicsMaterialPriceListLookupDataService','materialAlternativeDialogService', commodityRowController],
					link: function ($scope, element) {

						var getTemplate = function (key) {
							var template = $templateCache.get(key + '.html');
							if (!template) {
								throw new Error('Template ' + key + ' not found');
							}
							return template;
						};

						var content = getTemplate('materialRow').replace(/\$buttonsPanel\$/, $scope.buttonPanel || '');

						var specification = '';
						//change the html spec as plain text in the list view
						//the specification height control is in css
						if (getTranslated($scope.entity.SpecificationInfo) || $scope.entity.BasBlobsSpecificationFk) {
							if ($scope.showHtmlSpec === true && $scope.entity.BasBlobsSpecificationFk && $scope.entity.BlobSpecification) {
								//if there not have rich text ,show plain text
								specification = $scope.entity.BlobSpecification.Content || getTranslated($scope.entity.SpecificationInfo) || '';
							} else {
								//todo:lta remove regExp to show plain text
								// eslint-disable-next-line no-useless-escape
								specification = getTranslated($scope.entity.SpecificationInfo) ? getTranslated($scope.entity.SpecificationInfo).replace(/<\/?([a-zA-Z])([^>\/]*)\/?>/gi, ' ') : '';
							}
						}
						content = content.replace(/\$specification\$/, _.escape(specification));

						element.append($compile(content)($scope));

					}
				};
			}]);

})(angular);