/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationUIConfigurationService
	 * @function
	 * @requires basicsCommonConfigLocationListService, basicsLookupdataConfigGenerator
	 *
	 * @description
	 * The UI configuration service for the model.administration module.
	 */
	angular.module(moduleName).factory('modelAdministrationViewerSettingsUIConfigurationService',
		modelAdministrationViewerSettingsUIConfigurationService);

	modelAdministrationViewerSettingsUIConfigurationService.$inject = ['basicsCommonConfigLocationListService',
		'basicsLookupdataConfigGenerator', 'platformTranslateService',
		'modelViewerHoopsUtilitiesService', 'platformPermissionService', 'permissions',
		'$translate'];

	function modelAdministrationViewerSettingsUIConfigurationService(basicsCommonConfigLocationListService,
		basicsLookupdataConfigGenerator, platformTranslateService,
		modelViewerHoopsUtilitiesService, platformPermissionService, permissions,
		$translate) {

		const service = {};
		const streamingModeOptions = [
			{
				text$tr$: 'model.viewer.hoops.streamingModeFull',
				value: 'f'
			}, {
				text$tr$: 'model.viewer.hoops.streamingModeLazy',
				value: 'l'
			}
		];
		platformTranslateService.translateObject(streamingModeOptions, 'text');
		const renderModeOptions = [
			{
				text$tr$: 'model.viewer.hoops.renderModeServer',
				value: 's'
			}, {
				text$tr$: 'model.viewer.hoops.renderModeClient',
				value: 'c'
			}
		];
		platformTranslateService.translateObject(renderModeOptions, 'text');

		const drawingModeOptions = [
			{
				text$tr$: 'model.viewer.hoops.drawHidden',
				value: 'h'
			}, {
				text$tr$: 'model.viewer.hoops.drawShaded',
				value: 's'
			}, {
				text$tr$: 'model.viewer.hoops.drawWireframe',
				value: 'w'
			}, {
				text$tr$: 'model.viewer.hoops.drawWireframeOnShaded',
				value: 'a'
			}
		];
		platformTranslateService.translateObject(drawingModeOptions, 'text');

		const antiAliasingOptions = [
			{
				text$tr$: 'model.viewer.aaNone',
				value: '-'
			}, {
				text$tr$: 'model.viewer.aaSMAA',
				value: 'smaa'
			}
		];
		platformTranslateService.translateObject(antiAliasingOptions, 'text');

		service.getViewerSettingsContainerLayout = function () {
			return {
				fid: 'model.administration.viewersettings',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['scope', 'descriptioninfo', 'isdefault', 'active']
					},
					{
						'gid': 'Connections',
						'attributes': ['renderingmode', 'streamingmode', 'preventtimeout']
					},
					{
						'gid': 'Camera',
						'attributes': ['projection', 'defaultview', 'smoothtransitions']
					},
					{
						'gid': 'Rendering',
						'attributes': ['drawingmode', 'antialiasingmode', 'blockwisegraphicsupdate', 'backgroundcolor', 'gradientbackground','backgroundcolor2', 'selectioncolor']
					},
					{
						gid: 'UoM',
						attributes: ['uomlengthfk', 'uomareafk', 'uomvolumefk']
					},
					{
						'gid': 'Input',
						'attributes': ['switchareasel']
					},
					{
						gid: 'Toolbar',
						attributes: ['groupmanipulationoperators', 'groupcameraoperators', 'groupannotationcommands']
					},
					{
						'gid': 'Information',
						'attributes': ['showmodelname', 'showselectioninfo', 'showinputoptions']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					scope: {
						readonly: true
					},
					isdefault: {
						readonly: true
					},
					active: {
						readonly: true
					},
					renderingmode: {
						detail: {
							type: 'select',
							options: {
								items: renderModeOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: renderModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							},
							editor: 'select',
							editorOptions: {
								items: renderModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							}
						}
					},
					streamingmode: {
						detail: {
							type: 'select',
							options: {
								items: streamingModeOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: streamingModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							},
							editor: 'select',
							editorOptions: {
								items: streamingModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							}
						}
					},
					drawingmode: {
						detail: {
							type: 'select',
							options: {
								items: drawingModeOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: drawingModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							},
							editor: 'select',
							editorOptions: {
								items: drawingModeOptions,
								valueMember: 'value',
								displayMember: 'text'
							}
						}
					},
					antialiasingmode: {
						detail: {
							type: 'select',
							options: {
								items: antiAliasingOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: antiAliasingOptions,
								valueMember: 'value',
								displayMember: 'text'
							},
							editor: 'select',
							editorOptions: {
								items: antiAliasingOptions,
								valueMember: 'value',
								displayMember: 'text'
							}
						}
					},
					projection: {
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelAdministrationViewerSettingsProjectionIconService'
							}
						},
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelAdministrationViewerSettingsProjectionIconService'
							},
							editor: 'imageselect',
							editorOptions: {
								serviceName: 'modelAdministrationViewerSettingsProjectionIconService'
							}
						}
					},
					defaultview: {
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelAdministrationViewerSettingsDefaultViewIconService'
							}
						},
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelAdministrationViewerSettingsDefaultViewIconService'
							},
							editor: 'imageselect',
							editorOptions: {
								serviceName: 'modelAdministrationViewerSettingsDefaultViewIconService'
							}
						}
					},
					uomlengthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}),
					uomareafk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}),
					uomvolumefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					})
				}
			};
		};

		return service;
	}
})(angular);
