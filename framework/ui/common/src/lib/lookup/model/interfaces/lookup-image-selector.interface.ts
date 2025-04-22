/*
 * Copyright(c) RIB Software GmbH
 */

import {ILookupContext} from './lookup-context.interface';

/**
 * Lookup image icon type enum
 */
export enum LookupImageIconType {
	Css = 'css',
	Svg = 'svg',
	Url = 'url'
}

/**
 * Lookup svg background color type enum
 */
export enum LookupSvgBgColorType {
	Dec = 'dec',
	Hex = 'hex',
	String = 'string'
}

/**
 * Image selector interface for lookup input UI
 */
export interface ILookupImageSelector<TItem extends object, TEntity extends object> {

	/**
	 * Additional svg configuration
	 */
	svgConfig?: {
		backgroundColor: string | number,
		backgroundColorType: LookupSvgBgColorType,
		backgroundColorLayer: number[]
	}

	/**
	 * Get icon source which could be css class, svg and url
	 * @param item
	 * @param context
	 */
	select(item: TItem, context: ILookupContext<TItem, TEntity>): string;

	/**
	 * Get icon type which affects how to apply value from select method, default is url
	 * Todo - string is for history code, will be removed finally
	 */
	getIconType?(): LookupImageIconType | string;
}