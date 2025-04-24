(function (angular) {
	'use strict';
	/* global globals moment */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingTimeAssignmentDataService', Service);
	Service.$inject = ['$http', '$q', 'PlatformMessenger'];

	function Service($http, $q, PlatformMessenger) {
		const self = this;
		const urlPrefix = globals.webApiBaseUrl + 'productionplanning/item/actualtimerecording/timeassignment/';
		const onReportLoaded = new PlatformMessenger();
		const onReportModified = new PlatformMessenger();

		let queryString = '';
		let reports = null;
		let assignment = null;

		self.registerReportLoaded = e => onReportLoaded.register(e);
		self.unregisterReportLoaded = e => onReportLoaded.unregister(e);
		self.fireReportLoaded = () => onReportLoaded.fire();
		self.registerReportModified = e => onReportModified.register(e);
		self.unregisterReportModified = e => onReportModified.unregister(e);

		self.load = (date, siteId, timeSymbolId) => {
			const deferred = $q.defer();
			queryString = `?date=${moment.utc(date).toJSON()}&siteId=${siteId}&timeSymbolId=${timeSymbolId}`;

			$http.get(urlPrefix + 'list' + queryString).then(res => {
				initialize(res.data);
				deferred.resolve(res.data);
			});
			return deferred.promise;
		};

		self.update = () => {
			const deferred = $q.defer();
			if (self.hasModifiedReports()) {
				$http.post(urlPrefix + 'update' + queryString, getModifiedReports()).then(res => {
					initialize(res.data);
					deferred.resolve(res.data);
				});
			} else {
				deferred.resolve(reports);
			}
			return deferred.promise;
		};

		self.reset = () => {
			const deferred = $q.defer();
			$http.post(urlPrefix + 'reset' + queryString).then(res => {
				initialize(res.data);
				deferred.resolve(res.data);
			});
			return deferred.promise;
		};

		function initialize(data) {
			if (data) {
				reports = data;
				assignment = new Assignment(reports);
			} else {
				reports = assignment = null;
			}
			self.fireReportLoaded();
		}

		self.getEmployees = () => assignment.getEmployees();
		self.getAreas = () => assignment.getAreas();
		self.getAreasOfEmployee = employeeId => assignment.getAreasOfEmployee(employeeId);
		self.getEmployeesOfArea = areaId => assignment.getEmployeesOfArea(areaId);
		self.getAllReports = () => reports; // for querying productAssignment datas, we have to add this method

		self.actionColFieldGeneratorFn = item => `Actions['${item.Id}'].AssignedTime`;

		// for render action columns in grid
		self.getActions = employee => {
			let actions = [];
			const areas = employee ? self.getAreasOfEmployee(employee.Id) : self.getAreas();
			for (const area of areas) {
				actions = actions.concat(area.getActions());
			}
			return actions;
		};

		self.markReportAsModified = (item) => {
			updateReports(item);
			assignment.updateDurationAndAssignedTime();
			onReportModified.fire(item);
		};

		self.hasModifiedReports = () => reports && getModifiedReports().length > 0;

		function getModifiedReports() {
			return reports.filter(i => i.IsGenerated && i.IsModified);
		}

		function updateReports(item) {
			const reportsToBeUpdated = reports.filter(i => i.BasSiteFk === item.BasSiteFk &&
																		i.TksEmployeeFk === item.TksEmployeeFk);
			reportsToBeUpdated.forEach(i => {
				if (item.Actions[i.TksTimeSymbolFk] && i.AssignedTime !== item.Actions[i.TksTimeSymbolFk].AssignedTime) {
					i.AssignedTime = item.Actions[i.TksTimeSymbolFk].AssignedTime;
				}
				i.IsModified = i.AssignedTime !== i.Duration;
			});
		}

		class Assignment {
			constructor(reports) {
				this.employees = new Map();
				this.areas = new Map();
				this.employeeToAreas = new Map();
				this.areaToEmployees = new Map();
				this._processReports(reports);
			}

			_processReports(reports) {
				const sourceReports = reports.filter(i => !i.IsGenerated);
				const detailReports = reports.filter(i => i.IsGenerated);
				const allActions = [];

				for (const report of detailReports) {
					allActions.push(new Action(report));
				}

				for (const report of sourceReports) {
					const actionsOfEmployee = allActions.filter(i => i.TksEmployeeFk === report.TksEmployeeFk);
					this.employees.set(report.TksEmployeeFk, new Employee(report, actionsOfEmployee));
					const reportsOfEmployee = detailReports.filter(i => i.TksEmployeeFk === report.TksEmployeeFk);
					this.employeeToAreas.set(report.TksEmployeeFk, getEmployeeToAreas(reportsOfEmployee, actionsOfEmployee));
				}

				function getEmployeeToAreas(reports, actionsOfEmployee) {
					const employeeToAreas = new Map();
					for (const report of reports) {
						if (!employeeToAreas.has(report.BasSiteFk)) {
							const actions = actionsOfEmployee.filter(i => i.BasSiteFk === report.BasSiteFk);
							employeeToAreas.set(report.BasSiteFk, new EmployeeToArea(report, actions));
						}
					}
					return [...employeeToAreas.values()];
				}

				for (const report of detailReports) {
					if (!this.areas.has(report.BasSiteFk)) {
						const actionsOfArea = allActions.filter(i => i.BasSiteFk === report.BasSiteFk);
						this.areas.set(report.BasSiteFk, new Area(report, actionsOfArea));
						const reportsOfArea = detailReports.filter(i => i.BasSiteFk === report.BasSiteFk);
						this.areaToEmployees.set(report.BasSiteFk, getAreaToEmployees(reportsOfArea, actionsOfArea));
					}
				}

				function getAreaToEmployees(reports, actionsOfArea) {
					const areaToEmployees = new Map();
					for (const report of reports) {
						if (!areaToEmployees.has(report.TksEmployeeFk)) {
							const actions = actionsOfArea.filter(i => i.TksEmployeeFk === report.TksEmployeeFk);
							areaToEmployees.set(report.TksEmployeeFk, new AreaToEmployee(report, actions));
						}
					}
					return [...areaToEmployees.values()];
				}
			}

			getEmployees() {
				return this.employees.size > 0 ? [...this.employees.values()] : [];
			}

			getAreasOfEmployee(employeeId) {
				return this.employeeToAreas.has(employeeId) ? [...this.employeeToAreas.get(employeeId).values()] : [];
			}

			getAreas() {
				return this.areas.size > 0 ? [...this.areas.values()] : [];
			}

			getEmployeesOfArea(areaId) {
				return this.areaToEmployees.has(areaId) ? [...this.areaToEmployees.get(areaId).values()] : [];
			}

			updateDurationAndAssignedTime() {
				[...this.areaToEmployees.values()].forEach(i => i.forEach(j => j.updateDuration()));
				[...this.employeeToAreas.values()].forEach(i => i.forEach(j => j.updateDuration()));
				[...this.areas.values()].forEach(i => i.updateDuration());
				[...this.employees.values()].forEach(i => i.updateAssignedTime());
			}
		}

		class Employee {
			constructor(report, actions = []) {
				this._actions = actions;
				this.Id = report.TksEmployeeFk;
				this.TksEmployeeCode = report.TksEmployeeCode;
				this.TksEmployeeDescription = report.TksEmployeeDescription;
				this.Duration = report.Duration;
				this.AssignedTime = report.AssignedTime;
				this.RemainingTime = report.RemainingTime;
			}

			updateAssignedTime() {
				this.AssignedTime = this._actions.reduce((a, b) => a + b.AssignedTime, 0);
				this.RemainingTime = this.Duration - this.AssignedTime;
			}
		}

		class Area {
			constructor(report, actions = []) {
				this._actions = actions;
				this.Id = report.BasSiteFk;
				this.BasSiteCode = report.BasSiteCode;
				this.BasSiteDescription = report.BasSiteDescription;
				this.Duration = 0;
				this.updateDuration();
			}

			_setActions(actions) {
				this.Actions = {};
				for (const action of actions) {
					if (this.Actions[action.Id]) {
						this.Actions[action.Id].AssignedTime += action.AssignedTime;
					} else {
						this.Actions[action.Id] = Object.create(action);
					}
				}
			}

			getActions() {
				return Object.values(this.Actions);
			}

			updateDuration() {
				this._setActions(this._actions);
				this.Duration = this.getActions().reduce((a, b) => a + b.AssignedTime, 0);
			}
		}

		class DetailBase {
			constructor(report, actions) {
				this.BasSiteFk = report.BasSiteFk;
				this.TksEmployeeFk = report.TksEmployeeFk;
				this.Duration = 0;
				this.Actions = {};
				this._setActions(actions);
				this.updateDuration();
			}

			_setActions(actions) {
				actions.forEach(action => this.Actions[action.Id] = action);
			}

			getActions() {
				return Object.values(this.Actions);
			}

			updateDuration() {
				this.Duration = this.getActions().reduce((a, b) => a + b.AssignedTime, 0);
			}
		}

		class EmployeeToArea extends DetailBase {
			constructor(report, actions) {
				super(report, actions);
				this.Id = report.BasSiteFk;
				this.BasSiteCode = report.BasSiteCode;
				this.BasSiteDescription = report.BasSiteDescription;
			}
		}

		class AreaToEmployee extends DetailBase {
			constructor(report, actions) {
				super(report, actions);
				this.Id = report.TksEmployeeFk;
				this.TksEmployeeCode = report.TksEmployeeCode;
				this.TksEmployeeDescription = report.TksEmployeeDescription;
			}
		}

		class Action {
			constructor(report) {
				this.Id = report.TksTimeSymbolFk;
				this.Code = report.MdcCostCode;
				this.AssignedTime = report.AssignedTime;
				this.Sorting = report.TksTimeSymbolSorting;
				this.BasSiteFk = report.BasSiteFk;
				this.TksEmployeeFk = report.TksEmployeeFk;
				this.TksTimeSymbolFk = report.TksTimeSymbolFk;
			}
		}
	}
})(angular);
