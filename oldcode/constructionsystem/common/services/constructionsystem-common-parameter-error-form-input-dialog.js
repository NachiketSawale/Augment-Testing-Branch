/**
 * Created by jes on 8/11/2016.
 */

/* global _ */

// todo: this service may no longer needed, see defect 75218

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionSystemCommonParameterErrorFormInputDialog', constructionSystemCommonParameterErrorFormInputDialog);

	constructionSystemCommonParameterErrorFormInputDialog.$inject = [
		'$translate',
		'basicsUserformCommonService',
		'platformModalFormConfigService',
		'platformTranslateService'
	];

	function constructionSystemCommonParameterErrorFormInputDialog(
		$translate,
		basicsUserformCommonService,
		platformModalFormConfigService,
		platformTranslateService) {

		var service = {};

		platformTranslateService.registerModule(moduleName);

		function processItemList(itemList, cosParameters) {
			_.forEach(itemList, function (e) {
				var item = e.Entity;
				var cosParam = _.find(cosParameters, {BasFormFieldFk: item.FormFieldFk});
				item.VariableName = cosParam.VariableName;
				item.ParameterTypeFk = cosParam.CosParameterTypeFk;
			});
		}

		function createDataItem(mainItem, itemList, cosParameters) {
			processItemList(itemList, cosParameters);
			var dataItem = {};
			dataItem.__rt$data = {};
			dataItem.__rt$data.errors = {};

			dataItem.Id = mainItem.Id;
			_.forEach(itemList, function (e) {
				var item = e.Entity;
				dataItem[item.VariableName] = item;
				dataItem.__rt$data.errors[item.VariableName + '.FieldValue'] = {error: e.ErrorMsg};
			});
			return dataItem;
		}

		function createRowConfig(itemList, cosParameters) {
			var rowConfig = [];
			var sort = 0;
			_.forEach(itemList, function (e) {
				var item = e.Entity;
				var cosParam = _.find(cosParameters, {BasFormFieldFk: item.FormFieldFk});
				var label = cosParam.DescriptionInfo.Translated ? cosParam.DescriptionInfo.Translated : item.VariableName;
				sort += 1;
				rowConfig.push({
					gid: 'baseGroup',
					rid: item.Id,
					label: label,
					model: cosParam.VariableName + '.FieldValue',
					type: 'history',
					readonly: true,
					sortOrder: sort
				});
			});
			return rowConfig;
		}

		function createModalFormDateDetailConfig(mainItem, itemList, cosParameters, formInfo) {

			var config = {
				title: $translate.instant('constructionsystem.common.errorFormInputDialog'),
				resizeable: false,
				dataItem: createDataItem(mainItem, itemList, cosParameters),
				formConfiguration: {
					fid: 'constructionsystem.main.formdatadetailmodal',
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: createRowConfig(itemList, cosParameters)
				},
				handleOK: function () {
					var options = {
						formId: formInfo.FormId,
						formDataId: formInfo.FormDataId,
						editable: true,
						setReadonly: false,
						modal: true
					};
					basicsUserformCommonService.editData(options);
				}
			};
			return config;
		}

		service.showDialog = function (mainItem, itemList, cosParameters, formInfo) {
			var modalFormDateDetailConfig = createModalFormDateDetailConfig(mainItem, itemList, cosParameters, formInfo);
			return platformModalFormConfigService.showDialog(modalFormDateDetailConfig);
		};

		return service;
	}

})(angular);