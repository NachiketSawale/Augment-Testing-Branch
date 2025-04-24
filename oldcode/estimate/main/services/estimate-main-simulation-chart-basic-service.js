/**
 * Created by Naim on 4/19/2017.
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainWicRelateAssemblyService
	 * @function
	 *
	 * @description
	 * estimateMainSimulationBasicService is the data service for wic2assembly related functionality.
	 */
	angular.module(moduleName).factory('estimateMainSimulationChartBasicService',
		[
			'$translate',
			'modelSimulationMasterService',
			'modelSimulationTimelineRequestService',
			'estimateMainService',
			'basicsCurrencyMainService',
			'platformModalService',
			'platformDomainService',
			'platformLanguageService',
			'platformContextService',
			'platformNumberShorteningService',
			'accounting',
			'moment',
			'estimateMainCostCodeChartDialogMainService',
			'estimateMainSimulationChartSelectionsConstant',

			function (
				$translate,
				modelSimulationMasterService,
				modelSimulationTimelineRequestService,
				estimateMainService,
				basicsCurrencyMainService,
				platformModalService,
				platformDomainService,
				platformLanguageService,
				platformContextService,
				platformNumberShorteningService,
				accounting,
				moment,
				estimateMainCostCodeChartDialogMainService,
				estimateMainSimulationChartSelectionsConstant) {

				let service = {};
				let labelsOn = true;
				let markersOn = true;
				let coupled2Timeline = false;

				let Cache = function Cache(cacheObjs) {
					let self = this;
					this.cacheObjs = cacheObjs;
					this.getCacheObj = function (cashObjName) {
						let cacheObjResult;
						_.forEach(self.cacheObjs, function (item) {
							if (!cacheObjResult && item.cashObjName === cashObjName){
								cacheObjResult = item;
							}
						});
						return cacheObjResult;
					};
					_.forEach(this.cacheObjs, function (cacheObj) {
						cacheObj.getCacheObj = self.getCacheObj;
					});
					this.clearCaches = function(){
						_.forEach(this.cacheObjs, function (cacheObj) {
							cacheObj.clear();
						});
					};
				};

				let CacheObj = function CacheObj(name, getMehtode, cacheUpdateDependencies, cache){
					this.cashObjName =  name;
					this.setChanged = function () {
						this.gotUpdate = [];
					};
					this.setObj = function setObj(objToCache){
						this.objToCache = objToCache;
						this.setChanged();
					};
					this.setToUpdated = function setToUpdated (relatedObjName){
						this.gotUpdate.push(relatedObjName);
					};
					this.getObj = function getObj(updateFrom){
						this.update(updateFrom);

						return this.objToCache;
					};
					if (getMehtode){
						this.getObjMethod = getMehtode;
					}
					else{
						this.getObjMethod = function () {
							return this.objToCache;
						};
					}
					if (cacheUpdateDependencies){
						this.cacheUpdateDependencies = cacheUpdateDependencies;
					}
					else{
						this.cacheUpdateDependencies = [];
					}
					this.needsObjCacheUpdate = function () {
						let self = this;
						let needsUpdate = false;
						_.forEach(this.cacheUpdateDependencies, function (updateDependencies) {
							let depentObj = self.getCacheObj(updateDependencies);
							if(depentObj && (depentObj.cacheChanged(self.cashObjName) || depentObj.needsObjCacheUpdate())){
								needsUpdate = true;
							}
						});
						return needsUpdate || this.rebuild;
					};
					this.cacheChanged = function (relatedObjName) {
						return this.getRelatedUpdateState(relatedObjName) === undefined;
					};
					this.getRelatedUpdateState = function (relatedObjName) {
						return _.find(this.gotUpdate, function (relation){
							return relatedObjName === relation;
						});
					};
					this.dataCache = cache;

					this.update = function update(updateFrom){
						let self = this;
						if (this.needsObjCacheUpdate()){
							this.setObj(this.getObjMethod(function(cashObjName){
								return self.getCacheObj(cashObjName).getObj(self.cashObjName);
							}));
							this.rebuild = false;
						}
						this.setToUpdated(updateFrom);
					};

					this.clear = function clear(){
						this.objToCache = undefined;
						this.setChanged();
						this.rebuild = true;
					};
					this.clear();
				};

				let uuid = function() {
					return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c){
						return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16); // jshint ignore:line
					});
				};

				let getSeries = function getSeries (dataCache) {
					let serverData = dataCache('serverData');
					let resultPairs = [];
					let hasHourAxis = false;
					let hasMoneyAxis = false;

					// get cultureInfo in order to determin localizies money string format
					let culture = platformContextService.culture();
					let cultureInfo = platformLanguageService.getLanguageInfo(culture);

					// get the currency string of the project's currency
					let prjInfo = estimateMainService.getSelectedProjectInfo();
					let prjCurrId = prjInfo && prjInfo.ProjectCurrency ? prjInfo.ProjectCurrency : '';
					let item = basicsCurrencyMainService.getItemById(prjCurrId);
					let currency = item ? item.Currency :  '';

					let curve = $translate.instant('estimate.main.simulationChart.tooltipCurve');
					let date = $translate.instant('estimate.main.simulationChart.tooltipDate');

					_.forEach(serverData, function (item) {
						let valueAxisId = '';
						let unit = '';
						if (item.CalculationField === 1 || item.CalculationField === 3){
							hasMoneyAxis = true;
							valueAxisId = 'currency';
							unit = currency;
						}
						else if (item.CalculationField === 2){
							hasHourAxis = true;
							valueAxisId = 'hour';
							unit = 'h';
						}
						let valueName = _.find(estimateMainSimulationChartSelectionsConstant, function (calculationSelection) {
							return item.CalculationField === calculationSelection.value;
						}).text;

						let markers = false;
						if (markersOn){
							markers = {
								color: item.Color,
								getToolTipText: function (d) {
									let localizisedValueString = accounting.formatNumber(d.value,2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal) + unit;
									return curve + ': ' + item.CurveName + '' + date + ': ' + d.key.format('LL') + '' + valueName + ': ' + localizisedValueString;
								}
							};
						}
						resultPairs.push({
							id: 'cost-' + uuid(),
							valueAxisId: valueAxisId,
							markers: markers,
							line: {color: item.Color},
							pairs: _.reduce(item.Data, function(result, value, key){
								result.push({'key': moment(key), 'value': parseInt(value)});
								return result;
							}, []),
							labels: {
								getText : function getText (item1) {
									if (labelsOn){
										let localizisedValueString = accounting.formatNumber(item1.value,2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal) + unit;
										return localizisedValueString;
									}
									else{
										return '';
									}
								},
								color: item.Color,
								cssClass: 'simulation-chart-labels'
							}
						});

					});
					return {seriesPairs: resultPairs, hasHourAxis: hasHourAxis, hasMoneyAxis: hasMoneyAxis};
				};

				let getValueAxis = function (cache) {
					let series = cache('series');
					let configEmptyAxis = {
						isReversed: true,
						scale: 'linear',
						position: 'near',
						roundBoundaries: false,
						includeItems: [0],
						formatFn: function(){
						}
					};
					let configCurrencyAxis = {
						id : 'currency',
						isReversed: true,
						scale: 'linear',
						position: 'near',
						roundBoundaries: false,
						includeItems: [0],
						formatFn: function(v){
							let abrivated = platformNumberShorteningService.getShortNumber(v,'trading',10);
							return abrivated.getString(2);
						}
					};
					let configHourAxis = {
						id : 'hour',
						isReversed: true,
						scale: 'linear',
						position: 'far',
						roundBoundaries: false,
						includeItems: [0],
						formatFn: function(v){
							let abrivated = platformNumberShorteningService.getShortNumber(v,'trading',10);
							return abrivated.getString(2) + 'h';
						}
					};
					let valueAxis = [];
					if(series.hasHourAxis){
						configEmptyAxis.position = 'far';
						valueAxis.push(configHourAxis);
					}
					if(series.hasMoneyAxis){
						configEmptyAxis.position = 'near';
						valueAxis.push(configCurrencyAxis);
					}
					valueAxis.push(configEmptyAxis);

					return valueAxis;
				};

				let getKeyAxis = function(cache){
					let overrideBoundaries = cache('overrideBoundaries');
					let highlights = [{
						id: 'today',
						anchor: moment(),
						cssClass: 'sim-element sim-todayline'
					}];
					if (modelSimulationMasterService.isTimelineReady()) {
						highlights.push({
							id: 'simulatedNow',
							anchor: modelSimulationMasterService.getCurrentTime(),
							cssClass: 'sim-element sim-currentline'
						});
					}
					return [{
						// id : 'time',
						orientation: 'x',
						scale: 'time',
						position: 'far',
						overrideBoundaries: overrideBoundaries,
						highlights: highlights
					}];
				};

				let getGraphConfig = function getGraphConfig (cache) {
					return {
						keyAxis: cache('keyAxis'),
						valueAxis: cache('valueAxis'),
						series: cache('series').seriesPairs
					};
				};

				let dataCache = new Cache([
					new CacheObj('graphConfig',getGraphConfig,['series','keyAxis','valueAxis']),
					new CacheObj('valueAxis', getValueAxis, ['series']),
					new CacheObj('keyAxis', getKeyAxis, ['overrideBoundaries']),
					new CacheObj('series', getSeries, ['serverData']),
					new CacheObj('overrideBoundaries'),
					new CacheObj('serverData')
				]);

				service.computeData = function computeData (dataPairs) {
					dataCache.getCacheObj('serverData').setObj(dataPairs);
					let temp = dataCache.getCacheObj('graphConfig').getObj();
					return temp;
				};

				let toggelMarkers = function toggelMarkers(){
					dataCache.getCacheObj('series').rebuild = true; // need update on series cache
					if (markersOn){
						markersOn = false;
					}
					else{
						markersOn = true;
					}
				};


				service.toggelMarkers = toggelMarkers;

				service.toggelLabels = function toggelLabels(){
					if (labelsOn){
						labelsOn = false;
					}
					else{
						labelsOn = true;
					}
				};

				service.getGraphFromCash = function getGraphFromCash (){
					return dataCache.getCacheObj('graphConfig').getObj();
				};

				service.setCoupled2Timeline = function setCoupled2Timeline(){
					coupled2Timeline = true;
				};

				service.unSetCoupled2Timeline = function unSetCoupled2Timeline(){
					coupled2Timeline = false;
				};

				service.isCoupled2Timeline = function isCoupled2Timeline(){
					return coupled2Timeline;
				};

				service.setDateZoom = function setDateZoom (tRange){
					dataCache.getCacheObj('overrideBoundaries').setObj(tRange);
				};

				service.areMarkersOn = function areMarkersOn(){
					return markersOn;
				};

				service.areLabelsOn = function areLabelsOn(){
					return labelsOn;
				};

				service.clearCaches = function clearCaches() {
					dataCache.clearCaches();
				};

				return service;
			}
		]);
})();
