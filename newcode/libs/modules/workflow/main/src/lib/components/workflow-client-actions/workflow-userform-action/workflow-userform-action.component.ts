/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, ElementRef, inject, Inject } from '@angular/core';
import { WORKFLOW_ACTION_CONTEXT_TOKEN, WORKFLOW_ACTION_INPUT_TOKEN } from '@libs/workflow/shared';
import { ClientActionRows, WorkflowClientAction, IActionParam } from '@libs/workflow/interfaces';
import { BasicsSharedUserFormService, IUserFormDisplayOptions, UserFormDisplayMode } from '@libs/basics/shared';
import { IUserTaskComponent } from '@libs/workflow/interfaces';
import { CustomElementProcessorUtilService } from '../../../services/custom-element-processor-util.service';

@Component({
	selector: 'workflow-main-userform-action',
	templateUrl: './workflow-userform-action.component.html',
	styleUrl: './workflow-userform-action.component.css'
})

/**
 * This class implements userform action dialog.
 */
export class WorkflowUserformActionComponent implements AfterViewInit, IUserTaskComponent {
	/**
	 * Render subtitle for userform dialog.
	 */
	public subtitle: string = '';

	/**
	 * Flag to determine if input property "subtitle" has HTML content or text value.
	 */
	public isHTMLContent: boolean = false;

	private readonly sanitizeContext = inject(CustomElementProcessorUtilService);

	/**
	 *
	 * @param inputDataInfo : input param details of incoming workflow action
	 * @param currentContext : context details of previous action
	 * @param userFormService
	 * @param elementRef
	 */
	public constructor(@Inject(WORKFLOW_ACTION_INPUT_TOKEN) public inputDataInfo: IActionParam[],
		@Inject(WORKFLOW_ACTION_CONTEXT_TOKEN) public currentContext: ClientActionRows,
		private userFormService: BasicsSharedUserFormService,
		private elementRef: ElementRef) {
		this.prepareSubtitle();
	}

	public getComponent(): string {
		return WorkflowClientAction.UserForm;
	}

	/**
	 * Passes the iframe element to displayForm func. once DOM is available.
	 */
	public ngAfterViewInit(): void {
		const iframe = this.elementRef.nativeElement.querySelector('#wfUserForm');
		this.displayForm(this.inputDataInfo, iframe);
	}

	private prepareSubtitle() {
		const subtitleElement = this.inputDataInfo.find(input => input.key === 'Subtitle')?.value;
		if (subtitleElement) {
			this.isHTMLContent = this.isHTML(subtitleElement);
			this.subtitle = this.isHTMLContent ? this.sanitizeContext.processCustomElement(subtitleElement, 'html') : subtitleElement;
		}
	}

	/**
	 *
	 * @param task One of the input parameters of userform action is "FormId":responsible for
	 * getting template url to display the form.
	 * @param iframe reference to native element.
	 * @returns
	 */
	private async displayForm(task: IActionParam[], iframe: HTMLIFrameElement): Promise<string> {
		const formId = task.find(param => param.key === 'FormId')?.value;
		//formId required by IUserFormDisplayOptions is of type number.
		const formIdNew = Number(formId);
		const options: IUserFormDisplayOptions = {
			formId: formIdNew,
			editable: true,
			isReadonly: false,
			modal: true,
			displayMode: UserFormDisplayMode.IFrame,
			iframe: iframe
		};

		try {
			await this.userFormService.show(options);

			return Promise.resolve('Form displayed successfully');
		} catch (error) {
			return Promise.reject(`Failed to display form: ${error}`);
		}
	}
	/**
	 * regex for identifying if a string has html content.
	 * @param str
	 * @returns
	 */
	public isHTML(str: string): boolean {
		const htmlRegex = /<\/?[a-z][\s\S]*>/i;
		return htmlRegex.test(str);
	}
}
