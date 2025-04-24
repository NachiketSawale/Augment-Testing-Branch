/*
 * Copyright(c) RIB Software GmbH
 */

export { IDialogOptions } from './model/interfaces/dialog-options.interface';
export { IEditorDialogOptions } from './model/interfaces/editor-dialog-options.interface';
export { ICustomDialogOptions } from './model/interfaces/custom-dialog-options.interface';

export { IDialog } from './model/interfaces/dialog.interface';
export { IEditorDialog } from './model/interfaces/editor-dialog.interface';
export * from './model/interfaces/custom-dialog.interface';

export { IDialogDetails } from './model/interfaces/dialog-details.interface';

export { UiCommonDialogService } from './services/dialog.service';
export { IDialogButtonBase } from './model/interfaces/dialog-button-base.interface';
export * from './model/enums/standard-dialog-button-id.enum';
export * from './model/interfaces/button-info.interface';
export * from './model/interfaces/dialog-event-info.interface';
export * from './model/interfaces/dialog-button-event-info.interface';
export * from './model/interfaces/closing-dialog-event-info.interface';
export * from './model/interfaces/closing-dialog-button-event-info.interface';
export { IDialogResult } from './model/interfaces/dialog-result.interface';
export { IEditorDialogResult } from './model/interfaces/editor-dialog-result.interface';

export * from './model/dialog-setting-func.type';
export { DialogButtonEventHandlerFunc } from './model/dialog-button-event-handler-func.type';

export { IDialogDoNotShowAgain } from './model/interfaces/dialog-do-not-showagain.interface';

// details area
export * from './model/enums/dialog-details-type.enum';
export * from './model/interfaces/dialog-detail-options-extension.interface';
export * from './model/interfaces/dialog-detail-options.type';