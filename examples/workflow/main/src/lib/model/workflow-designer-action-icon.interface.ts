/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * provides an object containing icons information for different node actions.
 */
export interface IDesignerActionIcon {
	id: number;
	description: string,
	svgImage: string;
	svgSprite: string;
	svgWarningIcon: string;
	svgErrorIcon: string;
	tooltipActionIcon: string;
	tooltipActionIconId: string;

}