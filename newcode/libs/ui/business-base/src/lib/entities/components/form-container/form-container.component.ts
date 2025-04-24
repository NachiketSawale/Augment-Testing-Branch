/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
	BaseValidationService,
	IEntityCreate, IEntityDataCreateConfiguration,
	IEntityDelete,
	IEntityList,
	IEntityModification,
	IEntitySelection,
	IReadOnlyEntityRuntimeData
} from '@libs/platform/data-access';
import {
	FormComponent,
	IFormConfig,
	IFormValueChangeInfo,
	ReportingPrintService
} from '@libs/ui/common';
import {
	IContainerUiAddOns
} from '@libs/ui/container-system';
import { EntityContainerBaseComponent } from '../entity-container-base/entity-container-base.component';
import { IEntityContainerBehavior } from '../../model/entity-container-link.model';
import { IFormContainerLink } from '../../model/form-container-link.interface';
import {
	UiBusinessBaseEntityContainerMenulistHelperService
} from '../../services/entity-container-menulist-helper.service';
import {
	UiBusinessBaseEntityFormService
} from '../../services/ui-business-base-entity-form.service';

/**
 * The standard form container.
 *
 * This is the standard form container for entities.
 * It is used by default when declaring a form container on an {@link IEntityInfo}, unless a custom component is
 * specifically configured there.
 *
 * The form container automatically attaches itself to the data service and automatically links the form
 * to the selected item.
 */
@Component({
	selector: 'ui-business-base-form-container',
	templateUrl: './form-container.component.html',
	styleUrls: ['./form-container.component.css'],
})
export class FormContainerComponent<T extends object> extends EntityContainerBaseComponent<T> implements OnInit, OnDestroy {

	/**
	 * Printing service.
	 */
	private readonly reportingPrintService = inject(ReportingPrintService);

	/**
	 * element reference.
	 */
	private readonly elementRef = inject(ElementRef);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();

		// It is impossible to access the outer object without a reference.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		this.containerLink = {
			get uuid(): string {
				return that.containerDefinition.uuid;
			},
			get formConfig(): IFormConfig<T> {
				return that.formConfig;
			},
			get uiAddOns(): IContainerUiAddOns {
				return that.uiAddOns;
			},
			get entitySelection(): IEntitySelection<T> {
				return that.entitySelection;
			},
			get entityModification(): IEntityModification<T> | undefined {
				return that.entityModification;
			},
			get entityCreate(): IEntityCreate<T> | undefined {
				return that.entityCreate;
			},
			get entityDataConfiguration(): IEntityDataCreateConfiguration<T>| undefined {
				return that.entityDataConfiguration;
			},
			get entityDelete(): IEntityDelete<T> | undefined {
				return that.entityDelete;
			},
			get entityList(): IEntityList<T> | undefined {
				return that.entityList;
			},
			get entityValidationService(): BaseValidationService<T> | undefined {
				return that.entityValidationService;
			},
			collapseAll() {
				that.formCmp.collapseAll();
			},
			expandAll() {
				that.formCmp.expandAll();
			},
			registerFinalizer(finalizer: () => void) {
				that.registerFinalizer(finalizer);
			},
			registerSubscription(subscription: Subscription) {
				that.registerSubscription(subscription);
			},
			print() {
				const nativeElement= that.elementRef.nativeElement;
				that.reportingPrintService.printForm(nativeElement);
			},
		};

		this.initForm();

		const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
		this.uiAddOns.toolbar.addItems(menulistHelperSvc.createDetailsMenuItems(this.containerLink, this.loadEntitySchema(), this.entityValidationService, this.layout));

		this.customBehavior = inject(this.injectionTokens.getEntityContainerBehaviorToken<IFormContainerLink<T>>());

		const selectionSubscription = this.entitySelection.selectionChanged$.subscribe(selItems => {
			this.currentEntity = selItems[0];
		});
		this.registerFinalizer(() => selectionSubscription.unsubscribe());

		if (this.customBehavior.onCreate) {
			this.customBehavior.onCreate(this.containerLink);
		}
	}

	private readonly containerLink: IFormContainerLink<T>;

	private readonly customBehavior: IEntityContainerBehavior<IFormContainerLink<T>, T>;

	private readonly entityFormService = inject(UiBusinessBaseEntityFormService);

	private readonly layout = inject(this.injectionTokens.layoutConfigurationToken);

	private initForm() {
		const schema = inject(this.injectionTokens.entitySchemaConfiguration);

		this.currentFormConfig = this.entityFormService.generateEntityFormConfig(schema, this.layout, this.entityValidationService);
	}

	public ngOnInit() {
		if (this.customBehavior.onInit) {
			this.customBehavior.onInit(this.containerLink);
		}
	}

	public override ngOnDestroy() {
		if (this.customBehavior.onDestroy) {
			this.customBehavior.onDestroy(this.containerLink);
		}

		super.ngOnDestroy();
	}

	private currentEntity?: T;

	/**
	 * The currently selected record, if any.
	 */
	public get entity(): T | undefined {
		return this.currentEntity;
	}

	/**
	 * A runtime info object for the current record, if available.
	 */
	public get entityRuntimeInfo(): IReadOnlyEntityRuntimeData<T> | undefined {
		return this.currentEntity
			? (this.entityRuntimeDataRegistry?.getEntityReadonlyRuntimeData(this.currentEntity) ?? undefined)
			: undefined;
	}

	private currentFormConfig: IFormConfig<T> = {
		rows: []
	};

	/**
	 * The form configuration used by the container.
	 */
	public get formConfig(): IFormConfig<T> {
		return this.currentFormConfig;
	}

	/**
	 * Notifies the data service that the entity object has been modified.
	 *
	 * @param info An information object about the change.
	 */
	public valueChanged(info: IFormValueChangeInfo<T>) {
		this.entityModification?.setModified(info.entity);
	}

	/**
	 * Indicates whether the entire form should be read-only.
	 */
	public get isFormReadOnly(): boolean {
		return !this.entityModification;
	}

	/**
	 * A reference to the form component in the container.
	 */
	@ViewChild('form', {read: FormComponent})
	public formCmp!: FormComponent<T>;
}
