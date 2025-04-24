/*
 * Copyright(c) RIB Software GmbH
 */

export class PrcStructureLookupEntity {
	public Id!: number;
	public PrcStructureFk?: number | null;
	public MdcContextFk?: number | null;
	public IsLive!: boolean;
	public Code?: string;
	public Description?: string;
	public HasChildren!: boolean;
	public PrcStructureTypeFk!: number;
	public Comment?: string;
	public AllowAssignment!: boolean;
	public ChildItems?: PrcStructureLookupEntity[] | null;
	public IsSelected?: boolean | null;
	public IsExistent!: boolean;
	public ChildCount!: number;
}
