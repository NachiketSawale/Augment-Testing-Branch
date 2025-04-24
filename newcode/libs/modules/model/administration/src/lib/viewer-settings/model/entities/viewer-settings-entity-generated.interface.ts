/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IViewerSettingsEntityGenerated extends IEntityBase {

	readonly Id: number;

	Scope?: string;

	Active?: boolean;

	GradientBackground?: boolean;

	DescriptionInfo: IDescriptionInfo;

	IsDefault: boolean;

	RenderingMode: string;

	StreamingMode: string;

	PreventTimeout: boolean;

	Projection: string;

	DefaultView: string;

	SmoothTransitions: boolean;

	DrawingMode: string;

	AntialiasingMode: string;

	BlockwiseGraphicsUpdate: boolean;

	BackgroundColor: number;

	BackgroundColor2?: number;

	SelectionColor: number;

	SwitchAreaSel: boolean;

	ShowModelName: boolean;

	ShowSelectionInfo: boolean;

	ShowInputOptions: boolean;

	UserFk?: number;

	GroupManipulationOperators: boolean;

	GroupCameraOperators: boolean;

	GroupAnnotationCommands: boolean;

	UomLengthFk?: number;

	UomAreaFk?: number;

	UomVolumeFk?: number;
}
