/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.viewer');
	const svcName = 'modelViewerMeasurementDataService';

	myModule.factory(svcName, modelViewerMeasurementDataService);

	modelViewerMeasurementDataService.$inject = ['PlatformMessenger', '$translate',
		'platformLanguageService', 'accounting', 'modelViewerModelSelectionService'];

	function modelViewerMeasurementDataService(PlatformMessenger, $translate,
		platformLanguageService, accounting, modelViewerModelSelectionService) {

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
				precision: 3
			};

			const lengthInfo = {};
			for (let key in conversionFactors.length) {
				const numVal = lengthInMeters * conversionFactors.length[key];
				lengthInfo[key] = accounting.formatNumber(numVal, fmtOptions.precision, fmtOptions.thousand, fmtOptions.decimal);
			}

			return $translate.instant('model.viewer.measurements.lengthFormat', lengthInfo);
		}

		class StraightDistance {
			constructor(id, pt1, pt2) {
				this.id = id;
				this.pt1 = pt1;
				this.pt2 = pt2;

				const delta = {
					x: pt2.x - pt1.x,
					y: pt2.y - pt1.y,
					z: pt2.z - pt1.z
				};
				this.length = Math.sqrt((delta.x * delta.x) + (delta.y * delta.y) + (delta.z * delta.z));
				this.displayLength = formatLength(this.length);
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
			permanent: {
				nextId: 1,
				generateId() {
					return this.nextId++;
				},
				clear() {
					this.nextId = 1;
					this.distances = [];
				},
				distances: []
			}
		};

		modelViewerModelSelectionService.onSelectedModelChanged.register(function () {
			privateState.permanent.clear();
		});

		return {
			addStraightDistance(pt1, pt2) {
				const newItem = new StraightDistance(privateState.permanent.generateId(), pt1, pt2);
				privateState.permanent.distances.push(newItem);
				privateState.fireMeasurementsChanged([newItem]);
			},
			getAllMeasurements() {
				return {
					straightDistances: privateState.permanent.distances
				};
			},
			registerMeasurementsChanged(handler) {
				privateState.onMeasurementsChanged.register(handler);
			},
			unregisterMeasurementsChanged(handler) {
				privateState.onMeasurementsChanged.unregister(handler);
			}
		};
	}
})(angular);
