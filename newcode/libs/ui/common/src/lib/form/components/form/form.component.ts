/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Component,
	EventEmitter,
	inject,
	Injector,
	Input,
	Output,
	QueryList,
	ViewChildren,
	ViewContainerRef
} from '@angular/core';

import {
	IReadOnlyPropertyAccessor,
	isPropertyAccessor,
	isReadOnlyPropertyAccessor,
	PropertyPathAccessor,
	PropertyType,
	IEntityContext
} from '@libs/platform/common';

import { FormRow, IFormConfig } from '../../model/form-config.interface';
import { IField } from '../../../model/fields/field.interface';
import { DomainControlInfoService } from '../../../domain-controls/services/domain-control-info.service';
import {
	IReadOnlyEntityRuntimeData,
	ValidationResult
} from '@libs/platform/data-access';
import { IAccordionItem } from '../../../accordion/model/interfaces/accordion-item.interface';
import { FormSectionComponent } from '../form-section/form-section.component';
import { FormRowInfo } from '../../model/internal/form-row-info.class';
import { FormGroupInfo } from '../../model/internal/form-group-info.class';
import { IFieldValueChangeInfo } from '../../../model/fields/field-value-change-info.interface';
import { UiFieldHelperService } from '../../../services/ui-field-helper.service';
import { FormDisplayMode } from '../../model/form-display-mode.enum';
import { IFormValueChangeInfo } from '../../model/form-value-change-info.interface';
import { ControlContextBase } from '../../../domain-controls/model/control-context-base.class';
import { FieldValidator } from '../../../model/fields';

export class FormControlContext<T extends object, P extends PropertyType = PropertyType> extends ControlContextBase<P, T> {

	/**
	 * Initializes a new instance and establishes access to the underlying field,
	 * depending on the {@link IField.model} property.
	 *
	 * @param owner The form in which this context object is used.
	 * @param row The row definition.
	 * @param entityContext A context object that provides some information on the entity object.
	 */
	public constructor(
		private readonly owner: FormComponent<T>,
		private readonly row: IField<T, P>,
		public readonly entityContext: IEntityContext<T>
	) {
		super();

		if (isReadOnlyPropertyAccessor(row.model)) {
			this.valueAccessor = row.model;
			this.alwaysReadOnly = !isPropertyAccessor(this.valueAccessor);
		} else if (row.model) {
			this.valueAccessor = new PropertyPathAccessor(row.model);
			this.alwaysReadOnly = false;
		} else {
			this.valueAccessor = {
				getValue(): P | undefined {
					return undefined;
				}
			};
			this.alwaysReadOnly = true;
		}
	}

	/**
	 * Indicates whether the row is permanently read-only due to its value accessor.
	 */
	private readonly alwaysReadOnly: boolean;

	/**
	 * Wraps the access to the actual field. Depending on the row definition,
	 * this might also be an object that returns a constant value or that
	 * retrieves its data from another source.
	 */
	private readonly valueAccessor: IReadOnlyPropertyAccessor<T, P>;

	protected override get internalValue(): P | undefined {
		if (this.owner.entity) {
			return this.valueAccessor.getValue(this.owner.entity);
		}
		return undefined;
	}

	protected override set internalValue(v: P | undefined) {
		if (this.owner.entity) {
			if (isPropertyAccessor<T, P>(this.valueAccessor)) {
				const changeInfo: IFieldValueChangeInfo<T, P> = {
					oldValue: this.valueAccessor.getValue(this.owner.entity),
					newValue: v,
					field: this.row,
					entity: this.owner.entity
				};

				if (this.row.changing && changeInfo) {
					this.row.changing(changeInfo);
				}

				this.valueAccessor.setValue(this.owner.entity, v);

				this.owner.valueChanged.next({
					oldValue: changeInfo.oldValue,
					newValue: changeInfo.newValue,
					rowId: changeInfo.field.id,
					entity: changeInfo.entity
				});

				if (this.row.change && changeInfo) {
					this.row.change(changeInfo);
				}
			}
		}
	}

	protected override canSetValue(): boolean {
		if (this.owner.entity) {
			if (isPropertyAccessor<T, P>(this.valueAccessor)) {
				return super.canSetValue();
			} else {
				throw new Error('FormControlContext: valueAccessor can\'t be used to assign new value');
			}
		}

		return false;
	}

	protected override getValidator(): FieldValidator<T> | undefined {
		return this.row.validator;
	}

	public get entity(): T | undefined {
		return this.owner.entity;
	}

	public override get fieldId(): string {
		return this.row.id;
	}

