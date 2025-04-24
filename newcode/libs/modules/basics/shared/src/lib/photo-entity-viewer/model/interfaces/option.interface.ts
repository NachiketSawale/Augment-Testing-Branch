import {IPhotoEntityViewerContext} from './option-context.interface';
import {IEntityBase, IEntityIdentification} from '@libs/platform/common';
import {IEntityProcessor} from '@libs/platform/data-access';

export interface IPhotoEntityViewerOption {
	// common
	/**
	 * true - it means the blob content is loaded according to the fk field like BlobFk in entity Contact Photo is gotten when Contact Photo is from backend. Take BP_MAIN_CONTACT_PHOTO_CONTAINER_INFO for example.
	 * false - it means the blob content is not loaded until it needs to show it in UI, like lazy loaded. Take MATERIAL_PREVIEW_CONTAINER_DEFINITION for example.
	 */
	isSyncMode?: boolean;
	isSingle?: boolean; // => replace hasMultiple in angularjs: platformFileUtilServiceFactory
	hideChangeItem?: boolean; // => replace hideToolbarButtons in angularjs: platformFileUtilServiceFactory
	hideCreateEntity?: boolean; // => replace hideToolbarButtons in angularjs: platformFileUtilServiceFactory
	hideDeleteEntity?: boolean; // => replace hideToolbarButtons in angularjs: platformFileUtilServiceFactory
	canCreate?: (context?: IPhotoEntityViewerContext) => boolean;
	canDelete?: (context?: IPhotoEntityViewerContext) => boolean;
	canChange?: (context?: IPhotoEntityViewerContext) => boolean;

	// sync mode options
	// configurations in angularjs: basicsCommonPhotoControllerBase
	imageField?: string;
	commentField?: string;
	hasCommentTextField?: boolean;
	getParentStatusIsReadonly?: () => boolean;
	create?: (context?: IPhotoEntityViewerContext) => void;
	delete?: (context?: IPhotoEntityViewerContext) => void;
	change?: (context?: IPhotoEntityViewerContext) => void;
	canCommentEdit?: (context?: IPhotoEntityViewerContext) => boolean;

	// async mode options
	// configurations in angularjs: platformFileUtilServiceFactory or platformFileUtilControllerFactory
	blobFieldName?: string; // => replace fileFkName in angularjs: platformFileUtilServiceFactory
	dtoName?: string;
	standAlone?: boolean;
	storeInFileArchive?: boolean;
	getUrl?: string;
	deleteUrl?: string;
	importUrl?: string;
	getDocIdUrl?: string; // => replace getDocId in angularjs: platformFileUtilServiceFactory
	doImportFile?: (file: File, context?: IPhotoEntityViewerContext) => Promise<{Base64String: string, BlobId: number | null} | { FileArchiveDocId: number } | null>;
	doGetFile?: (id?: number, context?: IPhotoEntityViewerContext) => Promise<string>;
	doDeleteFile?: (fileEntity: IEntityIdentification, context?: IPhotoEntityViewerContext) => Promise<void>;
	isButtonDisabled?: () => boolean;
	getSelectedSuperEntity?: () => (IEntityIdentification & IEntityBase) | null;
	getSuperEntityId?: () => number;
	processors?: IEntityProcessor<IEntityIdentification>[];
}