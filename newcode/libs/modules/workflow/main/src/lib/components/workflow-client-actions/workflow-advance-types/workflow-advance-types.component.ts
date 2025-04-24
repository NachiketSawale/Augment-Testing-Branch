/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, inject, Injector } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InitializationContext, PlatformHttpService, PlatformModuleManagerService, PlatformModuleNavigationService } from '@libs/platform/common';
import { getCustomDialogDataToken, ICustomDialog } from '@libs/ui/common';
import { CustomElementProcessorUtilService } from '../../../services/custom-element-processor-util.service';
import { WorkflowAdvanceTypes } from '../../../model/enum/workflow-advance-types.enum';
import { UserInputConfig } from '../../../model/user-input-config.interface';
import { WorkflowInstanceService } from '../../../services/workflow-instance/workflow-instance.service';
import { TValue } from '@libs/workflow/interfaces';
import { IModuleEntity } from '@libs/basics/config';
import { WorkflowJsonHelperService } from '@libs/workflow/shared';


/**
 * Mapping between the keys representing types and its respective function.
 */
export type ClickHandlerTuple = { [type: string]: () => void }

@Component({
	selector: 'workflow-main-workflow-advance-types',
	templateUrl: './workflow-advance-types.component.html',
	styleUrls: ['./workflow-advance-types.component.scss'],
})

/**
 * This component class includes the logic for custom types required in workflow-main.
 */
export class WorkflowAdvanceTypesComponent {
	/**
	 * Holds the type of data based on each advance type.
	 * e.g. dynamicElementData holds: url if type is link, documentId if type is documentButton etc.
	 */
	public dynamicElementData: TValue = '';

	/**
	 * Text to be displayed for required custom type.
	 */
	public dynamicDisplayText: string = '';

	/**
	 * Stores the module info based on module Id configuration
	 */
	private currentModule!: IModuleEntity;

