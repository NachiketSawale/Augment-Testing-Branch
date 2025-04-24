import { IPrcPackageImportEntityGenerated } from './prc-package-import-entity-generated.interface';
import { IPrcPackageImportDialogEntity } from './prc-package-import-dialog-entity.interface';

export interface IPrcPackageImportEntity extends IPrcPackageImportEntityGenerated {
	WarningMessage: string;
	InsertTime?: Date;
	PrcPackageImportDialogEntity: IPrcPackageImportDialogEntity[];
}
