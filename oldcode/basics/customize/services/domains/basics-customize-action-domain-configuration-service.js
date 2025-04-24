/**
 * Created by Frank Baedeker on 2020/10/23.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeActionDomainConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides configuration of all action column in instance table
	 */
	angular.module(moduleName).service('basicsCustomizeActionDomainConfigurationService', BasicsCustomizeActionDomainConfigurationService);

	BasicsCustomizeActionDomainConfigurationService.$inject = ['_', '$http', '$timeout', '$translate', '$injector', 'platformDialogService',
		'basicsCustomizeStatusRuleDataService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeActionDomainConfigurationService(_, $http, $timeout, $translate, $injector, platformDialogService,
		basicsCustomizeStatusRuleDataService, basicsCustomizeInstanceDataService) {

		var self = this;

		this.getColumn = function getColumn(columns, name) {
			return _.find(columns, {field: name});
		};

		this.createAccessRightActionColumnConfiguration = function createAccessRightActionColumnConfiguration(property, listConfig) {
			var columnToAddActionFor = self.getColumn(listConfig.columns, property.Name);
			if (columnToAddActionFor) {
				columnToAddActionFor.actionList = columnToAddActionFor.actionList && _.isArray(columnToAddActionFor.actionList) ? columnToAddActionFor.actionList : [];
				columnToAddActionFor.formatter = 'action';
				//usually the action button is only shown when an value is assigned for that specific column
				columnToAddActionFor.forceActionButtonRender = true;
				const standardKey = 'basics.customize.accessrightdescriptor';
				const standardKeyTranslated = $translate.instant(standardKey);
				let translatedKey = standardKey;
				let translatedDesc = standardKeyTranslated;
				const actionParam1Key = 'basics.customize.' + property.ActionParam1;
				const actionParam1Translated = $translate.instant(actionParam1Key);
				if(actionParam1Translated && actionParam1Translated !== actionParam1Key) {
					columnToAddActionFor.name$tr$ = actionParam1Key;
					columnToAddActionFor.name = actionParam1Translated;
					translatedKey = actionParam1Key;
					translatedDesc = actionParam1Translated;
				} else {
					columnToAddActionFor.name$tr$ = standardKey;
					columnToAddActionFor.name = standardKeyTranslated;
				}
				columnToAddActionFor.toolTip = translatedKey;
				columnToAddActionFor.SortOrderPath = property.ActionParam2;
				columnToAddActionFor.AccessMask = property.ActionParam3;
				var instanceAction = {
					toolTip: function (entity, field) {
						var toolTipText = $translate.instant('basics.customize.createAccessRightDescriptor');
						if (entity && entity[field] && entity.DescriptionInfo) {
							toolTipText = translatedKey + ' (' + entity.DescriptionInfo.Description + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'control-icons ico-rights-off',
					valueIcon: 'control-icons ico-rights-on',
					callbackFn: function (entity, field) {
						if (entity[field]) {
							basicsCustomizeStatusRuleDataService.deleteAccessRightDescriptorById(entity, field);
						} else {
							basicsCustomizeStatusRuleDataService.createAccessRightDescriptorWithAccessMask(entity, field, property, translatedKey, translatedDesc);
						}
					}
				};
				columnToAddActionFor.actionList.push(instanceAction);
			}
		};

		this.createLoadIconFileActionColumnConfiguration = function createLoadIconFileActionColumnConfiguration(property, listConfig) {
			var columnToAddActionFor = self.getColumn(listConfig.columns, property.Name);
			if (columnToAddActionFor) {
				columnToAddActionFor.actionList = columnToAddActionFor.actionList && _.isArray(columnToAddActionFor.actionList) ? columnToAddActionFor.actionList : [];
				columnToAddActionFor.formatter = 'action';
				//usually the action button is only shown when an value is assigned for that specific column
				columnToAddActionFor.forceActionButtonRender = true;
				var translationKey = 'basics.customize.' + property.ActionParam1;
				var translatedKey = $translate.instant(translationKey);
				columnToAddActionFor.name$tr$ = translationKey;
				columnToAddActionFor.name = translatedKey;
				columnToAddActionFor.toolTip = translatedKey;
				columnToAddActionFor.formatterOptions = {
					appendContent: true
				};
				var uploadBtn = {
					toolTip: function (/*entity, field*/) {
						return $translate.instant('basics.customize.basExternalDesktopTilesUploadIcon');
					},
					icon: 'tlb-icons ico-upload pull-right',
					callbackFn: function (entity/*, field*/) {
						var fileElement = document.querySelector('#tile-icon-upload');
						if (fileElement) {
							fileElement.parentNode.removeChild(fileElement);
						}

						fileElement = document.createElement('input');
						fileElement.type = 'file';
						fileElement.id = 'tile-icon-upload';
						fileElement.accept = '.png,.gif,.jpg';
						document.querySelector('body').appendChild(fileElement);
						fileElement.onchange = function (/*e*/) {

							let MAX_SIZE_IN_BYTES = 50000;
							if (fileElement.files && fileElement.files.length === 1) {
								if (fileElement.files[0].size > MAX_SIZE_IN_BYTES) {
									platformDialogService.showMsgBox('basics.customize.basExternalDesktopTilesFileSizeMsg', 'basics.customize.basExternamDesktopTilesInfoHeader', 'info');
									return;
								}
								else if (fileElement.files[0].type === 'image/svg+xml') {
									platformDialogService.showMsgBox('basics.customize.basExternalDesktopTilesFileSvgMsg', 'basics.customize.basExternamDesktopTilesInfoHeader', 'info');
									return;
								}
							}
							let formData = new FormData();
							formData.append('file', fileElement.files[0]);
							return $http.post(globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/upload', formData, {
								transformRequest: angular.identity,
								headers: {'Content-Type': undefined}
							}).then(function (result) {
								if (result.data && result.data.Id) {
									entity.Imagefilename = fileElement.files[0].name;
									entity.BlobImageFk = result.data.Id;
									basicsCustomizeInstanceDataService.markItemAsModified(entity);
									basicsCustomizeInstanceDataService.parentService().update().then(function () {
										platformDialogService.showMsgBox('basics.customize.basExternalDesktopTilesImageUploadedMsg', 'basics.customize.basExternamDesktopTilesInfoHeader', 'info');
									});
								}
							});
						};

						fileElement.currentEntity = entity;

						$timeout(function () {
							fileElement.click();
						}, 200);
					}
				};
				columnToAddActionFor.actionList.push(uploadBtn);

				var deleteBtn = {
					toolTip: function (/*entity, field*/) {
						return $translate.instant('basics.customize.basExternalDesktopTilesDeleteIcon');
					},
					icon: 'control-icons ico-input-delete pull-right',
					callbackFn: function (entity/*, field*/) {
						if (entity.BlobImageFk !== null) {

							platformDialogService.showYesNoDialog('basics.customize.basExternalDesktopTilesImageDeletePrompt', 'basics.customize.basExternalDesktopTilesImageDeletePromptHeader', 'no').then(function (result) {
								if (result.yes) {
									entity.BlobImageFk = null;
									entity.Imagefilename = null;
									basicsCustomizeInstanceDataService.markItemAsModified(entity);
									basicsCustomizeInstanceDataService.parentService().update().then(function () {
										platformDialogService.showMsgBox('basics.customize.basExternalDesktopTilesImageDeletedMsg', 'basics.customize.basExternamDesktopTilesInfoHeader', 'info');
									});
								}
							});
						}
					}
				};
				columnToAddActionFor.actionList.push(deleteBtn);
			}
		};

		this.createEditConfigurationActionColumnConfiguration = function createEditConfigurationActionColumnConfiguration(property, listConfig) {
			var columnToAddActionFor = this.getColumn(listConfig.columns, property.Name);
			if (columnToAddActionFor) {
				columnToAddActionFor.actionList = columnToAddActionFor.actionList && _.isArray(columnToAddActionFor.actionList) ? columnToAddActionFor.actionList : [];
				columnToAddActionFor.formatter = 'action';
				//usually the action button is only shown when an value is assigned for that specific column
				columnToAddActionFor.forceActionButtonRender = true;
				var translationCRBKey = 'basics.customize.' + property.ActionParam1;
				var translatedCRBKey = $translate.instant(translationCRBKey);
				columnToAddActionFor.name$tr$ = translationCRBKey;
				columnToAddActionFor.name = translatedCRBKey;
				columnToAddActionFor.toolTip = translatedCRBKey;
			}
		};

		this.createEditIndirectCostDetailsActionColumnConfiguration = function createEditIndirectCostDetailsActionColumnConfiguration(property, listConfig) {
			let columnToAddActionFor = this.getColumn(listConfig.columns, property.Name);
			if (columnToAddActionFor) {
				columnToAddActionFor.actionList = columnToAddActionFor.actionList && _.isArray(columnToAddActionFor.actionList) ? columnToAddActionFor.actionList : [];
				columnToAddActionFor.formatter = 'action';
				// usually the action button is only shown when an value is assigned for that specific column
				columnToAddActionFor.forceActionButtonRender = true;
				const translationKey = 'basics.customize.' + property.ActionParam1;
				let translatedKey = $translate.instant(translationKey);
				columnToAddActionFor.name$tr$ = translatedKey;
				columnToAddActionFor.name = translatedKey;
				columnToAddActionFor.toolTip = translatedKey;
				var instanceAction = {
					toolTip: function (entity, field) {
						var toolTipText = $translate.instant('basics.customize.createAccessRightDescriptor');
						if (entity && entity[field] && entity.DescriptionInfo) {
							toolTipText = translatedKey + ' (' + entity.DescriptionInfo.Description + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'tlb-icons ico-settings',
					valueIcon: 'tlb-icons ico-settings',
					callbackFn: function (entity /* , field*/) {
						$injector.get('salesBillingIndirectBalancingService').showIndirectCostsBalancingDetailConfigDialogForCustomize(entity);
					}
				};
				columnToAddActionFor.actionList.push(instanceAction);
			}
		};

		this.createEditEditItemNoConfigActionColumnConfiguration = function createEditEditItemNoConfigActionColumnConfiguration(property, listConfig) {
			let columnToAddActionFor = this.getColumn(listConfig.columns, property.Name);
			if (columnToAddActionFor) {
				columnToAddActionFor.actionList = columnToAddActionFor.actionList && _.isArray(columnToAddActionFor.actionList) ? columnToAddActionFor.actionList : [];
				columnToAddActionFor.formatter = 'action';
				// usually the action button is only shown when an value is assigned for that specific column
				columnToAddActionFor.forceActionButtonRender = true;
				const translationKey = 'basics.customize.' + property.ActionParam1;
				let translatedKey = $translate.instant(translationKey);
				columnToAddActionFor.name$tr$ = translatedKey;
				columnToAddActionFor.name = translatedKey;
				columnToAddActionFor.toolTip = translatedKey;
				var instanceAction = {
					toolTip: function (entity, field) {
						var toolTipText = $translate.instant('basics.customize.createAccessRightDescriptor');
						if (entity && entity[field] && entity.DescriptionInfo) {
							toolTipText = translatedKey + ' (' + entity.DescriptionInfo.Description + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'tlb-icons ico-settings',
					valueIcon: 'tlb-icons ico-settings',
					callbackFn: function (entity /* , field */) {
						$injector.get('salesBillingItemNumberingConfigurationService').showItemNoConfigDialogForCustomize(entity);
					}
				};
				columnToAddActionFor.actionList.push(instanceAction);
			}
		};

		this.createActionColumn = function createActionColumn(property, listConfig) {
			switch (property.Action) {
				case 'AccessRight': self.createAccessRightActionColumnConfiguration(property, listConfig); break;
				case 'LoadIconFile': self.createLoadIconFileActionColumnConfiguration(property, listConfig); break;
				case 'EditConfiguration': self.createEditConfigurationActionColumnConfiguration(property, listConfig); break;
				case 'EditIndirectCostDetails': self.createEditIndirectCostDetailsActionColumnConfiguration(property, listConfig); break;
				case 'EditItemNoConfig': self.createEditEditItemNoConfigActionColumnConfiguration(property, listConfig); break;
			}
		};
	}

})(angular);
