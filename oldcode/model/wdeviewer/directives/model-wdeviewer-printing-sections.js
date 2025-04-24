/**
 * Created by yew on 28/5/2020.
 */

/* global moment */
(function (angular, moment) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerPrintingSections', ['platformTranslateService',
		function modelWdeViewerPrintingSections(platformTranslateService) {
			var service = {
				modelData: {}
			};
			service.sections = getSections(service.modelData);
			service.init = function init(data) {
				service.modelData = data;
				service.sections = getSections(data);
			};
			service.labelContentJson = function labelContentJson(value) {
				return {
					id: moment().format('YYYYMMDDHHMMSSx'),
					value: value,
					title: value,
				};
			};

			function getSections(modelData) {
				return [
					{
						code: 'COM',
						title: 'Company',
						title$tr$: 'model.wdeviewer.print.company',
						value: modelData.CompanyCode + ' ' + (modelData.CompanyName || '')
					},
					{
						code: 'PRJ',
						title: 'Project',
						title$tr$: 'model.wdeviewer.print.project',
						disable: !modelData.ProjectNo,
						value: modelData.ProjectNo + ' ' + (modelData.ProjectName || '') + ' ' + (modelData.ProjectName2 || '')
					},
					{
						code: 'MDL',
						title: 'Model',
						title$tr$: 'model.wdeviewer.print.model',
						value: modelData.ModelCode + ' ' + (modelData.ModelDesc || '')
					},
					{
						code: 'USR',
						title: 'User',
						title$tr$: 'model.wdeviewer.print.user',
						value: modelData.UserName
					},
					{
						code: 'DAT',
						title: 'Date',
						title$tr$: 'model.wdeviewer.print.date',
						value: moment().format('DD/MM/YYYY')
					},
					{
						code: 'PAG',
						title: 'Page',
						title$tr$: 'model.wdeviewer.print.page',
						value: modelData.pageInfo
					}
				];
			}

			platformTranslateService.translateObject(service.sections);
			return service;
		}
	]);

})(angular, moment);