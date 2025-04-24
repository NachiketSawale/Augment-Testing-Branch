/**
 * Created by wui on 2/1/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,$ */

	var moduleName = 'procurement.ticketsystem';

	angular.module(moduleName).factory('procurementTicketSystemDocumentService', [
		'moment',
		'$translate',
		'$timeout',
		'platformGridAPI',
		'platformModalGridConfigService',
		'basicsCommonFileUploadServiceFactory',
		function (moment,
			$translate,
			$timeout,
			platformGridAPI,
			platformModalGridConfigService,
			basicsCommonFileUploadServiceFactory) {
			var progressTimeout, service = {},
				uploadService = basicsCommonFileUploadServiceFactory.createService({
					uploadConfigs: {
						SectionType: 'DocumentsProject'
					}
				});

			service.showDialog = function (group) {
				var dataItems = group.docs.map(function (doc) {
					return doc;
				});
				var config = {
					title: $translate.instant('procurement.ticketsystem.htmlTranslate.documents'),
					dataItems: dataItems,
					gridConfiguration: {
						uuid: '9D9A7815ADEA21049EC2EF11C46E786C',
						version: '0.2.4',
						columns: [
							{
								id: 'fileName',
								formatter: 'description',
								field: 'FileName',
								name: 'File Name',
								name$tr$: 'procurement.ticketsystem.file.name'
							},
							{
								id: 'fileType',
								formatter: 'description',
								field: 'FileType',
								name: 'File Type',
								name$tr$: 'procurement.ticketsystem.file.type'
							},
							{
								id: 'date',
								formatter: 'date',
								field: 'LastModified',
								name: 'Date Modified',
								name$tr$: 'procurement.ticketsystem.file.date'
							},
							{
								id: 'fileSize',
								field: 'FileSize',
								name: 'File Size',
								name$tr$: 'procurement.ticketsystem.file.size',
								formatter: function (row, cell, value) {
									return (value / (1024 * 1024)).toFixed(2) + 'MB';
								}
							},
							{
								id: 'progress',
								field: 'Progress',
								name: 'Progress',
								name$tr$: 'procurement.ticketsystem.file.progress',
								formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
									var items = uploadService.getItemsSource();
									var item = _.find(items, {startTime: dataContext.StartTime});

									if(item){
										(function render() {
											if(item.status === 'uploading') {
												dataContext.Progress = item.percentage;
												// update status cell
												$('#' + uniqueId).html(makeProgressHtml(dataContext.Progress));
												progressTimeout = $timeout(render, 200);
											}
											else{
												dataContext.Progress = 100;
												// update status cell
												$('#' + uniqueId).html(makeProgressHtml(dataContext.Progress));
											}
										})();
									}
									else{
										dataContext.Progress = 100;
										// update status cell
										// $('#' + uniqueId).html(makeProgressHtml(dataContext.Progress));
									}

									function makeProgressHtml(percentage) {
										return '<div class="progress upd-progress-bar">' +
                                           '<div class="progress-bar" role="progressbar" aria-valuemin=" 0" aria-valuemax="100" style="width:' + percentage + '%">' +
                                           '<span>' + percentage + '%</span>' +
                                           '</div>' +
                                           '</div>';
									}

									return makeProgressHtml(dataContext.Progress);
								}
							}
						]
					},

					handleOK: function handleOK() {
						if(progressTimeout){
							$timeout.cancel(progressTimeout);
						}
						uploadService.onUploading.unregister(onUploading);
						group.docs = config.dataItems;
					},

					handleCancel: function () {
						if(progressTimeout){
							$timeout.cancel(progressTimeout);
						}
						uploadService.onUploading.unregister(onUploading);
					},

					dialogOptions: {
						width: '680px',
						resolve: {
							'doctypes': ['basicsLookupdataLookupDescriptorService',
								function (basicsLookupdataLookupDescriptorService) {
									return basicsLookupdataLookupDescriptorService.loadData('DocumentType');
								}
							]
						}
					},

					btn1Enable: {
						show: true,
						customBtn1Label: $translate.instant('cloud.common.taskBarNewRecord'),
						handleCustomBtn1: function () {
							uploadService.uploadFiles(null, null, null, 'multiple').then(function (/* res */) {

							});
						}
					},

					btn2Enable: {
						show: true,
						customBtn2Label: $translate.instant('cloud.common.taskBarDeleteRecord'),
						handleCustomBtn2: function () {
							var selectedItems = platformGridAPI.rows.selection({
								gridId: config.gridConfiguration.uuid,
								wantsArray: true
							});

							if(selectedItems.length){
								var deleteIndex = 0;

								config.dataItems = config.dataItems.filter(function (item, index) {
									var isSelected = selectedItems.some(function (selected) {
										return  selected === item;
									});

									if(isSelected){
										deleteIndex = index;
									}

									return !isSelected;
								});

								platformGridAPI.items.data(config.gridConfiguration.uuid, config.dataItems);

								if(!config.dataItems.length){
									return;
								}

								var nextIndex = deleteIndex;

								if(config.dataItems.length < nextIndex + 1){
									nextIndex = config.dataItems.length - 1;
								}

								platformGridAPI.rows.selection({
									gridId: config.gridConfiguration.uuid,
									rows: [config.dataItems[nextIndex]]
								});
							}
						}
					}
				};

				uploadService.onUploading.register(onUploading);

				function onUploading(e) {
					var uploadItem = e.data, file = uploadItem.file;

					config.dataItems.push({
						FileName: file.name,
						FileType: file.type,
						FileSize: file.size,
						LastModified:  moment(file.lastModifiedDate),
						Progress: uploadItem.percentage,
						Id: uploadItem.config.fields.FileArchiveDocId,
						FileArchiveDocId: uploadItem.config.fields.FileArchiveDocId,
						StartTime: uploadItem.startTime
					});

					platformGridAPI.items.data(config.gridConfiguration.uuid, config.dataItems);
				}

				platformModalGridConfigService.showDialog(config);
			};

			return service;
		}
	]);

})(angular);