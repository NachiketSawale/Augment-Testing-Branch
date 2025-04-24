/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { WorkflowDesignerComponent } from '../../components/workflow-designer-container/workflow-designer-container.component';
import { Subscription } from 'rxjs';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { IWorkflowAction } from '@libs/workflow/interfaces';

@Directive({
	selector: '[workflowMainWorkflowDesignerEventListener]'
})

/**
 * WorkflowDesignerEventListenerDirective: Purpose of this directive is to highlight
 * selected action in the designer container by changing CSS properties of its native element.
 */
export class WorkflowDesignerEventListenerDirective {

	private actionTypeId!: number;
	private subscribedAction$: Subscription;
	private readonly actionService = inject(BasicsWorkflowActionDataService);
	private highlightActionFill: string = '#ffbfff';
	private highlightActionStroke: string = '#f0f';


	/**
	 * Highlight the selected action in the designer by subscribing to selectedAction$.
	 * @param element
	 * @param renderer:
	 * @param workflowDesignerComponent : The "generateSvgContent" function will provide the original CSS properties of a node.
	 */
	public constructor(private element: ElementRef, private renderer: Renderer2, private workflowDesignerComponent: WorkflowDesignerComponent) {
		this.subscribedAction$ = this.actionService.selectedAction$.subscribe(selectedAction => {
			if (selectedAction) {
				this.updateSelectedActionNode(selectedAction);
			}
		});
	}

	public ngOnDestroy() {
		if (this.subscribedAction$) {
			this.subscribedAction$.unsubscribe();
		}
	}

	/**
	 * updateSelectedActionNode: Updates the CSS properties of a selected action.
	 * @param selectedAction
	 */
	private updateSelectedActionNode(selectedAction: IWorkflowAction) {
		this.getPreviousNodeAttribute(selectedAction);
		const closestMatch = this.element.nativeElement.closest(`[id="${selectedAction.id.toString()}"]`);
		if (closestMatch) {
			this.renderer.setAttribute(closestMatch, 'fill', this.highlightActionFill);
			this.renderer.setAttribute(closestMatch, 'stroke', this.highlightActionStroke);
		}
	}

	/**
	 * getPreviousNodeAttribute : Ensures that only the selected action is highlighted by
	 * bringing the CSS properties of previous action back to original.
	 * @param selectedAction : current workflow action.
	 */
	private getPreviousNodeAttribute(selectedAction: IWorkflowAction): void {
		const selector = `svg [fill="${this.highlightActionFill}"][stroke="${this.highlightActionStroke}"]`;
		const prevActionElement = document.querySelector(selector);
		const prevActionId = prevActionElement?.getAttribute('id');

		if (prevActionElement && !(prevActionId === selectedAction.id.toString())) {
			const prevActionTypeId = prevActionElement.getAttribute('actionTypeId');
			this.actionTypeId = parseInt(prevActionTypeId!, 10);
			if (prevActionId?.includes('vertical-rect')) {
				this.resetSelectedNode('#333', '#fff');
			}
			const prevNodeAttributes = this.workflowDesignerComponent.generateSvgContent(this.actionTypeId).attribute;
			this.resetSelectedNode(prevNodeAttributes.fill!, prevNodeAttributes.stroke!);
		}
	}

	/**
	 * Resets the previously selected node with its original CSS properties.
	 * @param Prevfill
	 * @param Prevstroke
	 */
	private resetSelectedNode(Prevfill: string, Prevstroke: string) {
		const fill = '#ffbfff';
		const stroke = '#f0f';
		const selector = `svg [fill="${fill}"][stroke="${stroke}"]`;
		const previousNodeElement = document.querySelector(selector);
		if (previousNodeElement) {
			this.renderer.setAttribute(previousNodeElement, 'fill', Prevfill);
			this.renderer.setAttribute(previousNodeElement, 'stroke', Prevstroke);
		}
	}

}
