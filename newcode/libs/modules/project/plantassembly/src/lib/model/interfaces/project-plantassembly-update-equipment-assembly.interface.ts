/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the structure for updating equipment assemblies in a project plant assembly.
 */
export interface IProjectPlantAssemblyUpdateEquimentAssemblies {
	/*
	 * UpdateCostCodes
	 */
	UpdateCostCodes?: boolean;
	/*
	 * UpdateMaterials
	 */
	UpdateMaterials?: boolean;
	/*
	 * UpdateAssembly
	 */
	UpdateAssembly?: boolean;
	/*
	 * UpdateMultipliersFrmPlantEstimate
	 */
	UpdateMultipliersFrmPlantEstimate: false;
	/*
	 * SelectUpdateScope
	 */
	SelectUpdateScope?: number;
	/*
	 * noteText
	 */
	NoteText: string;
}