	/**
	 * Dynamic html content to be rendered in form dialog if type is label.
	 */
	public labelHtml!: SafeHtml | string;
	private router = inject(Router);
	private readonly injector = inject(Injector);
	private readonly workflowInstanceService = inject(WorkflowInstanceService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly dialogInjectionToken = getCustomDialogDataToken<void, WorkflowAdvanceTypesComponent,void>();
	private readonly dialogWrapper!: ICustomDialog<void, WorkflowAdvanceTypesComponent>;
	private readonly jsonHelperService = inject(WorkflowJsonHelperService);
	private readonly navigationService = inject(PlatformModuleNavigationService);
	private platformModuleManagerService = inject(PlatformModuleManagerService);


	/**
	 * isEscapeHTML decides whether the display content shall be treated as a text or custom html element.
	 */
	public isEscapeHTML!: boolean;

	/**
	 * contains the text/custom element to be rendered as dialog header.
	 */
	public headerText!: string;
	private readonly sanitizeContext = inject(CustomElementProcessorUtilService);


	/**
	 * Configures the types to its respective function.
	 */
	public typeHandlers: { [key: string]: () => void } = {
		'link': () => this.handleLink(),
		'documentButton': () => this.displayText(),
		'entityLink': () => this.displayText(),
		'label': () => this.handleLabel(),
		'divider': () => undefined,
		'space': () => undefined,
		'workflowButton': () => this.displayText(),
		'title': () => this.handleTitle(),
		'wizardButton': () => this.displayText()
	};

	private clickEventFuncHandler: ClickHandlerTuple = {
		[WorkflowAdvanceTypes.DocumentButton]: this.documentButtonHandler.bind(this),
		[WorkflowAdvanceTypes.EntityLink]: this.entityLinkHandler.bind(this),
		[WorkflowAdvanceTypes.WorkflowButton]: this.workflowButtonHandler.bind(this),
		[WorkflowAdvanceTypes.WizardButton]: this.wizardButtonHandler.bind(this)
	};

	/**
	 * Executes the function bind to specific type property of configInfo
	 * @param configInfo : holds currently selected config type object.
	 * @param sanitizer :
	 */
	public constructor(@Inject('inputData') public configInfo: UserInputConfig, private sanitizer: DomSanitizer) {
		if (this.typeHandlers[this.configInfo.type]) {
			this.typeHandlers[this.configInfo.type]();
			if(!configInfo.isTaskSidebarContainer){
				this.dialogWrapper = inject(this.dialogInjectionToken);
			}
		}
	}

	private handleTitle(): void {
		const displayText = this.configInfo.options?.['displayText'] as string;
		const isEscapeHTML = this.configInfo.options?.['escapeHtml'] as boolean;
		if (isEscapeHTML && this.dialogWrapper) {
			this.dialogWrapper.headerText = displayText;
		} else {
			const safeHTML = this.sanitizeContext.processCustomElement(displayText, 'html');
			const spanElement = document.getElementsByClassName('modal-title')[0];
			if (spanElement && spanElement.parentNode?.parentNode?.nodeName === 'UI-COMMON-MODAL-HEADER') {
				spanElement.innerHTML = safeHTML!;
			}
		}
	}

	private handleLink(): void {
		this.dynamicElementData = (this.configInfo.options?.['url'] || '') as string;
		this.dynamicDisplayText = (this.configInfo.options?.['displayText'] || '') as string;
	}

	private displayText(): void {
		this.dynamicDisplayText = (this.configInfo.options?.['displayText'] || '') as string;
	}

	private getFileExtension(url: string): string {
		const match = url.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
		return match ? match[1].toLowerCase() : '';
	}

	private handleLabel(): void {
		this.dynamicElementData = this.configInfo.options?.['escapeHtml'] as boolean;
		this.dynamicDisplayText = (this.configInfo.options?.['displayText'] || '') as string;

		if (this.dynamicElementData) {
			this.labelHtml = this.dynamicDisplayText;
		} else {
			this.labelHtml = this.sanitizer.bypassSecurityTrustHtml(this.dynamicDisplayText);
		}
	}

	/**
	 * A parent function to execute type specific logic.
	 * @param type :type of the current config object.
	 */
	public onElementClick(type: string): void {
		const onClickEventHandler = this.clickEventFuncHandler[type as WorkflowAdvanceTypes];
		if (typeof onClickEventHandler === 'function') {
			onClickEventHandler();
		} else {
			console.error(`No handler func found for type: ${type}`);
		}
	}

	private documentButtonHandler(): void {
		const isSingleDocument = (this.configInfo.options?.['typeSelectedMode']) as number;
		if (isSingleDocument === 1) {

			this.dynamicElementData = (this.configInfo.options?.['documentId'] || '') as string;
			const endPoint: string = 'basics/common/document/preview';
			const httpReq = {
				params: { fileArchiveDocId: this.dynamicElementData }, responseType: 'text' as 'json'
			};
			this.httpService.get<string>(endPoint, httpReq).then((response) => {
				if (response) {
					const fileExtension = this.getFileExtension(response);
					const modelFileExtensions = ['dwg', 'rvt', 'CAD'];
					if (!modelFileExtensions.includes(fileExtension.toLowerCase())) {
						window.open(response, '_target');
					}
				}

			});
		} else {
			return;
		}
	}

	private entityLinkHandler(): void {
		const moduleName = this.configInfo.options?.['moduleName'] as string;
		const navigationService = inject(PlatformModuleNavigationService);
		navigationService.navigate({ internalModuleName: moduleName, entityIdentifications: [] });
	}

	private workflowButtonHandler(): void {
		this.dynamicElementData = this.configInfo?.options?.['templateId'] as number;
		const context = this.configInfo?.options?.['startContext'];

		if (this.dynamicElementData) {
			if (context && typeof context === 'string' && context.trim().length > 0) {
				this.jsonHelperService.parseDeep(context);

			} else if (typeof context === 'object' && context != null) {
				const updatedContextString = JSON.stringify({ ...context, currentModuleName: 'basics.workflow' });
				this.workflowInstanceService.startWorkflow(this.dynamicElementData, undefined, updatedContextString);
			}
		}
	}

	/**
	 * Function to execute module specific sidebar wizard.
	 */
	private async wizardButtonHandler(): Promise<void> {
		const options = this.configInfo.options;
		const { entityId, moduleId, wizardUUID } = {
			entityId: Number(options?.['entity']),
			moduleId: Number(options?.['module']),
			wizardUUID: options?.['wizard'] as string
		};
		const _targetModule = await this.getModuleInfoById(moduleId);
		const internalModuleName = _targetModule?.InternalName as string;
		if (internalModuleName) {
			await this.navigationService.navigate({ internalModuleName: internalModuleName, entityIdentifications: [{ id: entityId ? entityId : 0 }] }).then(response => {
				if (response) {
					const wizard = this.platformModuleManagerService.findWizardByGuid(wizardUUID.toLowerCase());
					if (wizard && this.dialogWrapper) {
						const initContext = new InitializationContext(this.injector);
						wizard.execute(initContext);
						this.dialogWrapper.close();
					}
				}
			});
		}
	}

	/**
	 * function to provide module entity info based module property value
	 * inside wizardButton type.
	 * @param moduleId
	 * @returns
	 */
	private async getModuleInfoById(moduleId: number): Promise<IModuleEntity | undefined> {
		if (moduleId) {
			const moduleList = await this.httpService.get<IModuleEntity[]>('cloud/common/module/lookup');
			const currentModule = moduleList.find(m => m.Id === moduleId);
			if (currentModule) {
				return currentModule;
			}

		}
		return undefined;
	}

}
