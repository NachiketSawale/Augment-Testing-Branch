/*
 * $Id: timekeeping-recording-input-form-controller.js 550216 2019-07-05 09:23:27Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.recording';

	angular.module(moduleName).service('timekeepingRecordingInputFormService', TimekeepingRecordingInputFormService);

	TimekeepingRecordingInputFormService.$inject = ['_', '$http', 'timekeepingRecordingInputFormLayoutService'];

	function TimekeepingRecordingInputFormService(_, $http, timekeepingRecordingInputFormLayoutService) {
		var self = this;

		this.initScope = function initScope(scope) {
			scope.crew = self.getCrew();
		};

		this.getCrew = function getCrew() {
			return [{
				Id: 1,
				Name: 'Bert Beispiel'
			}, {
				Id: 2,
				Name: 'Sally Sample'
			}];
		};

		this.hasVariableCount = function hasVariableCount(def) {
			return (def.MaxCount === 0) || (def.MinCount !== def.MaxCount);
		};

		this.generatePhaseObject = function generatePhaseObject(pDef, pIdx) {
			return {
				index: pIdx,
				duration: {
					getHours: function () {
						return this.hours + (this.minutes / 60.0);
					}
				}
			};
		};

		this.createPhaseInstance = function createPhaseInstance(owner, pIdx) {
			var result = self.generatePhaseObject(owner.def, pIdx);

			result.remove = function () {
				owner.instances.splice(this.index, 1);
				for (var i = this.index; i < owner.instances.length; i++) {
					owner.instances[i].index--;
				}
			};

			result.canRemove = function () {
				return owner.instances.length > owner.def.MinCount;
			};

			result.getTimeSymbolId = function () {
				switch (owner.def.TimeSymbolUserInterfaceFk) {
					case 1: // list
					case 2: // checkmark
						console.log('Not yet implemented.');
						return 13;
					case 3: // others
					case 4: // fixed
						return owner.def.TimeSymbolFk;
				}
			};
			return result;
		};

		this.createGroupInstance = function createGroupInstance(owner, gIdx) {
			return {
				index: gIdx,
				phases: _.map(owner.def.InputPhaseEntities, function (pDef) {
					var p = {
						def: pDef,
						hasVariableCount: self.hasVariableCount(pDef),
						addInstance: function () {
							this.instances.push(self.createPhaseInstance(this, this.instances.length));
						},
						canAddInstance: function () {
							return (this.def.MaxCount === 0) || (this.instances.length < this.def.MaxCount);
						}
					};
					p.instances = _.map(_.range(0, pDef.MinCount), function (pIdx) {
						return self.createPhaseInstance(p, pIdx);
					});
					return p;
				}),
				remove: function () {
					owner.instances.splice(this.index, 1);
					for (var i = this.index; i < owner.instances.length; i++) {
						owner.instances[i].index--;
					}
				},
				canRemove: function () {
					return owner.instances.length > owner.def.MinCount;
				}
			};
		};

		this.generateFormFromLayout = function generateFormFromLayout(scope) {
			var selected = timekeepingRecordingInputFormLayoutService.getSelectedLayout();
			if (selected) {
				timekeepingRecordingInputFormLayoutService.loadLayoutComplete(selected).then(function (layout) {
					layout.TimeSymbols.byId = (function generateTimeSymbolsMap () {
						var result = {};
						layout.TimeSymbols.forEach(function (ts) {
							result[ts.Id] = ts;
						});
						return result;
					})();
					scope.$evalAsync(function () {
						scope.currentLayout = {
							def: layout,
							groups: _.map(layout.InputPhaseGroupEntities, function (gDef) {
								var g = {
									def: gDef,
									hasVariableCount: self.hasVariableCount(gDef),
									addInstance: function () {
										this.instances.push(self.createGroupInstance(this, this.instances.length));
									},
									canAddInstance: function () {
										return (this.def.MaxCount === 0) || (this.instances.length < this.def.MaxCount);
									}
								};
								g.instances = _.map(_.range(0, gDef.MinCount), function (gIdx) {
									return self.createGroupInstance(g, gIdx);
								});
								return g;
							})
						};
					});
				});
			}
		};

		this.submit = function submit(scope) {
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/testsubmit', {
				LayoutId: timekeepingRecordingInputFormLayoutService.getSelectedLayout().Id,
				PhaseReports: (function () {
					var reports = [];
					scope.currentLayout.groups.forEach(function (g) {
						g.instances.forEach(function (gInstance) {
							gInstance.phases.forEach(function (p) {
								p.instances.forEach(function (pInstance) {
									reports.push({
										InputPhaseFk: p.def.Id,
										From: pInstance.from,
										To: pInstance.to,
										Duration: pInstance.duration.getHours(),
										TimeSymbolFk: pInstance.getTimeSymbolId()
									});
								});
							});
						});
					});
					return reports;
				})()
			}).then(function (response) {
				console.log(response.data);
			});
		};
	}

})(angular);
