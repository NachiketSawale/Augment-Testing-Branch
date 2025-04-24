import {PrcStructureLookupEntity} from '@libs/basics/shared';

export interface IProcurementStructureSelectionDialogResult {
	isOk: boolean,
	isCancel?: boolean,
	data?: PrcStructureLookupEntity[]
}