	public override get readonly(): boolean {
		if (this.alwaysReadOnly || this.row.readonly || this.owner.preventEditing) {
			return true;
		}

		if (this.owner.entityRuntimeData) {
			if (this.owner.entityRuntimeData.entityIsReadOnly) {
				return true;
			}

			if (typeof this.row.model === 'string') {
				const roRecord = this.owner.entityRuntimeData.readOnlyFields.find(ro => ro.field === this.row.model);
				if (roRecord) {
					return roRecord.readOnly;
				}
			}
		}

		return !this.owner.entity;
	}

	protected override get internalValidationResults(): ValidationResult[] {
		if (this.owner.entityRuntimeData) {
			if (typeof this.row.model === 'string') {
				const vrRecord = this.owner.entityRuntimeData.validationResults.find(vr => vr.field === this.row.model);
				if (vrRecord) {
					return [vrRecord.result];
				}
			}
		}

		return [];
	}

	[key: string]: unknown | undefined;
}

// This parameter is indeed used in the class.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FormControlContextMap<T extends object> {
	[rid: string | number]: FormRowInfo<T>;
}

class FormEntityContext<T extends object> implements IEntityContext<T> {

	public constructor(private readonly owner: FormComponent<T>) {
	}

	public get entity(): T | undefined {
		return this.owner.entity;
	}

	public readonly totalCount: number = 1;

	public get indexInSet(): number | undefined {
		return this.owner.entity ? 0 : undefined;
	}
}

/**
 * Displays input controls based on an {@link IFormConfig} object.
 *
 * @group Form Generator
 */
