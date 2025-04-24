/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSubModelAlignmentPosDialogService
	 * @function
	 *
	 * @description Provides a dialog box for explicitly setting positions while aligning sub-models in a
	 *              composite model.
	 */
	angular.module('model.viewer').factory('modelViewerSubModelAlignmentPosDialogService', ['_', '$translate',
		'platformTranslateService', 'platformModalFormConfigService',
		function (_, $translate, platformTranslateService, platformModalFormConfigService) {
			var service = {};

			service.showDialog = function (refPointDefs, selectedRefPointId) {
				var settings = {
					refPointId: selectedRefPointId,
					x: 0,
					y: 0,
					z: 0,
					uomId: 'm'
				};

				var lengthUnits = [{
					id: 'cm',
					title: $translate.instant('model.viewer.subModelAlignment.refPtDlg.unitCM'),
					units: 0.01
				}, {
					id: 'm',
					title: $translate.instant('model.viewer.subModelAlignment.refPtDlg.unitM'),
					units: 1
				}, {
					id: 'in',
					title: $translate.instant('model.viewer.subModelAlignment.refPtDlg.unitIN'),
					units: 0.0254
				}, {
					id: 'ft',
					title: $translate.instant('model.viewer.subModelAlignment.refPtDlg.unitFT'),
					units: 0.3048
				}];

				var dlgConfig = {
					title: $translate.instant('model.viewer.subModelAlignment.refPtDlg.title'),
					dataItem: settings,
					formConfiguration: {
						fid: 'model.viewer.subModelAlignment.refPt',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'refPt',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.refPt',
							model: 'refPointId',
							type: 'select',
							options: {
								valueMember: 'id',
								displayMember: 'title',
								items: _.map(refPointDefs, function (rpd) {
									return {
										id: rpd.id,
										title: $translate.instant(rpd.title)
									};
								})
							}
						}, {
							gid: 'default',
							rid: 'x',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.x',
							model: 'x',
							type: 'factor'
						}, {
							gid: 'default',
							rid: 'y',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.y',
							model: 'y',
							type: 'factor'
						}, {
							gid: 'default',
							rid: 'z',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.z',
							model: 'z',
							type: 'factor'
						}, {
							gid: 'default',
							rid: 'unit',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.unit',
							model: 'uomId',
							type: 'select',
							options: {
								valueMember: 'id',
								displayMember: 'title',
								items: lengthUnits
							}
						}, {
							gid: 'default',
							rid: 'absolute',
							label$tr$: 'model.viewer.subModelAlignment.refPtDlg.absolute',
							type: 'boolean',
							model: 'absolute'
						}]
					},
					dialogOptions: {
						disableOkButton: function () {
							return _.isNil(settings.refPointId);
						}
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						result.data.uom = _.find(lengthUnits, {id: result.data.uomId});

						return {
							refPointId: result.data.refPointId,
							absolute: result.data.absolute,
							vector: {
								x: result.data.x * result.data.uom.units,
								y: result.data.y * result.data.uom.units,
								z: result.data.z * result.data.uom.units
							}
						};
					}
				});
			};

			return service;
		}]);
})(angular);
