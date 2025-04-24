(function () {
	/* global globals, _ */
	'use strict';
	const boqMainModule = angular.module('boq.main');

	// Helper function to replace comma by dot in Approach string
	function replaceCommaByDotInApproach(approachString) {
		if(approachString && typeof approachString === 'string') {
			return approachString.replace(/[,]/gi, '.');
		}

		return '';
	}

	boqMainModule.factory('boqMainSubpriceControllerService', ['platformGridControllerService', 'boqMainSubPriceDataService', 'boqMainSubPriceUiService', 'boqMainSubPriceValidationService',
		'platformGridAPI', 'boqMainNodeControllerService', '$translate',
		function(platformGridControllerService, boqMainSubPriceDataService, boqMainSubPriceUiService, boqMainSubPriceValidationService
			, platformGridAPI, boqMainNodeControllerService, $translate) {
			return {
				getInstance: function(scope, boqMainService) {
					let dataService = boqMainSubPriceDataService.getInstance(scope, boqMainService);
					let validationService = boqMainSubPriceValidationService.getInstance(dataService);
					let gridConfig = {
						cellChangeCallBack: function (arg) {
							dataService.propertyChanged(arg.item, arg.grid.getColumns()[arg.cell].field);
						}
					};
					platformGridControllerService.initListController(scope, boqMainSubPriceUiService, dataService, validationService, gridConfig);

					for (let i = 0; i < scope.tools.items.length; i++) {
						//Here id of Copy/Paste clipboard button is 't199'.
						if (scope.tools.items[i].id === 't199') {
							scope.tools.items.splice(i, 1);
							break;
						}
					}
					scope.tools.update();

					function onPriceLabelAdjusted(currency) {
						var columnsConfiguration = platformGridAPI.columns.configuration(scope.gridId);
						if (angular.isUndefined(columnsConfiguration) || (columnsConfiguration === null)) {
							return;
						}

						var columns = columnsConfiguration.current;
						_.forEach(columns, function (col) {
							if(col.id === 'price'){
								col.name = _.replace($translate.instant('boq.main.BasePrice'),'', '');
								col.toolTip = col.name;
							}else if(col.id === 'totalprice'){
								col.name = _.replace($translate.instant('boq.main.Price') +' '+ '('+ currency + ')', '', '');
								scope.unitRate = $translate.instant('boq.main.BoqItemSubPriceDto.Totalprice') + ' '+col.name;
								col.toolTip = col.name;
							}
						});

						platformGridAPI.columns.configuration(scope.gridId, columns);
						platformGridAPI.grids.refresh(scope.gridId);
						platformGridAPI.grids.invalidate(scope.gridId);
					}

					function onPasteCompleteHandler(/*e, arg*/) {
						dataService.calculateTotalPrice(true); // Trigger total recalculation
						dataService.gridRefresh();
					}

					boqMainNodeControllerService.priceLabelAdjusted.register(onPriceLabelAdjusted);
					platformGridAPI.events.register(scope.gridId, 'onPasteComplete', onPasteCompleteHandler);

					scope.$on('$destroy', function () {
						boqMainNodeControllerService.priceLabelAdjusted.unregister(onPriceLabelAdjusted);
						platformGridAPI.events.unregister(scope.gridId, 'onPasteComplete', onPasteCompleteHandler);
					});

				}
			};
		}
	]);

	boqMainModule.factory('boqMainSubPriceDataService', ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'boqMainSubPriceValidationService', 'math', '$injector', 'boqMainLineTypes',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, boqMainSubPriceValidationService, math, $injector, boqMainLineTypes) {
			return {
				getInstance: function(scope, boqMainService) {
					let service;
					const boqItemSubPriceSchema = {moduleSubModule: 'Boq.Main', typeName: 'BoqItemSubPriceDto'};
					const baseUrl = globals.webApiBaseUrl + 'boq/main/subprice/';

					let serviceOption = {
						flatLeafItem: {
							module: boqMainModule,
							serviceName: 'boqMainSubPriceDataService',
							entityRole: {leaf: {itemName: 'BoqItemSubPrice', parentService: boqMainService}},
							httpCreate: {route: baseUrl, endCreate: 'create'},
							httpRead: {
								route: baseUrl, endRead: 'list',
								initReadData: function (readData) {
									var currentBoqItem = boqMainService.getSelected();
									if (currentBoqItem.BoqLineTypeFk === boqMainLineTypes.position) {
										service.calculateTotalPrice();
										readData.filter = '?boqHeaderId=' + currentBoqItem.BoqHeaderFk + '&boqItemId=' + currentBoqItem.Id;
									}
								}
							},
							dataProcessor: [],
							actions: {
								delete: true,
								create: 'flat',
								canCreateCallBackFunc: function canCreateCallBackFunc() {
									var currentBoqItem = boqMainService.getSelected();
									return currentBoqItem.BoqLineTypeFk === boqMainLineTypes.position;
								},
							},
							presenter: {
								list: {
									initCreationData: function (creationData) {
										var currentBoqItem = boqMainService.getSelected();
										if (currentBoqItem.BoqLineTypeFk === boqMainLineTypes.position) {
											creationData.PKey1 = currentBoqItem.BoqHeaderFk;
											creationData.PKey2 = currentBoqItem.Id;
											return creationData;
										}
									},
								}
							},
						}
					};

					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

					serviceContainer.data.Initialised = true;
					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
						mustValidateFields: true,
						validationService: boqMainSubPriceValidationService.getInstance(serviceContainer.service)
					}, boqItemSubPriceSchema));

					service = serviceContainer.service;

					service.registerListLoaded(function () {
						service.calculateTotalPrice();
					});

					serviceContainer.service.registerEntityDeleted (deleteSubprice);
					function deleteSubprice() {
						service.calculateTotalPrice();
						serviceContainer.service.gridRefresh();
					}

					serviceContainer.service.provideUpdateData = function (updateData/* , data */) {

						// Using this callback helps to finally prepare the updated data before it is handed over to the complete entity
						let toSaveProperty = serviceContainer.service.getItemName() + 'ToSave';

						if (updateData && !_.isEmpty(toSaveProperty) && updateData[toSaveProperty] && updateData[toSaveProperty].length > 0) {

							// In this special case make sure decimals with a comma as decimal separator in the approach property are converted to ones with a dot.
							updateData[toSaveProperty] = _.map(updateData[toSaveProperty], function(subPriceEntity) {
								subPriceEntity.Approach = replaceCommaByDotInApproach(subPriceEntity.Approach);
								return subPriceEntity;
							});
						}
						return updateData;
					};

					function calculateSubPriceItem(subPriceItem) {
						let isMapCulture = $injector.get('estimateMainCommonCalculationService').getIsMapCulture(subPriceItem.Approach);
						if ( isMapCulture ) {
							let convertedApproach = replaceCommaByDotInApproach(subPriceItem.Approach);
							var approach = math.round(math.eval( convertedApproach ), 3);
							if (approach !== null || approach !== undefined) {
								subPriceItem.TotalPrice = (approach * subPriceItem.Price);
							}
						}
					}

					serviceContainer.service.propertyChanged = function (changedSubPrice, propertyName) {
						switch (propertyName) {
							case 'Price':
							case 'Approach': {
								calculateSubPriceItem(changedSubPrice);
								service.calculateTotalPrice();
								serviceContainer.service.gridRefresh();
							} break;
						}
					};

					serviceContainer.service.calculateTotalPrice = function calculateTotalPrice(calculateSubPriceItemFirst){
						let sum = 0;
						_.forEach(serviceContainer.service.getList(), function(subPriceItem) {
							if(calculateSubPriceItemFirst) {
								calculateSubPriceItem(subPriceItem);
							}
							sum += subPriceItem.TotalPrice;
						});
						scope.totalPrice = sum.toFixed(2);
					}

					scope.copyTotalPrice = function (sumOfTotalPrice){
						if(sumOfTotalPrice !== null && sumOfTotalPrice !== undefined){
							var currentBoqItem = boqMainService.getSelected();
							if(boqMainService.getReadOnly() === false || boqMainService.getCellEditable(currentBoqItem, 'Price') === true){
								var boqMainChangeService = $injector.get('boqMainChangeService');
								var boqMainCommonService = $injector.get('boqMainCommonService');
								currentBoqItem.Price = sumOfTotalPrice;
								boqMainChangeService.reactOnChangeOfBoqItem(currentBoqItem, 'Price', boqMainService, boqMainCommonService);
							}
						}
					};

					return service;
				}
			};
		}
	]);

	boqMainModule.factory('boqMainSubPriceUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService', '$injector',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService, $injector) {

		function cultureFormatter(row, cell, value, columnDef, dataContext) {
				var formattedValue = $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext, true);
				return formattedValue;
			}

			const layout = {
				fid: 'boq.main.boqItemSubPrice',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['description', 'approach', 'price', 'totalprice', 'remark']
					}
				],
				overloads: {
					totalprice:{readonly : true},
					'approach':  {
						'grid': {
							'formatter': cultureFormatter
						}
					}
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'BoqItemSubPriceDto', moduleSubModule: 'Boq.Main'});
			if (schema) {
				boqMainOenTranslationService.register(schema);
				schema = schema.properties;
				schema.AccessRightDescriptorName = {domain: 'description'};
			}
			return new platformUIStandardConfigService(layout, schema, boqMainTranslationService);
		}
	]);

	boqMainModule.factory('boqMainSubPriceValidationService', ['platformValidationServiceFactory','math', 'platformDataValidationService', '$injector',
		function (platformValidationServiceFactory, math, platformDataValidationService, $injector) {
			const boqItemSubPriceSchema = { moduleSubModule:'Boq.Main', typeName:'BoqItemSubPriceDto' };
			var ValidationServiceProvider = function(dataService) {
				var self = this;
				platformValidationServiceFactory.addValidationServiceInterface(boqItemSubPriceSchema, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(boqItemSubPriceSchema), uniques: []
				}, self, dataService);
				self.validateApproach = function (changedSubPrice, Approach) {
					var result = true;

					try {
						result = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(changedSubPrice, Approach, 'Approach', self, dataService);
						if(result && result.valid) {
							let approach = replaceCommaByDotInApproach(Approach);
							math.eval(approach);
						}
					} catch (error) {
						result = {
							valid: false ,
							apply: true,
							error: error.message
						};
					}
					return platformDataValidationService.finishValidation(result, changedSubPrice, Approach, 'Approach', self, dataService);
				};
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(dataservice) {
				latestCreatedValidationService = new ValidationServiceProvider(dataservice);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};
			return service;
		}]);
})();

