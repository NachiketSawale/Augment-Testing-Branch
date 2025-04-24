(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,$ */


	/**
	 * @ngdoc controller
	 * @name procurementTicketsystemCartController
	 * @require $scope
	 * @description controller for ticket system
	 */
	/* jshint -W072 */
	angular.module('procurement.ticketsystem').controller('procurementTicketsystemCartController',
		['$scope', 'procurementTicketsystemCartDataService', 'procurementTicketsystemSearchDataService',
			'platformModalService', '$translate', '$templateCache', 'platformDomainList', 'materialDocumentPreviewConfigService',
			'$rootScope', '$timeout', 'moment', 'platformToolbarService', 'procurementTicketSystemDocumentService',
			'basicsLookupdataLookupFilterService',
			'procurementContextService',
			function ($scope, cartDataService, searchService, platformModalService,
				$translate, $templateCache, platformDomainList, materialDocumentPreviewConfigService, $rootScope, $timeout, moment, platformToolbarService,
				procurementTicketSystemDocumentService,
				basicsLookupdataLookupFilterService,
				procurementContextService) {

				// commodity row config
				$scope.cartService = cartDataService;
				var defaultCollapsed = initBarBtnStatus();

				function initBarBtnStatus() {
					var items = $scope.cartService.catalogs;
					var _find = _.filter(items, {collapsed: false});
					// noinspection RedundantIfStatementJS
					if (0 === _find.length) {
						return true;
					} else {
						return false;
					}
				}

				function doCatalog(flg) {
					var items = $scope.cartService.catalogs;
					_.forEach(items, function (item) {
						item.collapsed = flg;
					});
					$scope.cartService.catalogs = items;
				}

				var containeruuid = $scope.getContainerUUID();
				platformToolbarService.removeTools(containeruuid);
				var iconClass = defaultCollapsed ? 'ico-down' : 'ico-up';
				var toolbarItems = [{
					id: 't1',
					type: 'item',
					iconClass: 'control-icons ' + iconClass,
					fn: function (obj, _item) {
						var collapsedFlg = !defaultCollapsed;
						var currentClass = collapsedFlg ? 'ico-down' : 'ico-up';
						_item.iconClass = 'control-icons ' + currentClass;
						doCatalog(collapsedFlg);
						defaultCollapsed = collapsedFlg;
					}
				}];

				if (!$scope.isPreview) {
					$scope.setTools({
						showImages: true,
						showTitles: false,
						cssClass: 'cartTools',
						items: toolbarItems
					});
				}

				$scope.$watch('isPreview', function (newValue/* ,oldValue */) {
					if (newValue) {
						$('.toolbar').find('.cartTools').hide();
					} else {
						$('.toolbar').find('.cartTools').show();
					}
				});

				// initialize domain-control for Procurement type.
				/*
				 - common options: Requisition(defualt) and Contract,
				 - if isFrameworkType === true --> only Contract is available,
				 - if businessPartnerFk empty -> only Requisition can be chosen
				*/
				$scope.getPrcTypeOptions = function (item) {

					/*
						it does not work with one option for procurementtype-select-box. Has effects on all items.
						Therefore: set a new key 'prcTypeSelectOption' in catalogs-items. The options for select-box will be taken from 'prcTypeSelectOption'
					 */
					if (!item.prcTypeSelectOption) {
						item.prcTypeSelectOption = {
							displayMember: 'Description',
							valueMember: 'Id',
							items: []
						};
					}

					var prcItems = [];
					var requisition = {Id: 2, Description: $translate.instant('procurement.ticketsystem.buttonText.requisition')};
					var contract = {Id: 1, Description: $translate.instant('procurement.ticketsystem.buttonText.contract')};

					// drop logic above, requirement from Erik

					prcItems.push(requisition, contract);

					item.prcTypeSelectOption.items = prcItems;

					return item.prcTypeSelectOption;
				};

				$scope.changeProcurementType = function (item) {
					$scope.getPrcTypeOptions(item);
				};

				$scope.changePrcType = function (item) {
					// contract
					if (item.prcType === 1) {
						item.configurationFk = $scope.cartService.defaultConfigurationForCon;
					}
					// req
					else if (item.prcType === 2) {
						item.configurationFk = $scope.cartService.defaultConfigurationForReq;
					}
				};

				/*
					handle accordion icons for the toggle
				 */
				$timeout(function () {
					angular.element('.panel').on('hidden.bs.collapse', toggleIcon);
					angular.element('.panel').on('shown.bs.collapse', toggleIcon);
				}, 0);

				function toggleIcon(e) {
					$(e.target)
						.prev('.panel-heading')
						.find('.block-image')
						.toggleClass('ico-up ico-down');
				}

				// get a correct format from date for the domain-control-datetime
				$scope.getFormatedDate = function (_date) {
					return moment.utc(_date);
				};
				// save common toggle status
				$scope.toggleOpen = function (item) {
					var currentClass;
					item.collapsed = !item.collapsed;
					var items = $scope.cartService.catalogs;
					var _find = _.filter(items, {collapsed: true});
					if (items.length === _find.length || 0 === _find.length) {
						var _item = _.find(platformToolbarService.getTools(containeruuid), function (item1) {
							return item1 && item1.id === 't1';
						});
						defaultCollapsed = item.collapsed;
						if (items.length === _find.length) {
							currentClass = 'ico-down';
							_item.iconClass = 'control-icons ' + currentClass;
							$('.toolbar').find('.collapsable button').removeClass('ico-up').addClass('ico-down');
						} else if (0 === _find.length) {
							currentClass = 'ico-up';
							_item.iconClass = 'control-icons ' + currentClass;
							$('.toolbar').find('.collapsable button').removeClass('ico-down').addClass('ico-up');
						}
					}
				};

				// set Businesspartner-button, if material catalog type is framework type
				$scope.getLookupOptions = function (frameworktype) {
					// noinspection RedundantConditionalExpressionJS
					return {
						disabled: frameworktype ? true : false
					};
				};

				var getTemplate = function (key) {
					var template = $templateCache.get(key + '.html');
					if (!template) {
						throw new Error('Template ' + key + ' not found');
					}
					return template;
				};

				$scope.rowButtonPanelHtml = getTemplate('cartRowButtons');

				$scope.isPreview = false;

				// quantity reg
				$scope.quantityReg = platformDomainList.quantity.regex;

				$scope.htmlTranslate = {
					back: $translate.instant('procurement.ticketsystem.htmlTranslate.back'),
					attributes: $translate.instant('procurement.ticketsystem.htmlTranslate.attributes'),
					documents: $translate.instant('procurement.ticketsystem.htmlTranslate.documents'),
					information: $translate.instant('procurement.ticketsystem.htmlTranslate.information'),
					empty: $translate.instant('procurement.ticketsystem.htmlTranslate.empty'),
					merge: $translate.instant('procurement.ticketsystem.htmlTranslate.merge'),
					total: $translate.instant('procurement.ticketsystem.htmlTranslate.total'),
					items: $translate.instant('procurement.ticketsystem.htmlTranslate.items'),
					costPrice: $translate.instant('procurement.ticketsystem.htmlTranslate.costPrice'),
					uomPrice: $translate.instant('procurement.ticketsystem.htmlTranslate.uomPrice'),
					quantity: $translate.instant('procurement.ticketsystem.htmlTranslate.quantity'),
					deliveryOption: $translate.instant('procurement.ticketsystem.htmlTranslate.deliveryOption'),
					standardDeliveryDate: $translate.instant('procurement.ticketsystem.htmlTranslate.standardDeliveryDate'),
					deliveryDate: $translate.instant('procurement.ticketsystem.htmlTranslate.deliveryDate'),
					subTotal: $translate.instant('procurement.ticketsystem.htmlTranslate.subTotal'),
					vendor: $translate.instant('procurement.ticketsystem.htmlTranslate.vendor'),
					requiredDate: $translate.instant('procurement.ticketsystem.htmlTranslate.requiredDate'),
					submitButton: $translate.instant('procurement.ticketsystem.htmlTranslate.submitButton'),
					prcTypeLabel: $translate.instant('procurement.ticketsystem.htmlTranslate.procurementType'),
					configuration: $translate.instant('procurement.ticketsystem.htmlTranslate.configuration')
				};

				cartDataService.initialCart();

				$scope.onDelivery = function (entity, priceCondition) {
					priceCondition.IsActivated = !priceCondition.IsActivated;
					cartDataService.materialPriceCondition(entity);
					// cartDataService.deliveryChange(priceCondition);
					cartDataService.refreshSummary();
				};

				$scope.getDescription = function (priceCondition) {
					var description = '';
					description = priceCondition.Description ? priceCondition.Description : (priceCondition.PriceConditionType.DescriptionInfo.DescriptionTr ? priceCondition.PriceConditionType.DescriptionInfo.Translated : priceCondition.PriceConditionType.DescriptionInfo.Description);
					return description;
				};

				$scope.onPreview = function (item) {
					$scope.isPreview = true;
					$scope.previewItem = item;
					// noinspection RedundantConditionalExpressionJS
					// $scope.mdc3dShow = null != item.Uuid ? true : false;
					$scope.mdc3dShow = !_.isNil(item.Uuid);

					$scope.onDocumentPreview = function (documentId, index) {
						materialDocumentPreviewConfigService.onDocumentPreview($scope, documentId, index);
					};

					searchService.getDocumentsById(item).then(function (documents) {

						$scope.previewDocuments = documents.Main;

						$scope.previewDocumentTypes = documents.DocumentType;

					});

					searchService.getAttributesByMaterialId(item.Id).then(
						function (attributs) {
							$scope.previewAttributes = attributs;
						}
					);

					if (_.isNil(item.Uuid)) {
						return;
					}

					$timeout(function () {
						if (!_.isNil(item.InternetCatalogFk)) {
							searchService.getInternetCatalogUrl(item.InternetCatalogFk).then(function (response) {
								$rootScope.$emit('selectedScsFileChanged', {
									url: response.data.BaseUrl + '/model/main/scs/getscsfile?docID=' + item.Uuid
								});
							});
						} else {
							$rootScope.$emit('selectedScsFileChanged', {
								uuid: item.Uuid
							});
						}
					});

				};

				$scope.previewBackClick = function () {
					$scope.isPreview = false;
					// $scope.isDeliveryShow=true;
				};

				$scope.editDocs = function (group) {
					procurementTicketSystemDocumentService.showDialog(group);
				};

				$scope.configurationOptions = {
					filterKey: 'prc-ticketsystem-configuration-filter'
				};

				var filters = [{
					key: 'prc-ticketsystem-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						return entity.prcType === 1 ? 'RubricFk = ' + procurementContextService.contractRubricFk : 'RubricFk = ' + procurementContextService.requisitionRubricFk;
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});
			}]);
})(angular);