@Component({
	selector: 'ui-common-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent<T extends object> {

	/**
	 * Initializes a new instance.
	 * @param {Injector} injector The injector.
	 * @param {DomainControlInfoService} domainControlInfoSvc The domain control info service.
	 */
	public constructor(
		private readonly injector: Injector,
		private readonly domainControlInfoSvc: DomainControlInfoService
	) {
	}

	private readonly uiFieldHelperSvc = inject(UiFieldHelperService);

	/**
	 * Gets or sets the display mode of the form.
	 */
	@Input()
	public displayMode: FormDisplayMode = FormDisplayMode.TwoColumns;

	/**
	 * Returns the CSS class name for the current {@link displayMode}.
	 */
	public get displayModeClass(): string {
		switch (this.displayMode) {
			case FormDisplayMode.Narrow:
				return 'form-display-narrow';
			default:
				return 'form-display-two-columns';
		}
	}

	private _entity?: T;

	private readonly entityContext = new FormEntityContext(this);

	/**
	 * Sets the entity object to edit in the form.
	 * @param value The new entity object.
	 */
	@Input()
	public set entity(value: T | undefined) {
		this._entity = value;
		this.contextInfo.entity = value;
	}

	/**
	 * Gets the entity object to edit in the form.
	 */
	public get entity(): T | undefined {
		return this._entity;
	}

	private _entityRuntimeData?: IReadOnlyEntityRuntimeData<T>;

	/**
	 * Sets an optional object that contains runtime data (e.g. the state) of the entity object being edited.
	 * @param value The runtime data object.
	 */
	@Input()
	public set entityRuntimeData(value: IReadOnlyEntityRuntimeData<T> | undefined) {
		this._entityRuntimeData = value;
	}

	/**
	 * Gets an optional object that contains runtime data (e.g. the state) of the entity object being edited.
	 */
	public get entityRuntimeData(): IReadOnlyEntityRuntimeData<T> | undefined {
		return this._entityRuntimeData;
	}

	private currentFormConfig?: IFormConfig<T>;

	private groupExpansionState: {
		[groupId: string | number]: boolean;
	} = {};

	/**
	 * Gets or sets the form configuration object that defines which controls to show in the form.
	 */
	@Input()
	public set formConfig(value: IFormConfig<T> | undefined) {
		if (this.currentFormConfig !== value) {
			this.groupExpansionState = {};
			this.currentFormConfig = value;
		}
	}

	public get formConfig(): IFormConfig<T> | undefined {
		return this.currentFormConfig;
	}

	/**
	 * Indicates whether the form is grouped.
	 */
	public get isGrouped(): boolean {
		return Boolean(this.formConfig?.showGrouping && this.formConfig?.groups);
	}

	/**
	 * Returns the accordion items that represent the groups of the form.
	 */
	public get groups(): IAccordionItem[] {
		if (!this.isGrouped) {
			return [];
		}

		return this.formConfig!.groups!.map(g => {
			return {
				id: g.groupId,
				title: g.header ?? '',
				expanded: this.groupExpansionState[g.groupId] ?? g.open,
				children: [{
					id: 'form-section',
					component: FormSectionComponent,
					providers: [{
						provide: FormGroupInfo,
						useValue: new FormGroupInfo(g, this)
					}]
				}]
			};
		});
	}

	/**
	 * Reacts to the expansion event of a collapsible group.
	 *
	 * @param item The accordion item representing the group that was expanded.
	 */
	public groupExpanded(item: IAccordionItem) {
		this.groupExpansionState[item.id] = true;
	}

	/**
	 * Reacts to the collapsation of a collapsible group.
	 *
	 * @param item The accordion item representing the group that was collapsed.
	 */
	public groupCollapsed(item: IAccordionItem) {
		this.groupExpansionState[item.id] = false;
	}

	/**
	 * Expands all collapsible groups in the form.
	 */
	public expandAll() {
		const groups = this.currentFormConfig?.groups;
		if (!groups || groups.length <= 0) {
			return;
		}

		for (const grp of groups) {
			this.groupExpansionState[grp.groupId] = true;
		}
	}

	/**
	 * Collapses all collapsible groups in the form.
	 */
	public collapseAll() {
		const groups = this.currentFormConfig?.groups;
		if (!groups || groups.length <= 0) {
			return;
		}

		for (const grp of groups) {
			this.groupExpansionState[grp.groupId] = false;
		}
	}

	/**
	 * Returns the component type to use for a form without grouping.
	 */
	public plainFormType: typeof FormSectionComponent = FormSectionComponent;

	private plainFormGroup?: FormGroupInfo<T>;

	private _plainFormInjector?: Injector;

	/**
	 * Provides an injector that can be used to generate a form without grouping.
	 */
	public get plainFormInjector(): Injector {
		if (!this.plainFormGroup) {
			this.plainFormGroup = new FormGroupInfo(null, this);
		}

		if (!this._plainFormInjector) {
			this._plainFormInjector = Injector.create({
				providers: [{
					provide: FormGroupInfo,
					useValue: this.plainFormGroup
				}],
				parent: this.injector
			});
		}

		return this._plainFormInjector;
	}

	/**
	 * A set of links to the form components.
	 * Reserved for internal use by the template.
	 */
	@ViewChildren('formCtl', { read: ViewContainerRef })
	public inputControls!: QueryList<ViewContainerRef>;

	private readonly contextInfo: {
		entity: unknown
	} = {
		entity: null
	};

	private createContextForRow(row: IField<T>): FormControlContext<T> {
		const rowContext = new FormControlContext(this, row, this.entityContext);

		const rowData = row as unknown as {
			[key: string]: unknown
		};

		for (const additionalField of this.domainControlInfoSvc.getAdditionalConfigFields(row.type)) {
			if (Object.prototype.hasOwnProperty.call(rowData, additionalField)) {
				rowContext[additionalField] = rowData[additionalField];
			}
		}
		return rowContext;
	}

	private readonly rowContexts = new FormControlContextMap<T>();

	private getControlContextForRow(row: FormRow<T>): FormRowInfo<T> {
		let rowInfo = this.rowContexts[row.id];
		if (!rowInfo) {
			rowInfo = new FormRowInfo(row, this.createContextForRow(row));
			this.rowContexts[row.id] = rowInfo;
		}
		return rowInfo;
	}

	public getAllFormRows(): FormRowInfo<T>[] {
		if (!this.formConfig) {
			return [];
		}

		const result: FormRowInfo<T>[] = [];

		const sortedRows = this.uiFieldHelperSvc.sortFields<T, FormRow<T>>(this.formConfig.rows);

		for (const row of sortedRows) {
			const rowInfo = this.getControlContextForRow(row);
			result.push(rowInfo);
		}

		return result;
	}

	public getFormRowsByGroup(groupId: string | number): FormRowInfo<T>[] {
		if (!this.formConfig) {
			return [];
		}

		const result: FormRowInfo<T>[] = [];

		const groupRows = this.formConfig.rows.filter(r => r.groupId === groupId);
		const sortedGroupRows = this.uiFieldHelperSvc.sortFields<T, FormRow<T>>(groupRows);
		for (const row of sortedGroupRows) {
			const rowInfo = this.getControlContextForRow(row);
			result.push(rowInfo);
		}

		return result;
	}

	/**
	 * An event that is fired when any of the values in the form have changed.
	 */
	@Output()
	public readonly valueChanged = new EventEmitter<IFormValueChangeInfo<T>>();

	/**
	 * Gets or sets a value that indicates whether editing in the form is completely prevented.
	 * If set to `true`, all input controls will be disabled.
	 */
	@Input()
	public preventEditing = false;
}
