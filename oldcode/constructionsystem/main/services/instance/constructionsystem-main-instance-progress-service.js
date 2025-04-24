/**
 * Created by wui on 5/5/2016.
 */

(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).constant('constructionSystemMainJobState', {
		waiting: 0,
		running: 1,
		finished: 2,
		canceling: 3,
		canceled: 4,
		aborted: 10,
		failed: 11
	});

	angular.module(moduleName).constant('constructionSystemMainInstanceState', {
		new: 0,
		evaluating: 1,
		evaluated: 2,
		evaluateFailed: 3,
		applying: 4,
		applied: 5,
		applyFailed: 6,
		calculating: 11,
		calculated: 12,
		calculateFailed: 13,
		objectAssigning: 14,
		objectAssigned: 15,
		objectAssignFailed: 16,
		objectUnassigned: 17,
		modified: 25,
		evaluateCanceled: 31,
		calculateCanceled: 32,
		applyCanceled: 33,
		waiting: 100,
		aborted: 101
	});

	angular.module(moduleName).factory('constructionSystemMainInstanceProgressService', [
		'$http',
		'$translate',
		'PlatformMessenger',
		'_',
		'platformGridAPI',
		'basicsCommonGridCellService',
		'basicsCommonGridFormatterHelper',
		'constructionSystemMainInstanceState',
		function($http,
			$translate,
			PlatformMessenger,
			_,
			platformGridAPI,
			basicsCommonGridCellService,
			basicsCommonGridFormatterHelper,
			constructionSystemMainInstanceState) {

			var service = {
				data: [],
				gridId: '',
				refresh: refresh,
				formatter: formatter
			};

			function refresh(data) {
				service.data = data;

				if (!service.gridId) {
					return;
				}

				if (platformGridAPI.grids.exist(service.gridId)) {
					basicsCommonGridCellService.updateColumn(service.gridId, 'status');
				}

				service.data = [];
			}

			/* jshint -W072 */
			function getStatusDescription(value) {
				var description = 'New', icon = 'instance-new';

				switch (value) {
					case 0:
						description = $translate.instant('constructionsystem.main.status.new');
						icon = 'instance-new';
						break;
					case 1:
						description = $translate.instant('constructionsystem.main.status.evaluating');
						icon = 'instance-evaluating';
						break;
					case 2:
						description = $translate.instant('constructionsystem.main.status.evaluated');
						icon = 'instance-evaluated';
						break;
					case 3:
						description = $translate.instant('constructionsystem.main.status.evaluateFailed');
						icon = 'instance-evaluate-failed';
						break;
					case 4:
						description = $translate.instant('constructionsystem.main.status.applying');
						icon = 'applying';
						break;
					case 5:
						description = $translate.instant('constructionsystem.main.status.applied');
						icon = 'applied';
						break;
					case 6:
						description = $translate.instant('constructionsystem.main.status.applyFailed');
						icon = 'apply-failed';
						break;
					case 11:
						description = $translate.instant('constructionsystem.main.status.calculating');
						icon = 'calculating';
						break;
					case 12:
						description = $translate.instant('constructionsystem.main.status.calculated');
						icon = 'calculated';
						break;
					case 13:
						description = $translate.instant('constructionsystem.main.status.calculateFailed');
						icon = 'calculate-failed';
						break;
					case 14:
						description = $translate.instant('constructionsystem.main.status.assigning');
						icon = 'calculating';
						break;
					case 15:
						description = $translate.instant('constructionsystem.main.status.assigned');
						icon = 'calculated';
						break;
					case 16:
						description = $translate.instant('constructionsystem.main.status.assignFailed');
						icon = 'calculate-failed';
						break;
					case 17:
						description = $translate.instant('constructionsystem.main.status.unassigned');
						icon = 'calculate-unassigned';
						break;
					case 25:
						description = $translate.instant('constructionsystem.main.status.modified');
						icon = 'crefo3';// tmp
						break;
					case 26:
						description = $translate.instant('constructionsystem.main.status.modified');
						icon = 'calculate-useredited';
						break;
					case 31:
						description = $translate.instant('constructionsystem.main.status.evaluateCanceled');
						icon = 'instance-evaluate-failed';
						break;
					case 32:
						description = $translate.instant('constructionsystem.main.status.calculateCanceled');
						icon = 'calculate-failed';
						break;
					case 33:
						description = $translate.instant('constructionsystem.main.status.applyCanceled');
						icon = 'apply-failed';
						break;
					case 100:
						description = $translate.instant('constructionsystem.main.status.waiting');
						icon = 'schedule';
						break;
					case 101:
						description = $translate.instant('constructionsystem.main.status.aborted');
						icon = 'stop';
						break;
				}

				icon = 'ico-' + icon;

				return '<i class="block-image control-icons ' + icon + '"></i><span class="pane-r">' + description + '</span>';
			}

			// noinspection JSUnusedLocalSymbols
			function formatter(row, cell, value, columnDef, dataContext, plainText, uniqueId) {
				value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

				var formatHtml = getStatusDescription(value);

				if (!dataContext || !service.data.length) {
					return formatHtml;
				}

				var entity = _.find(service.data, {
					InstanceHeaderFk: dataContext.InstanceHeaderFk,
					CosInstanceFk: dataContext.Id
				});

				if (entity) {
					success(entity);
				}

				function success(entity) {
					formatHtml = getStatusDescription(entity.JobState);

					// running status
					if (entity.JobState === constructionSystemMainInstanceState.evaluating ||
						entity.JobState === constructionSystemMainInstanceState.calculating ||
						entity.JobState === constructionSystemMainInstanceState.applying ||
						entity.JobState === constructionSystemMainInstanceState.objectAssigning) {
						/** @namespace entity.Progress */
						formatHtml = formatHtml + '(' + entity.Progress + '%)';
					}

					if (uniqueId) {
						// update status cell
						$('#' + uniqueId).html(formatHtml);
					}
				}

				return formatHtml;
			}

			return service;
		}
	]);

})(angular);