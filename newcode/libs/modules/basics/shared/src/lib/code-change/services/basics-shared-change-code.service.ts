import { FieldType, FieldValidationInfo, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteIdentification, PlatformConfigurationService, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, IEntityModification, IEntitySelection, IValidationService, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { isEmpty, isNil, get, set, cloneDeep } from 'lodash';

/**
 * Represents an entity with a unique identifier and a code.
 */
export interface IBasicsSharedCodeEntity {
	Id: number;
	Code: string;
}

/**
 * Defines the options required to update the code of an entity within a dialog.
 *
 * @template TEntity - The type of the entity being updated. Must be an object.
 *
 * @property {Translatable} dialogHeader - The header text for the dialog.
 * @property {Translatable} [dialogCodeFieldLabel] - The label for the code field in the dialog. Optional.
 * @property {string} codeField - The property name of the code field in the entity.
 * @property {IEntitySelection<TEntity> & IEntityModification<TEntity>} dataService - The service used for selecting and modifying the entity.
 * @property {IValidationService<TEntity>} validationService - The service used for validating the entity's code field.
 * @property {() => boolean} preShowDialogFn - A function that is called before showing the dialog. Should return `true` to proceed with showing the dialog.
 * @property {() => Promise<void>} saveAndRefreshFn - A function that saves the changes and refreshes the entity. Must return a promise.
 */
export interface IEntityCodeUpdateOptions<TEntity extends object> {
	dialogHeader: Translatable;
	dialogCodeFieldLabel?: Translatable;
	codeField: string;
	dataService: IEntitySelection<TEntity> & IEntityModification<TEntity>;
	validationService: IValidationService<TEntity>;
	preShowDialogFn: () => boolean;
	saveAndRefreshFn: (entity: TEntity) => Promise<void>;
}

//reference old angular: basicsCommonChangeCodeService
//D:\RIB_Dev\d\application\frontend.ngjs\basics\common\services\basics-common-change-code-service.js

/**
 * Service responsible for managing the dialog used for changing the code of an entity.
 * This service encapsulates the logic for validating and updating the code field of an entity
 * through a user interface dialog.
 *
 * @template TEntity - The type of the entity whose code is being updated. Must extend `object`.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedChangeCodeDialogService<TEntity extends object> {
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly dialogService = inject(UiCommonMessageBoxService);
	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);

	private throwIfNotAssigned(options: IEntityCodeUpdateOptions<TEntity>) {
		if (!options) {
			throw new Error('options is not set!');
		}

		if (!options.dataService) {
			throw new Error('options.dataService is not set!');
		}

		if (!options.validationService) {
			throw new Error('options.validationService is not set!');
		}

		if (!options.saveAndRefreshFn) {
			throw new Error('options.saveAndRefreshFn is not registered');
		}
	}

	private evaluate(options: IEntityCodeUpdateOptions<TEntity>): boolean {
		let result = true;

		if (isEmpty(options.codeField) || isNil(options.codeField)) {
			options.codeField = 'Code';
		}

		if (!options.dialogCodeFieldLabel) {
			options.dialogCodeFieldLabel = 'cloud.common.entityCode';
		}

		if (options.preShowDialogFn && !options.preShowDialogFn()) {
			result = false;
		} else if (!options.preShowDialogFn) {
			if (!options.dataService.getSelectedEntity()) {
				this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant(options.dialogHeader).text, 'ico-warning');

				result = false;
			}
		}

		return result;
	}

	/**
	 * Creates default options for the entity code update dialog.
	 *
	 * @template PT - The parent type of the entity, must extend `object`.
	 * @template PU - The unique identification type for the entity, must extend `CompleteIdentification<TEntity>`.
	 * @param {IEntitySelection<TEntity> & IEntityModification<TEntity>} dataSvc - The data service used for selecting and modifying the entity.
	 * @param {IValidationService<TEntity>} validationSvc - The validation service for the entity's code field.
	 * @param {DataServiceFlatRoot<PT, PU>|DataServiceHierarchicalRoot<PT, PU>} rootSvc - The root service, either flat or hierarchical, used for saving and refreshing the entity.
	 * @param {Translatable} dlgHeader - The header text for the dialog.
	 * @param {Translatable} [noEntitySelectedTip] - Optional tip displayed if no entity is selected when attempting to show the dialog.
	 * @param {Translatable} [dlgCodeFieldLabel] - Optional label for the code field in the dialog; defaults to 'Code' if not provided.
	 * @param {string} [codeField='Code'] - The property name of the code field in the entity; defaults to 'Code'.
	 * @returns {IEntityCodeUpdateOptions<TEntity>} The configured options for the entity code update dialog.
	 */
	public createDefaultOptions<PT extends object, PU extends CompleteIdentification<TEntity>>(
		dataSvc: IEntitySelection<TEntity> & IEntityModification<TEntity>,
		validationSvc: IValidationService<TEntity>,
		rootSvc: DataServiceFlatRoot<PT, PU> | DataServiceHierarchicalRoot<PT, PU>,
		dlgHeader: Translatable,
		noEntitySelectedTip?: Translatable,
		dlgCodeFieldLabel?: Translatable,
		codeField?: string,
	): IEntityCodeUpdateOptions<TEntity> {
		const translateSvc = this.translateService;

		return {
			dialogHeader: dlgHeader,
			codeField: codeField ?? 'Code',
			dialogCodeFieldLabel: dlgCodeFieldLabel,
			dataService: dataSvc,
			validationService: validationSvc,
			preShowDialogFn: () => {
				let result = true;
				if (!dataSvc.getSelectedEntity()) {
					result = false;

					if (noEntitySelectedTip) {
						this.messageBoxService.showMsgBox(translateSvc.instant(noEntitySelectedTip).text, translateSvc.instant(dlgHeader).text, 'ico-warning');
					} else {
						this.messageBoxService.showMsgBox(translateSvc.instant('cloud.common.noCurrentSelection').text, translateSvc.instant(dlgHeader).text, 'ico-warning');
					}
				}

				return result;
			},
			saveAndRefreshFn: async (/*entity:TEntity*/) => {
				await rootSvc.save();
				await rootSvc.refreshSelected();
			},
		};
	}

	/**
	 * Shows the dialog for changing the code of an entity.
	 * @param options - The options required for updating the code of an entity.
	 * @returns A promise that resolves to `true` if the operation was successful, otherwise `false`.
	 */
	public async show(options: IEntityCodeUpdateOptions<TEntity>): Promise<boolean> {
		this.throwIfNotAssigned(options);

		if (!this.evaluate(options)) {
			return false;
		}

		const selectedEntity = options.dataService.getSelectedEntity();
		const fieldValue = get(selectedEntity, options.codeField) as unknown as string;

		const entity: IBasicsSharedCodeEntity = {
			Id: 1,
			Code: fieldValue,
		};

		const config: IFormDialogConfig<IBasicsSharedCodeEntity> = {
			headerText: options.dialogHeader,
			formConfiguration: this.generateFormConfig(options),
			customButtons: [],
			entity: entity,
		};

		let ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<IBasicsSharedCodeEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				//todo-mike: check if invalid, do not set modified. and popup dialog to give hint on error.
				//const dataSvc = options.dataService as DataServiceBase<TEntity>;
				//if (!dataSvc.hasValidationErrors()) {
				ret = true;
				const selectedEntity = options.dataService.getSelectedEntity() as TEntity;
				set(selectedEntity, options.codeField, result.value?.Code);
				options.dataService.setModified(selectedEntity);
				await options.saveAndRefreshFn(selectedEntity); //save and refresh.
				//}
			}
		});

		return ret;
	}

	private generateFormConfig(options: IEntityCodeUpdateOptions<TEntity>): IFormConfig<IBasicsSharedCodeEntity> {
		const formRows: FormRow<IBasicsSharedCodeEntity>[] = [
			{
				id: 'code',
				label: options.dialogCodeFieldLabel,
				type: FieldType.Code,
				model: options.codeField,
				validator: async (info: FieldValidationInfo<IBasicsSharedCodeEntity>): Promise<ValidationResult> => {
					//add real validator logic and delegate to selected entity's validator
					const validator = options.validationService.getValidationFunc(options.codeField);
					//it needs a copy of the selected entity, otherwise it will impact the real entity data.
					const selectedEntityCopy = cloneDeep(options.dataService.getSelectedEntity()) as TEntity;
					const entityFieldInfo = new ValidationInfo<TEntity>(selectedEntityCopy, info.value, options.codeField);
					return validator(entityFieldInfo);
				},
				required: true,
			},
		];
		return {
			formId: 'change.code.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}
}
