/*
 * Copyright(c) RIB Software GmbH
 */

import { ColorFormat, prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ModelAdministrationViewerSettingsDataService } from '../services/viewer-settings-data.service';
import { ModelAdministrationViewerSettingsConfigService } from '../services/viewer-settings-config.service';
import { ModelAdministrationViewerSettingsUiService } from '../services/viewer-settings-ui.service';
import { IViewerSettingsEntity } from './entities/viewer-settings-entity.interface';
import { ACCESS_SCOPE_UI_HELPER_TOKEN } from '@libs/basics/interfaces';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import {
	ModelAdministrationViewerSettingsBehavior
} from '../behaviors/viewer-settings-behavior.service';

export const VIEWER_SETTINGS_ENTITY_INFO = EntityInfo.create<IViewerSettingsEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'ViewerSettingsDto'
	},
	permissionUuid: 'f7d7913423cc4bf2824e8f13449ec482',
	grid: {
		legacyId: 'model.administration.viewerSettingsList',
		title: { key: 'model.administration.viewerSettingsListTitle' }
	},
	form: {
		containerUuid: 'befa2d4aad3e40e28202f6d7e4df293b',
		legacyId: 'model.administration.viewerSettingsDetail',
		title: { key: 'model.administration.viewerSettingsDetailTitle' }
	},
	containerBehavior: ctx => ctx.injector.get(ModelAdministrationViewerSettingsBehavior),
	prepareEntityContainer: async ctx => {
		const configSvc = ctx.injector.get(ModelAdministrationViewerSettingsConfigService);
		await configSvc.initConfig();
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationViewerSettingsDataService),
	layoutConfiguration: async ctx => {
		const uiService = ctx.injector.get(ModelAdministrationViewerSettingsUiService);
		const accessScopeUiHelper = await ctx.lazyInjector.inject(ACCESS_SCOPE_UI_HELPER_TOKEN);

		return <ILayoutConfiguration<IViewerSettingsEntity>>{
			groups: [{
				gid: 'baseGroup',
				attributes: ['Scope', 'DescriptionInfo', 'IsDefault', 'Active']
			}, {
				gid: 'Connections',
				attributes: ['RenderingMode', 'StreamingMode', 'PreventTimeout']
			}, {
				gid: 'Camera',
				attributes: ['Projection', 'DefaultView', 'SmoothTransitions']
			}, {
				gid: 'Rendering',
				attributes: ['DrawingMode', 'AntialiasingMode', 'BlockwiseGraphicsUpdate', 'BackgroundColor', 'GradientBackground', 'BackgroundColor2', 'SelectionColor']
			}, {
				gid: 'UoM',
				attributes: ['UomLengthFk', 'UomAreaFk', 'UomVolumeFk']
			}, {
				gid: 'Input',
				attributes: ['SwitchAreaSel']
			}, {
				gid: 'Toolbar',
				attributes: ['GroupManipulationOperators', 'GroupCameraOperators', 'GroupAnnotationCommands']
			}, {
				gid: 'Information',
				attributes: ['ShowModelName', 'ShowSelectionInfo', 'ShowInputOptions']
			}],
			overloads: {
				IsDefault: {
					readonly: true
				},
				Active: {
					readonly: true
				},
				RenderingMode: uiService.configureRenderingModeField({}),
				StreamingMode: uiService.configureStreamingModeField({}),
				DrawingMode: uiService.configureDrawingModeField({}),
				AntialiasingMode: uiService.configureAntiAliasingModeField({}),
				Scope: {
					readonly: true,
					type: FieldType.Select,
					itemsSource: {
						items: accessScopeUiHelper.createSelectItems(false)
					}
				},
				BackgroundColor: {
					format: ColorFormat.ArgbValue
				},
				BackgroundColor2: {
					format: ColorFormat.ArgbValue
				},
				SelectionColor: {
					format: ColorFormat.ArgbValue
				},
				Projection: uiService.configureProjectionModeField({}),
				DefaultView: uiService.configureCameraViewField({})
			},
			labels: {
				...prefixAllTranslationKeys('model.administration.', {
					IsDefault: { key: 'isDefault' },
					Active: { key: 'active' },
					Connections: { key: 'connections' },
					Camera: { key: 'camera' },
					Rendering: { key: 'rendering' },
					UoM: { key: 'uomHeader' },
					Input: { key: 'input' },
					Toolbar: { key: 'toolbar' },
					Information: { key: 'information' },
					Scope: { key: 'scope' },
					RenderingMode: { key: 'renderingMode' },
					StreamingMode: { key: 'streamingMode' },
					PreventTimeout: { key: 'preventTimeout' },
					Projection: { key: 'projection' },
					DefaultView: { key: 'defaultView' },
					SmoothTransitions: { key: 'smoothTransitions' },
					DrawingMode: { key: 'drawingMode' },
					AntialiasingMode: { key: 'antiAliasingMode' },
					BlockwiseGraphicsUpdate: { key: 'blockWiseGraphicsUpdate' },
					BackgroundColor2: { key: 'backgroundColor2' },
					GradientBackground: { key: 'gradientBackground' },
					SwitchAreaSel: { key: 'switchAreaSel' },
					ShowModelName: { key: 'showmodelname' },
					ShowSelectionInfo: { key: 'showSelectionInfo' },
					ShowInputOptions: { key: 'showInputOptions' },
					UomLengthFk: { key: 'uomLength' },
					UomAreaFk: { key: 'uomArea' },
					UomVolumeFk: { key: 'uomVolume' },
					GroupManipulationOperators: { key: 'groupManipOps' },
					GroupCameraOperators: { key: 'groupCamOps' },
					GroupAnnotationCommands: { key: 'groupAnnoCommands' },
					BackgroundColor: { key: 'bgColor' },
					SelectionColor: { key: 'selColor' }
				})
			}
		};
	}
});
