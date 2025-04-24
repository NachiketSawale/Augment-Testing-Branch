/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.measurements');
	const svcName = 'modelMeasurementOverlayDataService';

	myModule.factory(svcName, modelMeasurementOverlayDataService);

	modelMeasurementOverlayDataService.$inject = ['$injector', 'PlatformMessenger', '$translate', '$q',
		'platformLanguageService', 'accounting', 'modelViewerModelSelectionService', '_', '$http', 'modelMeasurementDataService'];

	function modelMeasurementOverlayDataService($injector, PlatformMessenger, $translate, $q,
		platformLanguageService, accounting, modelViewerModelSelectionService, _, $http, modelMeasurementDataService) {

		let modelMeasurementOverlayService = null;

		const conversionFactors = {
			length: {
				millimeters: 1000,
				centimeters: 100,
				meters: 1,
				kilometers: 0.001,
				inches: 1 / 0.0254,
				feet: 1 / 0.3048,
				yards: 1 / 0.9144
			}
		};

		function formatLength(lengthInMeters) {
			const langInfo = platformLanguageService.getLanguageInfo();
			const fmtOptions = {
				thousand: langInfo.numeric.thousand,
				decimal: langInfo.numeric.decimal,
				precision: 2
			};

			const lengthInfo = {};
			for (let key in conversionFactors.length) {
				const numVal = lengthInMeters * conversionFactors.length[key];
				lengthInfo[key] = accounting.formatNumber(numVal, fmtOptions.precision, fmtOptions.thousand, fmtOptions.decimal);
			}

			return $translate.instant('model.measurements.lengthFormat', lengthInfo);
		}

		function formatArea(areaInSquareMeters) {
			const langInfo = platformLanguageService.getLanguageInfo();
			const fmtOptions = {
				thousand: langInfo.numeric.thousand,
				decimal: langInfo.numeric.decimal,
				precision: 2
			};

			const areaInfo = {};
			for (let key in conversionFactors.length) {
				const numVal = areaInSquareMeters * conversionFactors.length[key];
				areaInfo[key] = accounting.formatNumber(numVal, fmtOptions.precision, fmtOptions.thousand, fmtOptions.decimal);
			}

			return $translate.instant('model.measurements.areaFormat', areaInfo);
		}

		function formatVolume(volumeInCubicMeters) {
			const langInfo = platformLanguageService.getLanguageInfo();
			const fmtOptions = {
				thousand: langInfo.numeric.thousand,
				decimal: langInfo.numeric.decimal,
				precision: 2
			};

			const volumeInfo = {};
			for (let key in conversionFactors.length) {
				const numVal = volumeInCubicMeters * conversionFactors.length[key];
				volumeInfo[key] = accounting.formatNumber(numVal, fmtOptions.precision, fmtOptions.thousand, fmtOptions.decimal);
			}

			return $translate.instant('model.measurements.volumeFormat', volumeInfo);
		}

		/* function formatValues(measurement) {
			if (measurement) {
				const request = measurement.map(obj => ({
					Id: obj.id,
					Value: obj.value,
					MeasurementType: obj.type,
					TargetUomFk: obj.type === 10 ? measurement.uomSettings.uomLengthFk :
						obj.type === 20 ? measurement.uomSettings.uomLengthFk :
							obj.type === 30 ? measurement.uomSettings.uomAreaFk :
								obj.type === 40 ? measurement.uomSettings.uomAreaFk : null
				}));
				$http.post(globals.webApiBaseUrl + 'model/measurement/formatvalues', request).then(function (response) {
					response.data.forEach(item => {
						const matchingMeasurement = measurement.find(measurement => measurement.id === item.Id);
						if (matchingMeasurement) {
							matchingMeasurement.displayMeasurement = item.FormattedValue;
						}
					});
				});
			}
		} */

		class Measurement {
			constructor() {
				this.id = privateState.permanent.generateId();
				this.points = [];
				this.name = null;
				this.value = 0;
				this.type = null;
				this.isCompleted = false;
				this.UomFk = null;
				this.Uom = null;
				this.getUom();
			}

			_createPointDef(id, x, y, z) {
				return {
					id: id,
					owner: this.getId(),
					coordinates: {
						x,
						y,
						z
					}
				};
			}

			/**
			 * Adds a point.
			 * @param x The X coordinate.
			 * @param y The Y coordinate.
			 * @param z The Z coordinate.
			 * @param endOfGroup Indicates whether the point represents the end of a group.
			 * @returns {Object} An object with a list of added, modified, and/or removed point definitions.
			 */
			addPoint(x, y, z, endOfGroup) {
				this.points.push({x, y, z, endOfGroup});
				return {
					added: [this._createPointDef(this.getPointId(this.points.length - 1), x, y, z)]
				};
			}

			getId() {
				return `measurement${this.id}`;
			}

			getPointId(index) {
				return `${this.getId()}_p${index + 1}`;
			}

			getPointsDefs() {
				const pointDefs = this.points.map((pt, idx) => {
					return {
						id: this.getPointId(idx),
						x: pt.x,
						y: pt.y,
						z: pt.z
					};
				});
				return pointDefs;
			}

			getDisplayedParts() {
				return [{
					points: this.points.map((pt, idx) => this.getPointId(idx)),
					filled: false,
					showPoints: true,
					closeShape: false
				}];
			}

			getUom() {
				if (!modelMeasurementOverlayService) {
					modelMeasurementOverlayService = $injector.get('modelMeasurementOverlayService');
				}
				return this.UomInfo = modelMeasurementOverlayService.uomSettings();
			}
		}

		class StraightDistance extends Measurement {
			constructor() {
				super();
				this.name = 'StraightDistance';
				this.type = 10;
				this.UomFk = this.UomInfo.uomLengthFk;
			}

			addPoint(x, y, z, endOfGroup) {
				if (endOfGroup) {
					this.isCompleted = true;
					return {};
				}

				return super.addPoint(x, y, z, false);
			}

			calculateValue() {
				if (this.points.length < 2) {
					return;
				}
				const dist = [];

				for (let i = 0; i < this.points.length-1; i++) {
					const delta = {
						x: this.points[i].x - this.points[i+1].x,
						y: this.points[i].y - this.points[i+1].y,
						z: this.points[i].z - this.points[i+1].z
					};
					this.distance = Math.sqrt((delta.x * delta.x) + (delta.y * delta.y) + (delta.z * delta.z));
					dist.push(this.distance );
				}
				this.distance = _.sum(dist);
				this.value = _.sum(dist).toFixed(2);
				this.displayMeasurement = 'L = ' + this.value;
				return $q.when();
			}
		}

		class Perimeter extends Measurement {
			constructor() {
				super();
				this.name = 'Perimeter';
				this.type = 20;
				this.UomFk = this.UomInfo.uomLengthFk;
			}

			addPoint(x, y, z, endOfGroup) {
				if (endOfGroup && this.points.length > 0) {
					this.isCompleted = true;
					return {};
				}

				return super.addPoint(x, y, z, false);
			}

			calculateValue() {
				if (this.points.length < 3) {
					return;
				}
				const dist = [];

				const effectivePoints = [...this.points];
				effectivePoints.push(this.points[0]);
				for (let i = 0; i < effectivePoints.length - 1; i++) {
					const delta = {
						x: effectivePoints[i].x - effectivePoints[i+1].x,
						y: effectivePoints[i].y - effectivePoints[i+1].y,
						z: effectivePoints[i].z - effectivePoints[i+1].z
					};
					this.length = Math.sqrt((delta.x * delta.x) + (delta.y * delta.y) + (delta.z * delta.z));
					dist.push(this.length);
				}
				this.perimeter = _.sum(dist);
				this.value = _.sum(dist).toFixed(2);
				this.displayMeasurement = 'P = ' + this.value;
				return $q.when();
			}

			getDisplayedParts() {
				const result = super.getDisplayedParts();
				result[0].closeShape = true;
				return result;
			}
		}

		class Area extends Measurement {
			constructor() {
				super();
				this.name = 'Area';
				this.type = 30;
				this.UomFk = this.UomInfo.uomAreaFk;
			}

			addPoint(x, y, z, endOfGroup) {
				if (endOfGroup && this.points.length > 0) {
					this.isCompleted = true;
					return {};
				}

				return super.addPoint(x, y, z, false);
			}

			calculateValue() {
				if (this.points.length < 3) {
					return;
				}

				const that = this;
				const points = _.map(this.points, function (point) {
					return {
						PosX: point.x,
						PosY: point.y,
						PosZ: point.z,
					};
				});
				points.push(points[0]);
				//
				return $http.post(globals.webApiBaseUrl + 'model/measurement/calculatearea', points).then(function (result) {
					that.area = result.data;
					that.value = result.data.toFixed(2);
					that.displayMeasurement = 'A = ' + formatArea(that.value);
					return $q.when();
				});
			}

			getDisplayedParts() {
				const result = super.getDisplayedParts();
				result[0].closeShape = true;
				result[0].filled = true;
				return result;
			}
		}

		class Volume extends Measurement {
			constructor() {
				super();
				this.name = 'Volume';
				this.type = 40;
				this.UomFk = this.UomInfo.uomVolumeFk;
			}

			addPoint(x, y, z, endOfGroup) {
				if (endOfGroup && this.points.length > 0) {
					this.isCompleted = true;

					super.addPoint(x, y, z, true);

					// The intended height is measured by comparing the Z value of the final point to the first point.
					const height = z - this.points[0].z;

					// Instead of the final point, a duplicate of all other points (except the
					// final point) is returned, shifted by the height in Z direction.
					const that = this;
					return {
						added: this.points.slice(0, -1).map((pt, idx) => {
							const newPtId = that._getTopPointId(idx);
							return that._createPointDef(newPtId, pt.x, pt.y, pt.z + height);
						})
					};
				}

				return super.addPoint(x, y, z, false);
			}

			_getTopPointId(index) {
				return this.getPointId(index) + '_top';
			}

			calculateValue() {
				if (this.points.length < 4) {
					return;
				}
				const that = this;
				const points = _.map(this.points, function (point) {
					return {
						PosX: point.x,
						PosY: point.y,
						PosZ: point.z,
					};
				});
				if (this.points.find(obj => obj.endOfGroup === true)) {
					return $http.post(globals.webApiBaseUrl + 'model/measurement/calculatevolume', points).then(function (result) {
						that.volume = result.data;
						that.value = result.data.toFixed(2);
						that.displayMeasurement = 'V = ' + that.value;
						return $q.when();
					});
				}
			}

			getPointsDefs() {
				const height = this.points[this.points.length - 1].z;
				const points= this.points.slice(0, -1).map((pt, idx) => {
					return {
						id: this.getPointId(idx),
						x: pt.x,
						y: pt.y,
						z: pt.z
					};
				});
				const duplicatedPoints = this.points.slice(0, -1).map((pt, idx) => {
					return {
						id: this._getTopPointId(idx),
						x: pt.x,
						y: pt.y,
						z: pt.z + height - this.points[0].z
					};
				});
				const pointDefs = points.concat(duplicatedPoints);
				return pointDefs;
			}

			getDisplayedParts() {
				if (this.isCompleted) {
					const bottom = {
						points: [],
						closeShape: true,
						filled: true
					};
					const top = {
						points: [],
						closeShape: true
					};
					const parts = [bottom, top];

					const numPoints = this.points.length - 1;

					for (let i = 0; i < numPoints; i++) {
						const bottomPointId = this.getPointId(i);
						const topPointId = this._getTopPointId(i);
						const nextBottomPointId = this.getPointId((i + 1) % numPoints);
						const nextTopPointId = this._getTopPointId((i + 1) % numPoints);

						bottom.points.push(bottomPointId);
						top.points.push(topPointId);

						parts.push({
							points: [bottomPointId, topPointId, nextTopPointId, nextBottomPointId]
						});
					}

					return parts;
				}

				const result = super.getDisplayedParts();
				result[0].closeShape = true;
				result[0].filled = true;
				return result;
			}
		}

		class UnknownMeasurement extends Measurement {
			constructor() {
				super();
				this.name = 'UnknownMeasurement';
				this.type = 0;
				this.UomFk = this.UomInfo.uomLengthFk;
			}
		}

		const privateState = {
			onMeasurementsChanged: new PlatformMessenger(),
			fireMeasurementsChanged(added, modified, removed) {
				this.onMeasurementsChanged.fire({
					added: Array.isArray(added) ? added : [],
					modified: Array.isArray(modified) ? modified : [],
					removed: Array.isArray(removed) ? removed : []
				});
			},
			onPointsChanged: new PlatformMessenger(),
			firePointsChanged(added, modified, removed) {
				const chgInfo = {
					added: Array.isArray(added) ? added : [],
					modified: Array.isArray(modified) ? modified : [],
					removed: Array.isArray(removed) ? removed : []
				};

				if (chgInfo.added.length + chgInfo.modified.length + chgInfo.removed.length > 0) {
					this.onPointsChanged.fire(chgInfo);
				}
			},
			permanent: {
				nextId: 1,
				generateId() {
					return this.nextId++;
				},
				clear() {
					this.nextId = 1;
					this.measurements = [];
				},
				measurements: [],
				activeMeasurement : null,
				currentMode: 'distance'
			}
		};

		modelViewerModelSelectionService.onSelectedModelChanged.register(function () {
			privateState.permanent.clear();
		});

		return {
			types: {
				StraightDistance,
				Perimeter,
				Area,
				Volume,
				UnknownMeasurement
			},
			activateMeasurementMode(mode) {
				privateState.permanent.currentMode = mode.id;
			},
			addPoint(x, y, z, endOfGroup)
			{
				if (!privateState.permanent.activeMeasurement) {
					switch (privateState.permanent.currentMode) {
						case 'distance':
							privateState.permanent.activeMeasurement = new StraightDistance();
							break;
						case 'perimeter':
							privateState.permanent.activeMeasurement = new Perimeter();
							break;
						case 'area':
							privateState.permanent.activeMeasurement = new Area();
							break;
						case 'volume':
							privateState.permanent.activeMeasurement = new Volume();
							break;
						case 'UnknownMeasurement':
							privateState.permanent.activeMeasurement = new Measurement();
							break;
					}
					privateState.permanent.measurements.push(privateState.permanent.activeMeasurement);
				}

				const currentMeasurement = privateState.permanent.activeMeasurement;

				const pointChanges = currentMeasurement.addPoint(x, y, z, endOfGroup);
				if (currentMeasurement.isCompleted) {
					privateState.permanent.activeMeasurement = null;
				}

				$q.when(currentMeasurement.calculateValue()).then(function () {
					privateState.fireMeasurementsChanged(null, [currentMeasurement]);
				});

				if (pointChanges && (!_.isEmpty(pointChanges.added) || !_.isEmpty(pointChanges.modified) || !_.isEmpty(pointChanges.removed))) {
					privateState.firePointsChanged(/* [{
						id: newPtId,
						owner: currentMeasurement.getId(),
						coordinates: {
							x,
							y,
							z
						}
					}] */pointChanges.added, pointChanges.modified, pointChanges.removed);
				}
			},
			saveMeasurement(viewRecord) {
				modelMeasurementDataService.addItem(privateState.permanent.measurements[privateState.permanent.measurements.length - 1], viewRecord);
			},
			addMeasurements(measurements) {
				privateState.permanent.measurements.push(...measurements);
				const newPoints = [];
				for (let m of measurements) {
					for (let p of m.getPointsDefs()) {
						newPoints.push({
							id: p.id,
							owner: m.getId(),
							coordinates: {
								x: p.x,
								y: p.y,
								z: p.z
							}
						});
					}
				}
				privateState.firePointsChanged(newPoints);
				privateState.fireMeasurementsChanged(measurements);
			},

			getFirstPoint() {
				return privateState.permanent.activeMeasurement.points[0];
			},
			getActiveMeasurement() {
				return privateState.permanent.activeMeasurement;
			},

			getAllMeasurements() {
				return {
					measurements: privateState.permanent.measurements
				};
			},

			clearAllMeasurements()  {
				privateState.permanent.measurements = [];
				privateState.permanent.activeMeasurement = null;
			},

			showSelectedMeasurement(measurement) {
				if (privateState.permanent.measurements) {
					privateState.fireMeasurementsChanged(null, null, [privateState.permanent.measurements]);
				}
				privateState.permanent.measurements = [measurement];
				if (Array.isArray(privateState.permanent.measurements) && privateState.permanent.measurements.length > 0) {
					privateState.permanent.measurements.map(me => {
						const newMeasurement = (function createMeasurement () {
							switch (me.Type) {
								case 10:
									return new StraightDistance();
								case 20:
									return new Perimeter();
								case 30:
									return new Area();
								case 40:
									return new Volume();
								case 0:
									return new UnknownMeasurement();
							}
						})();

						newMeasurement.points = me.MdlMeasurementPointEntities.map(pe => {
							return {
								x: pe.PosX,
								y: pe.PosY,
								z: pe.PosZ
							};
						});

						newMeasurement.color = me.Color;

						switch (me.Type) {
							case 10:
								newMeasurement.value = me.Value.toFixed(2);
								newMeasurement.displayMeasurement = 'L = ' + me.Value.toFixed(2) + 'm';
								break;
							case 20:
								newMeasurement.value = me.Value.toFixed(2);
								newMeasurement.displayMeasurement = 'P = ' + me.Value.toFixed(2) + 'm';
								break;
							case 30:
								newMeasurement.value = me.Value.toFixed(2);
								newMeasurement.displayMeasurement = 'A = ' + me.Value.toFixed(2) + 'm²';
								break;
							case 40:
								newMeasurement.value = me.Value.toFixed(2);
								newMeasurement.displayMeasurement = 'V = ' + me.Value.toFixed(2) + 'm³';
								break;
							case 0:
								newMeasurement.value = me.Value.toFixed(2);
								newMeasurement.displayMeasurement = 'D = ' + me.Value.toFixed(2) + '0';
						}

						newMeasurement.isCompleted = true;

						privateState.permanent.measurements = [newMeasurement];

						const newPoints = [];
						for (let m of privateState.permanent.measurements) {
							for (let p of m.getPointsDefs()) {
								newPoints.push({
									id: p.id,
									owner: m.getId(),
									coordinates: {
										x: p.x,
										y: p.y,
										z: p.z
									}
								});
							}
						}
						privateState.onPointsChanged.register(newPoints);
						privateState.firePointsChanged(newPoints);
						privateState.fireMeasurementsChanged(newMeasurement);
					});
				}
			},
			registerMeasurementsChanged(handler) {
				privateState.onMeasurementsChanged.register(handler);
			},
			unregisterMeasurementsChanged(handler) {
				privateState.onMeasurementsChanged.unregister(handler);
			},
			registerPointsChanged(handler) {
				privateState.onPointsChanged.register(handler);
			},
			unregisterPointsChanged(handler) {
				privateState.onPointsChanged.unregister(handler);
			}
		};
	}
})(angular);
