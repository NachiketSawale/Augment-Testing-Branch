/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export abstract class TileInstance {
	id!: string | number;
	tileSize!: number;
	color!: number;
	opacity!: number;
	sorting!: number;
}
