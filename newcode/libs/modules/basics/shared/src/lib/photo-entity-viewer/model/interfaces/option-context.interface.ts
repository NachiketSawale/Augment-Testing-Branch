import {Observable} from 'rxjs';
import {Injector} from '@angular/core';

export interface IPhotoEntityViewerContext {
	readonly injector: Injector;
	create: () => void;
	delete: () => void;
	change: () => void;
	canCreate: () => boolean;
	canDelete: () => boolean;
	canChange: () => boolean;
	canCommentEdit: () => boolean;
	openFileDialog: () => Observable<[File, string]>;
	currentFileInfo: {file?: File, blob?: string};
	doImportFile: (file: File) => Promise<{Base64String: string, BlobId: number | null} | { FileArchiveDocId: number } | null>;
	component: object;
}