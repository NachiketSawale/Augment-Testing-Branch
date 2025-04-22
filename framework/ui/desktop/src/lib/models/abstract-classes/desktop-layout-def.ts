/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TileGroupDef } from './tile-group-def';

export abstract class DesktopLayoutDef extends TileGroupDef {
	override id!: number;
	name!: string;
}
