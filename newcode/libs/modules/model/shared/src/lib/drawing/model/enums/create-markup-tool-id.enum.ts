/*
 * Copyright(c) RIB Software GmbH
 */

export enum CreateMarkupToolIdEnum {
	Point = 0,
	Tick = 1,
	Cross = 2,
	Line = 3,
	Arrow = 4,
	Rectangle = 5,
	Ellipse = 6,
	Freehand = 7,
	FreehandArrow = 8,
	Text = 9,
	RectangleHighlighter = 10,
	EllipseHighlighter = 11,
}

export enum MarkupIgeOptionValue {
	DimensionLabels = 'DIMENSION_LABELS',
	ZoomToWidth = 'ZOOM_TO_WIDTH',
	FontScale = 'MARKUP_FONT_SCALE',
	ScreenSpaceDefault = 'MARKUP_SCREEN_SPACE_DEFAULT',
	LineWidthDefault = 'MARKUP_LINE_WIDTH_DEFAULT',
}