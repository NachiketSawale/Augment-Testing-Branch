/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * characteristic data copy options
 */
export interface CharacteristicDataCopyOptions {
	sourceMainItemId: number;
	sourcePKey1?: number;
	sourcePKey2?: number;
	sourcePKey3?: number;
	sourceSectionId: number;
	destMainItemId: number;
	destPKey1?: number;
	destPKey2?: number;
	destPKey3?: number;
	destSectionId: number;
}
