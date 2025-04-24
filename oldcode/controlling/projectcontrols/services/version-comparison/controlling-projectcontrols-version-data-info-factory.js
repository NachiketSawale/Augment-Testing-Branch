/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).factory('controllingProjectcontrolsVersionDataInfoFactory', [
		'$http',
		'$q',
		'_',
		'projectControlsComparisonVersionType',
		function ($http, $q, _, projectControlsComparisonVersionType) {

			function formatterHistory(items) {
				return _.map(_.orderBy(items, ['RibHistoryId']), function (historyItem) {
					return {
						value: historyItem.RibHistoryId,
						description: historyItem.HistoryDescription,
						ribPrjHistoryKey: historyItem.Id
					};
				});
			}

			function formatterPeriod(items) {
				return _.map(items, function (periodItem) {
					return {
						value: moment(periodItem.RelDate).format('L'),
						description: moment(periodItem.RelDate).format('YYYY-MM-DD')
					};
				});
			}

			function CompareDataInfo() {
				this.projectId = -1;
				this.project = null;
				this.projectCode = 'Structure Code';
				this.projectDescription = '';
				this.isShowEmptyData = true;
				this.historyEntities = [];
				this.historyVersionInfos = [
					new HistoryVersionInfo(this, projectControlsComparisonVersionType.VersionA),
					new HistoryVersionInfo(this, projectControlsComparisonVersionType.VersionB),
				];
			}

			CompareDataInfo.prototype.showEmptyData = function () {
				return this.isShowEmptyData;
			}

			CompareDataInfo.prototype.toggleShowEmptyData = function () {
				this.isShowEmptyData = !this.isShowEmptyData;
				return this.isShowEmptyData;
			}

			CompareDataInfo.prototype.setProject = function (projectSelected) {
				this.project = projectSelected;
				this.projectId = projectSelected ? projectSelected.Id : -1;
				this.projectCode = projectSelected ? projectSelected.ProjectNo : '';
				this.projectName = projectSelected ? projectSelected.ProjectName : '';
				this.historyVersionInfos.forEach(e => {
					this.ribHistoryId = -1;
					this.ribPrjHistoryKey = -1;
				})
			}

			CompareDataInfo.prototype.initHistoryVersionInfos = function (data) {
				this.historyEntities = formatterHistory(data.HistoryEntities);
				const versionInfoA = this.getHistoryVersionInfoByType(projectControlsComparisonVersionType.VersionA);
				if(versionInfoA){
					this.initHistoryVersion(versionInfoA, data);
				}
				const versionInfoB = this.getHistoryVersionInfoByType(projectControlsComparisonVersionType.VersionB);
				if(versionInfoB){
					this.initHistoryVersion(versionInfoB, data.LastSecondHistoryInfo || data);
				}
			}

			CompareDataInfo.prototype.initHistoryVersion = function (versionInfo, data) {
				versionInfo.periods = formatterPeriod(data.TimeintervalEntities);
				versionInfo.ribHistoryId = data.LastHistoryEntity ? data.LastHistoryEntity.RibHistoryId : -1;
				versionInfo.ribPrjHistoryKey = data.LastHistoryEntity ? data.LastHistoryEntity.Id : -1;
				versionInfo.periodSelectedId = data.LastTimeinterval ? moment(data.LastTimeinterval.RelDate).format('L') : '';
				versionInfo.periodSelectedDescription = data.LastTimeinterval ? moment(data.LastTimeinterval.RelDate).format('YYYY-MM-DD') : '';
			}

			CompareDataInfo.prototype.clearHistoryVersionInfos = function (data) {
				this.historyVersionInfos.forEach(e => {
					e.clear();
				});
			}

			CompareDataInfo.prototype.getVersions = function () {
				return this.historyEntities;
			}

			CompareDataInfo.prototype.getVersions = function () {
				return this.historyEntities;
			}

			CompareDataInfo.prototype.getHistoryVersionInfos = function () {
				return this.historyVersionInfos.map(e => {
					return {
						RibHistoryId : e.ribPrjHistoryKey,
						Period : e.periodSelectedDescription,
						Type : e.comparisonVersionType
					};
				});
			}

			CompareDataInfo.prototype.isSelected = function (historyVersionId) {
				return this.historyVersionInfos.some(e => e.ribPrjHistoryKey === historyVersionId);
			}

			CompareDataInfo.prototype.getHistoryVersionInfoByType = function (comparisonVersionType) {
				return this.historyVersionInfos.find(e => e.comparisonVersionType === comparisonVersionType);
			}

			CompareDataInfo.prototype.getSelectVersion = function (comparisonVersionType) {
				return this.historyVersionInfos.find(e => e.comparisonVersionType === comparisonVersionType);
			}

			CompareDataInfo.prototype.setSelectVersion = function (comparisonVersionType, selectedItem) {
				const historyVersionInfo = this.historyVersionInfos.find(e => e.comparisonVersionType === comparisonVersionType);
				if(historyVersionInfo){
					historyVersionInfo.setSelectVersion(selectedItem);
				}
			}

			CompareDataInfo.prototype.getPeriods = function (comparisonVersionType) {
				const historyVersionInfo = this.getHistoryVersionInfoByType(comparisonVersionType);
				return historyVersionInfo ? historyVersionInfo.periods : [];
			}

			CompareDataInfo.prototype.setSelectPeriod = function (comparisonVersionType, selectedItem) {
				const historyVersionInfo = this.historyVersionInfos.find(e => e.comparisonVersionType === comparisonVersionType);
				if(historyVersionInfo){
					historyVersionInfo.setSelectPeriod(selectedItem);
				}
			}

			CompareDataInfo.prototype.removeHistoryEntity = function (historyEntityId) {
				let index = _.findIndex(this.historyEntities, {ribPrjHistoryKey: historyEntityId});
				if (index >= 0) {
					this.historyEntities.splice(index, 1);
				}
			}

			CompareDataInfo.prototype.isValidated = function (){
				const isHistoryVersionValidated = this.historyVersionInfos.every(e => e.isValidated());
				return this.projectId > 0 && isHistoryVersionValidated;
			}

			function HistoryVersionInfo(compareDataInfo, comparisonVersionType) {
				this.compareData = compareDataInfo;
				this.comparisonVersionType = comparisonVersionType;
				this.ribHistoryId = -1;
				this.ribPrjHistoryKey = -1;
				this.periodSelectedId = '';
				this.periodSelectedDescription = '';
				this.periods = [];
			}

			HistoryVersionInfo.prototype.isValidated = function (selectedItem) {
				return this.ribPrjHistroyKey > 0 && this.periodSelectedId && this.periodSelectedDescription;
			}

			HistoryVersionInfo.prototype.clear = function () {
				this.ribHistoryId = -1;
				this.ribPrjHistoryKey = -1;
				this.periodSelectedId = '';
				this.periodSelectedDescription = '';
				this.periods = [];
			}

			HistoryVersionInfo.prototype.setSelectVersion = function (selectedItem) {
				this.clear();
				this.ribPrjHistoryKey = selectedItem.id;
				this.ribHistoryId = selectedItem.caption;
			}

			HistoryVersionInfo.prototype.setSelectPeriod = function (selectedItem) {
				this.periodSelectedId = selectedItem.id;
				this.periodSelectedDescription = selectedItem.description;
			}

			HistoryVersionInfo.prototype.loadPeriods = function (callbackFunc, groupingConfigChangeCallback) {
				const self = this;
				this.periodSelectedId = '';
				this.periods = [];
				let historySelected = _.find(self.compareData.historyEntities, {value: self.ribHistoryId});
				if (historySelected) {
					self.ribPrjHistoryKey = historySelected.ribPrjHistoryKey;
				}
				if (this.ribHistoryId > 0) {
					let requestInfo = {
						ProjectId: this.compareData.projectId,
						HistoryNo: this.ribHistoryId,
						HistoryId: this.ribPrjHistoryKey
					};
					return $http.post(globals.webApiBaseUrl + 'controlling/BisDpTimeinterval/list', requestInfo).then(function (response) {
						if (response.data.timeIntervalList) {
							self.periods = formatterPeriod(response.data.timeIntervalList);
							let lastPR = _.isArray(self.periods) && self.periods.length > 0 ? self.periods[self.periods.length - 1] : null;
							if (!!lastPR) {
								self.setSelectPeriod({id: lastPR.value, description: lastPR.description});
							}

							if (callbackFunc) {
								callbackFunc(self);
							}
						}
						if (response.data.prjClassfications && groupingConfigChangeCallback) {
							groupingConfigChangeCallback(response.data.prjClassfications);
						}
					});
				}else{
					return $q.when();
				}
			}

			return {
				createComparisonData: function () {
					return new CompareDataInfo();
				}
			}
		}]);
})(angular);