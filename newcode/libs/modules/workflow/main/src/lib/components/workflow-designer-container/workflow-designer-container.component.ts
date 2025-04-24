/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ViewEncapsulation, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Edge, NodeDimension, NodePosition } from '@swimlane/ngx-graph';
import { ICustomNode } from '../../model/custom-node.interface';
import { IWorkflowSVGContent } from '../../model/workflow-designer-svg-content.interface';
import { Subject, Subscription } from 'rxjs';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { WorkflowDesignerCustomLayout } from '../../external/workflow-designer-custom-layout';
import { stepRound } from '../../external/workflow-designer-custom-step-curve.ts';
import {
	IMenuItem,
	ItemType,
	CloudDesktopSvgIconService,
	UiCommonMessageBoxService,
	IYesNoDialogOptions,
	IDropdownBtnMenuItem, ConcreteMenuItem, ISimpleMenuItem
} from '@libs/ui/common';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { IActionParam, IWorkflowAction, IWorkflowActionDefinition, IWorkflowTemplateVersion, IWorkflowTransition, WorkflowActionType } from '@libs/workflow/interfaces';
import { WorkflowDesignerActions } from '../../constants/workflow-designer-actions.class';
import { PlatformTranslateService } from '@libs/platform/common';
import { IWorkflowSVGAttribute } from '../../model/workflow-designer-svg-attribute.interface';
import { WorkflowTemplateVersionDataService } from '../../services/workflow-template-version-data/workflow-template-version-data.service';
import { WorkflowValidationService } from '../../services/workflow-validation/workflow-validation.service';
import { ActionValidationResult } from '../../model/classes/action-validation-result.class';
import { IUserInputConfig } from '../../model/user-input-config.interface';

/**
 * To load the Workflow Designer based on selected template version
 */
@Component({
	selector: 'workflow-main-itwo40-workflow-designer',
	templateUrl: './workflow-designer-container.component.html',
	styleUrls: ['./workflow-designer-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WorkflowDesignerComponent extends ContainerBaseComponent implements OnDestroy, AfterViewInit {
	/**
	 * Stores the custom nodes for workflow designer graph
	 */
	public nodes: ICustomNode[] = [];
	/**
	 * Stores the links between each custom node in workflow designer graph
	 */
	public links: Edge[] = [];
	/**
	 *  A subscription to store the content of the workflow designer (used for cleanup when component is destroyed)
	 */
	private designerContent$!: Subscription;

	/**
	 * Subject used to update graph
	 */
	public update$: Subject<boolean> = new Subject();

	/**
	 * Applies the custom node positioning using custom Dagre logic.
	 */
	public layout = new WorkflowDesignerCustomLayout();

	/**
	 * Applies the curve to the edges.
	 */
	public curve = stepRound;

	//private readonly templateService: BasicsWorkflowTemplateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly actionService: BasicsWorkflowActionDataService = inject(BasicsWorkflowActionDataService);
	private readonly iconService = inject(CloudDesktopSvgIconService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly templateVersionService = inject(WorkflowTemplateVersionDataService);
	private readonly workflowValidationService = inject(WorkflowValidationService);
	private readonly actionTypeFactory = new WorkflowDesignerActions;

	/**
	 * contains all workflow actions of a selected template version.
	 */
	private actionsInTemplateVersion!: IWorkflowAction;

	/**
	 *is current template version read-only?
	 */
	private isVersionReadOnly!: boolean;

	/**
	 * The current selected action in the designer.
	 */
	private selectedAction!: IWorkflowAction | null;

	/**
	 * holds the copied action
	 */
	private copiedAction !: IWorkflowAction;

	/**
	 * Loads the designer service and uiAddOns.
	 */
	public constructor() {
		super();

		this.actionService.allActions$.subscribe((actions) => {
			this.updateTools(actions);
		});
	}

	private defaultPosition: NodePosition = {
		x: 70,
		y: 50
	};

	private defaultDimension: NodeDimension = {
		width: 0,
		height: 50
	};

	private loadDesignerData(): void {
		this.designerContent$ = this.templateVersionService.selectionChanged$.subscribe(async (workflowTemplateVersions: IWorkflowTemplateVersion[]) => {
			if (workflowTemplateVersions.length === 0) {
				this.clearGraphData();
				this.selectAction(null);
				return;
			}
			await this.workflowValidationService.validateVersion(workflowTemplateVersions[0]);

			this.isVersionReadOnly = workflowTemplateVersions[0].IsReadOnly;

			if (typeof (workflowTemplateVersions[0].WorkflowAction) === 'string') {
				workflowTemplateVersions[0].WorkflowAction = JSON.parse(workflowTemplateVersions[0].WorkflowAction as string) as IWorkflowAction;
			}
			this.actionsInTemplateVersion = workflowTemplateVersions[0].WorkflowAction;
			//Selecting the first workflow action by default
			this.selectAction(this.actionsInTemplateVersion);
			this.drawGraphFromActions();
		});
	}

	private drawGraphFromActions() {
		this.clearGraphData();
		const nodeTree = this.prepareNodeTree(this.actionsInTemplateVersion, 0, this.defaultPosition, this.defaultDimension, 0, true);
		this.prepareNodesFromTree(nodeTree);
		this.update$.next(true);
	}

	/**
	 * The separation between each rank.
	 */
	private rankSep: number = 188;
	/**
	 * The separation between each action.
	 */
	private nodeSep: number = 180;

	/**
	 *
	 * @param previousNodePosition Position of the action that is rendered before the current action.
	 * @param previousNodeDimensions Dimensions of the action that is rendered before the currenti action.
	 * @param transitionLevel The current level of action
	 * @param maxYDepthOfNextNode The maximum y axis depth of next formula node
	 * @param isFirst
	 * @returns
	 */
	private prepareNodePositions(previousNodePosition?: NodePosition, previousNodeDimensions?: NodeDimension, transitionLevel: number = 0, maxYDepthOfNextNode: number = 0, isFirst: boolean = true): NodePosition {
		const newPositon: NodePosition = {
			x: 0,
			y: 0
		};
		if (previousNodeDimensions && previousNodePosition) {
			//newPositon.x = previousNodePosition.x + this.nodeSep;
			newPositon.x = previousNodePosition.x;
			if (!isFirst) {
				newPositon.x = newPositon.x + this.nodeSep;
			}
			//newPositon.x = previousNodePosition.x === 0 ? previousNodePosition.x : previousNodePosition.x + this.nodeSep;
			newPositon.y = previousNodePosition.y;
			if (transitionLevel > 0) {
				newPositon.y = (maxYDepthOfNextNode === 0 ? previousNodePosition.y : maxYDepthOfNextNode) + this.rankSep * transitionLevel;
			}
		}

		return newPositon;
	}

	/**
	 * Used to build a tree collection of nodes with fixed positions from workflow data
	 * @param action
	 * @param transitionLevel
	 * @param previousNodePosition
	 * @param previousNodeDimensions
	 * @param maxYDepthOfNextNode
	 * @param isFirst
	 * @returns
	 */
	private prepareNodeTree(action: IWorkflowAction, transitionLevel: number = 0, previousNodePosition?: NodePosition, previousNodeDimensions?: NodeDimension, maxYDepthOfNextNode: number = 0, isFirst: boolean = false): ICustomNode {
		const svgContent = this.generateSvgContent(action.actionTypeId);
		const newNodePositions = this.prepareNodePositions(previousNodePosition, previousNodeDimensions, transitionLevel, maxYDepthOfNextNode, isFirst);

		const nodeTree: ICustomNode = {
			id: action.id.toString(),
			label: action.description,
			data: {
				action, //passing entire action needed for populating data on click node event
				shape: svgContent.attribute.shape,
				transitionLevel: transitionLevel
			},
			children: [],
			attribute: svgContent.attribute,
			dimension: svgContent.dimension,
			position: newNodePositions,
			maxChildDepth: 0
		};

		this.currentMaxActionId = this.currentMaxActionId > action.id ? this.currentMaxActionId : action.id;
		let localCustomYPosition: number = 0;
		const isFormulaAction: boolean = action.actionTypeId === WorkflowActionType.Decision;
		if (action.transitions && action.transitions.length > 0) {
			action.transitions.forEach((transition, index) => {
				let childNode = this.prepareNodeTree(transition.workflowAction, index, nodeTree.position, nodeTree.dimension, localCustomYPosition);
				nodeTree.maxChildDepth = childNode.maxChildDepth;
				// Set the second path from the formula action based on the node depth of the first path of the formula action
				if (index === 0 && childNode.maxChildDepth !== 0) {
					localCustomYPosition = childNode.maxChildDepth ? childNode.maxChildDepth : localCustomYPosition;
				}

				if (isFormulaAction && childNode.position) {
					const actionLabelData: IWorkflowAction = { ...action, ...{ id: transition.id } };
					const actionLabelNode: ICustomNode = {
						id: `${action.id}-vertical-rect-${index + 1}`,
						label: transition.parameter ?? '?',
						data: {
							action: actionLabelData,
							shape: '',
							transitionLevel: index
						},
						attribute: {
							fill: 'black',
							stroke: 'black',
							shape: 'rect'
						},
						dimension: {
							height: 80,
							width: 20
						},
						position: {
							x: childNode.position.x - 90,
							y: childNode.position.y
						},
						children: [childNode]
					};
					childNode = actionLabelNode;
				}
				nodeTree.children?.push(childNode);
			});
		}

		// Setting the max depth of an action
		if (nodeTree.children) {
			if (nodeTree.children.length > 1 && nodeTree.maxChildDepth === 0) {
				const item = nodeTree.children[nodeTree.children.length - 1];
				if (item && item.position) {
					nodeTree.maxChildDepth = item.position.y;
				}
			}
		}

		this.getActionIcons(action, nodeTree);
		return nodeTree;
	}

	/**
	 * Used to prepare the required node and link collection required by ngx graph
	 * @param nodeTree
	 */
	private prepareNodesFromTree(nodeTree: ICustomNode) {
		const node: ICustomNode = {
			id: nodeTree.id,
			label: nodeTree.label,
			data: nodeTree.data,
			attribute: nodeTree.attribute,
			dimension: nodeTree.dimension,
			position: nodeTree.position,
			maxChildDepth: 0
		};

		if (nodeTree.children) {
			nodeTree.children.forEach((node) => {
				// Preparing links from one node to the next
				const edge: Edge = {
					id: `p${nodeTree.id}-${node.id}`,
					source: nodeTree.id.toString(),
					target: node.id.toString()
				};
				this.links.push(edge);
				this.prepareNodesFromTree(node);
			});
		}
		this.nodes.push(node);
	}

	//Function to define the shape and shape attributes for each node based on its actionTypeId.
	public generateSvgContent(actionTypeId: WorkflowActionType): IWorkflowSVGContent {
		switch (actionTypeId) {
			case WorkflowActionType.Start:
			case WorkflowActionType.End: // ActionTypeId for start/end
				return { attribute: { shape: 'ellipse', fill: '#bfdffd', stroke: '#6cb3f9', rx: '40', ry: '40' }, dimension: { width: 125, height: 73 } };
			case WorkflowActionType.Decision: // ActionTypeId for Diamond
				return { attribute: { shape: 'polygon', points: this.diamondPoints(125, 100), fill: '#fce0b0', stroke: '#f9b43d', strokeWidth: '2' }, dimension: { width: 125, height: 100 } };
			case WorkflowActionType.Object:
			case WorkflowActionType.Script:
			case WorkflowActionType.User:
			case WorkflowActionType.External:
			case WorkflowActionType.Message:
			case WorkflowActionType.Workflow:
				return { attribute: { shape: 'rect', fill: '#eee', stroke: '#ccc', strokeWidth: '2' }, dimension: { width: 125, height: 73 } };
			default:
				return { attribute: { shape: 'rect', fill: '#29aecc' }, dimension: { width: 125, height: 73 } };
		}
	}

	private diamondPoints(width: number, height: number): string {
		// Calculate the points for the diamond shape based on the given width and height
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		return `0,${halfHeight} ${halfWidth},0 ${width},${halfHeight} ${halfWidth},${height}`;
	}

	/**
	 * To unsubscribe the designer content.
	 */
	public override ngOnDestroy() {
		this.designerContent$.unsubscribe();

		super.ngOnDestroy();
	}

	/**
	 * Initialize graph data after view is rendered
	 */
	public ngAfterViewInit(): void {
		this.loadDesignerData();
	}

	private clearGraphData(): void {
		this.nodes = [];
		this.links = [];
		this.update$.next(true);
	}

	/**
	 * Selects an action from the designer.
	 * @param selectedAction
	 */
	public selectAction(selectedAction: IWorkflowAction | null) {
		if (selectedAction === null) {
			this.selectedAction = null;
			this.actionService.selectedAction$.next(null);
			return;
		}
		const selectedActionFromWorkflowObject = this.findActionFromActionTree(selectedAction.id, this.actionsInTemplateVersion);
		this.selectedAction = selectedActionFromWorkflowObject;
		this.actionService.selectedAction$.next(selectedAction);
	}

	private isDecisionLabelActionSelected: boolean = false;
	private selectedTransitionIndex: number = 0;
	private findActionFromActionTree(actionId: number, actions: IWorkflowAction): IWorkflowAction {
		let workflowAction: IWorkflowAction = {} as IWorkflowAction;
		// base condition: return action when found
		if (actions.id === actionId) {
			workflowAction = actions;
		}

		// check transitions if the action has transitions, if the current action is not the required action
		if (actions.transitions && actions.transitions.length > 0 && Object.keys(workflowAction).length === 0) {
			for (let transitionIndex = 0; transitionIndex < actions.transitions.length; transitionIndex++) {
				// If decision label action is selected
				if (actions.transitions[transitionIndex].id === actionId) {
					this.isDecisionLabelActionSelected = true;
					this.selectedTransitionIndex = transitionIndex;
					workflowAction = actions;
					break;
				}
				// reset flag when another action is selected
				this.isDecisionLabelActionSelected && this.resetSelectedTransitionProps();
				workflowAction = this.findActionFromActionTree(actionId, actions.transitions[transitionIndex].workflowAction);
				if (Object.keys(workflowAction).length !== 0) {
					break;
				}
			}
		}

		return workflowAction;
	}

	private resetSelectedTransitionProps() {
		this.isDecisionLabelActionSelected = false;
		this.selectedTransitionIndex = 0;
	}

	private updateTools(allActions: IWorkflowActionDefinition[]) {
		// logic to add selected action into designer
		const addActionToDesigner = (id: string) => {
			this.addActionToDesigner(id, allActions);
		};

		// TODO: update to adhere to fixed menulist interface
		this.addItemsToToolbar(allActions, WorkflowActionType.Decision, 'basics.workflow.designer.decision', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Decision].tooltipActionIcon, 'decision', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.Object, 'basics.workflow.designer.object', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Object].tooltipActionIcon, 'object', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.Script, 'basics.workflow.designer.script', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Script].tooltipActionIcon, 'script', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.User, 'basics.workflow.designer.userTask', this.actionTypeFactory.actionTypeArray[WorkflowActionType.User].tooltipActionIcon, 'usertask', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.External, 'basics.workflow.designer.externalFn', this.actionTypeFactory.actionTypeArray[WorkflowActionType.External].tooltipActionIcon, 'externalFunction', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.Message, 'basics.workflow.designer.message', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Message].tooltipActionIcon, 'sendmessage', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.Form, 'basics.workflow.designer.form', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Form].tooltipActionIcon, 'userform', addActionToDesigner);
		this.addItemsToToolbar(allActions, WorkflowActionType.Workflow, 'basics.workflow.designer.workflow', this.actionTypeFactory.actionTypeArray[WorkflowActionType.Workflow].tooltipActionIcon, 'workflowaction', addActionToDesigner);

		// Adding default items
		const toolbarObjItems: ConcreteMenuItem[] = [
			{ id: 'd0', type: ItemType.Divider, hideItem: false },
			{
				caption: { key: 'cloud.common.cut' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-cut',
				id: 'cut',
				fn: () => this.cutAction(this.selectedAction as IWorkflowAction),
				sort: 8,
				permission: '#c',
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.copy' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-copy',
				id: 'copy',
				fn: () => {
					this.copyCurrentAction();
				},
				sort: 9,
				permission: '#c',
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.delete' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-rec-delete',
				id: 'delete',
				fn: () => this.deleteSelectedAction(this.selectedAction as IWorkflowAction),
				sort: 7,
				permission: '#c',
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.paste' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-paste',
				id: 'paste',
				fn: () => {
					this.pasteAction();
				},
				sort: 10,
				permission: '#c',
				type: ItemType.Item,
			}
		];
		this.uiAddOns.toolbar.addItems(toolbarObjItems);
	}

	/**
	 * Used to set id to newly added actions
	 */
	private currentMaxActionId: number = 0;

	//TODO: Move to a separate service?
	/**
	 * Adds action selected from toolbar to designer
	 * @param id
	 * @param allActions
	 */
	private addActionToDesigner(id: string, allActions: IWorkflowActionDefinition[]) {

		if (this.selectedAction === null) {
			return;
		}

		// get definiton of the selected action
		const selectedActionDefinition: IWorkflowActionDefinition = allActions.filter(action => action.Id.toString() === id)[0];

		// create required structure for adding new action into designer
		const workflowInputs: IActionParam[] = [];
		selectedActionDefinition.Input.forEach(input => {
			const workflowInput: IActionParam = {
				id: ++this.currentMaxActionId,
				key: input,
				value: ''
			};
			workflowInputs.push(workflowInput);
		});

		if (selectedActionDefinition.Id.toString() === '00000000000000000000000000000000') {
			this.setDefaultValue(workflowInputs);
		}
		const workflowOutputs: IActionParam[] = [];
		selectedActionDefinition.Output.forEach(output => {
			const workflowOutput: IActionParam = {
				id: ++this.currentMaxActionId,
				key: output,
				value: ''
			};
			workflowOutputs.push(workflowOutput);
		});

		const newWorkflowTransitions = [...this.selectedAction.transitions];
		const newWorkflowAction: IWorkflowAction = {
			actionId: selectedActionDefinition.Id.toString(),
			actionTypeId: selectedActionDefinition.ActionType,
			description: selectedActionDefinition.Description,
			id: ++this.currentMaxActionId,
			input: workflowInputs,
			output: workflowOutputs,
			code: '',
			documentList: [],
			lifetime: 0,
			transitions: newWorkflowTransitions,
			executeCondition: ''
		};

		const newWorkflowTransitionItem: IWorkflowTransition = {
			id: ++this.currentMaxActionId,
			parameter: '',
			workflowAction: newWorkflowAction
		};
		const newWorkflowTransition: IWorkflowTransition[] = [newWorkflowTransitionItem];

		if (this.selectedAction.actionTypeId === WorkflowActionType.Decision) {
			if (this.isDecisionLabelActionSelected) {
				newWorkflowTransitionItem.workflowAction.transitions = [this.selectedAction.transitions[this.selectedTransitionIndex]];
				this.selectedAction.transitions[this.selectedTransitionIndex] = newWorkflowTransitionItem;
			} else {
				// add action in new path if decision action is selected
				newWorkflowTransitionItem.parameter = '?';
				newWorkflowAction.transitions = [];
				// add end action for new transition
				const endAction = this.getEndAction();
				const endWorkflowTransition: IWorkflowTransition[] = [{
					id: ++this.currentMaxActionId,
					parameter: '',
					workflowAction: endAction
				}];
				newWorkflowTransitionItem.workflowAction.transitions = endWorkflowTransition;
				this.selectedAction.transitions.push(newWorkflowTransitionItem);
			}
		} else {
			this.selectedAction.transitions = newWorkflowTransition;
		}


		this.actionService.trackAddedAction(newWorkflowAction);
		this.selectAction(newWorkflowAction);
		this.drawGraphFromActions();
	}

	private getEndAction(): IWorkflowAction {
		return {
			actionId: 'test',
			actionTypeId: WorkflowActionType.End,
			description: 'End',
			id: ++this.currentMaxActionId,
			input: [],
			output: [],
			code: '',
			lifetime: 0,
			documentList: [],
			transitions: [],
			executeCondition: ''
		};
	}

	/**
	 * Method to create menu list items to add into toolbar
	 * @param allActions Collection that contains all action definitions
	 * @param workflowActionType User to filter required actions from allActions
	 * @param caption Tooltip message to be displayed
	 * @param iconClass Toolbar icon to be shown
	 * @param id Id of each toolbar item
	 * @param clickFn Method that will be executed on click of menu item.
	 */
	private addItemsToToolbar(allActions: IWorkflowActionDefinition[], workflowActionType: WorkflowActionType, caption: string, iconClass: string, id: string, clickFn: (id: string) => void) {
		const filteredActions = allActions.filter(action => action.ActionType === workflowActionType).sort((action, nextAction) => action.Namespace < nextAction.Namespace ? -1 : 1);
		if (filteredActions && filteredActions.length > 0) {
			const menuItems: ConcreteMenuItem[] = [];

			let currentTitle = filteredActions[0].Namespace;
			this.addTitleToDropdownItem(menuItems, currentTitle);

			filteredActions.forEach((filteredAction: IWorkflowActionDefinition, index: number) => {
				if (currentTitle !== filteredAction.Namespace) {
					this.addTitleToDropdownItem(menuItems, filteredAction.Namespace);
					currentTitle = filteredAction.Namespace;
				}
				const menuItem: ISimpleMenuItem = {
					caption: { key: filteredAction.Description },
					hideItem: false,
					disabled: false,
					iconClass: '',
					id: filteredAction.Id.toString(),
					sort: index + 1,
					type: ItemType.Item,
					fn: (info) => {
						info.item.id && clickFn(info.item.id);
					},
					permission: '#c'
				};
				menuItems.push(menuItem);
			});
			const item: IDropdownBtnMenuItem = {
				caption: { key: caption },
				hideItem: false,
				iconClass: iconClass,
				id: id,
				layoutChangeable: true,
				layoutModes: 'vertical',
				type: ItemType.DropdownBtn,
				list: {
					showTitles: true,
					cssClass: 'radio-group',
					activeValue: 't-addObject',
					items: menuItems
				}
			};
			this.uiAddOns.toolbar.addItems([item]);
		}
	}

	private addTitleToDropdownItem(menuItems: IMenuItem[], title: string) {
		const menuItem: IMenuItem = {
			caption: { key: title },
			iconClass: '',
			disabled: true,
			cssClass: 'title',
			id: title,
			sort: 0,
			type: ItemType.Item,
			hideItem: false
		};
		menuItems.push(menuItem);
	}

	/**
	 * performs operation of either updating missing (input or output) parameters of selected action
	 * or deletion of discarded action on click of conditional icon.
	 * @param selectedAction
	 * @param attribute
	 */
	public async onIconClick(selectedAction: IWorkflowAction, attribute: IWorkflowSVGAttribute) {
		const validationResult = this.workflowValidationService.getValidationByAction(selectedAction.id);
		if (!validationResult) {
			return;
		}

		let dialogBody;
		if (validationResult.IsParamUpdated) {
			dialogBody = `${this.translateService.instant('basics.workflow.modalDialogs.validateCurrentAction').text} ${selectedAction.description}`;
		} else if (validationResult.IsActionMissing) {
			dialogBody = `${this.translateService.instant('basics.workflow.modalDialogs.deleteCurrentActionFromWorkflow').text} ${selectedAction.description} `;
		}
		const options: IYesNoDialogOptions = {
			defaultButtonId: 'no',
			id: 'validateCurrentAction',
			dontShowAgain: true,
			headerText: '',
			bodyText: dialogBody,
			width: '400px',
			maxWidth: '600px'
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		if (result?.closingButtonId === 'yes') {
			if (validationResult.IsParamUpdated) {

				this.updateParam(selectedAction, validationResult);

				this.selectedAction = selectedAction;
				this.actionService.selectedAction$.next(selectedAction);
				attribute.actionUpdateIcon = {};
			} else if (validationResult.IsActionMissing) {
				//TODO: Why?
				//({ x0: attribute.x0, x1: attribute.x1, x2: attribute.x2, y0: attribute.y0, y1: attribute.y1, y2: attribute.y2, icon: attribute.conditionalIcon } = { x0: ' ', x1: ' ', x2: ' ', y0: ' ', y1: ' ', y2: ' ', icon: ' ' });
				this.deleteSelectedAction(selectedAction);
			}
		}
	}

	private updateParam(selectedAction: IWorkflowAction, validationResult: ActionValidationResult) {
		if (validationResult.InputParams.AddedParams.length > 0) {
			selectedAction.input = this.addParam(selectedAction.input, validationResult.InputParams.AddedParams);
		}
		//remove old param
		if (validationResult.InputParams.RemovedParams.length > 0) {
			selectedAction.input = this.removeParam(selectedAction.input, validationResult.InputParams.RemovedParams);
		}
		//Output
		//Add new param
		if (validationResult.OutputParams.AddedParams.length > 0) {
			selectedAction.output = this.addParam(selectedAction.output, validationResult.OutputParams.AddedParams);
		}
		//remove old param
		if (validationResult.OutputParams.RemovedParams.length > 0) {
			selectedAction.output = this.removeParam(selectedAction.output, validationResult.OutputParams.RemovedParams);
		}
	}

	private addParam(existingParams: IActionParam[], newParams: string[]) {
		newParams.forEach((newParam) => {
			const newInputParam: IActionParam = {
				id: Math.floor(Math.random() * 90000) + 10000,
				key: newParam,
				value: ''
			};
			existingParams.push(newInputParam);
		});
		return existingParams;
	}

	private removeParam(existingParams: IActionParam[], removedParams: string[]) {
		return existingParams.filter(param => !removedParams.includes(param.key));
	}

	private getActionIcons(currentAction: IWorkflowAction, node: ICustomNode): void {
		const iconSet = this.actionTypeFactory.getIconsByActionType(currentAction.actionTypeId);
		const svgSprite = iconSet.svgSprite;
		//actionIconURL stores URL  based on its action type id.
		node.attribute.actionIcon = this.iconService.getIconUrl(svgSprite, iconSet.svgImage);

		const validationResult = this.workflowValidationService.getValidationByAction(currentAction.id);
		if (!validationResult) {
			return;
		}

		//ConditionalIcon stores URL based on whether or not an action is entirely missing or has missing parameters.
		if (validationResult.IsParamUpdated) {
			//TODO: Update icon when available: ico-warning-level-attention
			const iconClass = this.iconService.getIconUrl(svgSprite, 'ico-grid-warning-yellow');
			if (!iconClass) {
				return;
			}

			node.attribute.actionUpdateIcon = {
				iconClass: iconClass,
				tooltip: validationResult.ErrorList.join('. ')
			};
		} else if (validationResult.IsActionMissing) {
			//TODO: Update icon when available: ico-warning-level-danger
			const iconClass = this.iconService.getIconUrl(svgSprite, 'ico-grid-warning-red');
			if (!iconClass) {
				return;
			}
			node.attribute.actionUpdateIcon = {
				iconClass: iconClass,
				tooltip: validationResult.ErrorList.join('. ')
			};

			//Adding cross lines
			node.attribute.x0 = '0';
			node.attribute.x1 = '125';
			node.attribute.y0 = '0';
			node.attribute.y1 = '75';
			node.attribute.lineStroke = 'red';
		}
	}

	private getParentAction(action: IWorkflowAction | null, selectedActionId: number): IWorkflowAction {
		let result;
		if (action === null) {
			action = this.actionsInTemplateVersion;
		}
		for (const transition of action.transitions) {
			const currentAction = action as IWorkflowAction;
			if (transition.workflowAction.id === selectedActionId) {
				return currentAction;
			}
			result = this.getParentAction(transition.workflowAction, selectedActionId);
		}
		return result as IWorkflowAction;
	}

	private async deleteSelectedAction(selectedAction: IWorkflowAction) {
		const parentAction = this.getParentAction(this.actionsInTemplateVersion, selectedAction.id);
		//Start and End actions should never be deleted.
		if (selectedAction && parentAction && !(selectedAction.actionTypeId === WorkflowActionType.Start || selectedAction.actionTypeId === WorkflowActionType.End)) {
			//find the index of selected action in transition array of parent action.
			const i = this.getTransitionIndex(parentAction, selectedAction);
			// dinstinguish whether or not selected action is decision type.

			if (selectedAction.actionTypeId === WorkflowActionType.Decision && selectedAction.transitions.length > 1 && selectedAction.transitions[0].workflowAction.actionTypeId != 2) {
				//confirmation before deleting the decision action and all its child actions.
				const dialogHeader = this.translateService.instant('basics.workflow.action.deleteDecisionAction.header').text;
				const dialogBody = this.translateService.instant('basics.workflow.action.deleteDecisionAction.deleteConfirmation').text;
				const options: IYesNoDialogOptions = {
					defaultButtonId: 'no',
					id: 'deleteCurrentAction',
					dontShowAgain: true,
					showCancelButton: true,
					headerText: dialogHeader,
					bodyText: dialogBody
				};
				const result = await this.messageBoxService.showYesNoDialog(options);

				if (result?.closingButtonId === 'yes') {
					const parameter = parentAction.actionTypeId === WorkflowActionType.Decision ? '?' : ' ';
					parentAction.transitions[i] = this.createNewEndAction(parameter);

					if (parentAction.actionTypeId === WorkflowActionType.Decision) {
						parentAction.transitions[i].workflowAction.transitions[0].parameter = parentAction.transitions[i].parameter;
					}
					this.actionService.trackRemovedAction(selectedAction);
					this.selectedAction = parentAction;
					this.selectAction(this.selectedAction);
					this.drawGraphFromActions();
				}
			} else {
				this.actionService.trackRemovedAction(selectedAction);
				parentAction.transitions[i] = parentAction.transitions[i].workflowAction.transitions[0];
			}
		}

		this.selectedAction = parentAction;
		this.selectAction(this.selectedAction);
		this.drawGraphFromActions();
	}

	private getTransitionIndex(parentAction: IWorkflowAction, selectedAction: IWorkflowAction) {
		//find the index of current action in the parent action's transition array property.
		let i;
		for (let index = 0; index < parentAction.transitions.length; index++) {

			if (parentAction.transitions[index].workflowAction.id === selectedAction.id) {
				i = index;
				break;
			}
		}
		return i as number;
	}

	private cutAction(selectedAction: IWorkflowAction): void {
		this.copiedAction = selectedAction;
		this.deleteSelectedAction(selectedAction);

	}

	private copyCurrentAction(): IWorkflowAction {
		if (this.selectedAction) {
			this.copiedAction = this.selectedAction;
		}
		return this.copiedAction;
	}

	private pasteAction(): void {
		if (this.selectedAction && this.copiedAction) {
			if (!(this.selectedAction.actionTypeId === WorkflowActionType.Start || this.selectedAction.actionTypeId === WorkflowActionType.End)) {

				const currentActionTransition: IWorkflowTransition[] = [
					...this.selectedAction.transitions
				];

				const pasteAction: IWorkflowAction = {
					actionId: this.copiedAction.actionId,
					actionTypeId: this.copiedAction.actionTypeId,
					description: this.copiedAction.description,
					id: ++this.currentMaxActionId,
					input: this.copiedAction.input,
					output: this.copiedAction.output,
					code: this.copiedAction.code,
					documentList: [],
					lifetime: 0,
					transitions: currentActionTransition,
					executeCondition: ''
				};

				const newActionTransition: IWorkflowTransition = {
					id: ++this.currentMaxActionId,
					parameter: '',
					workflowAction: pasteAction
				};

				const newWorkflowTransitionArray: IWorkflowTransition[] = [newActionTransition];

				if (this.selectedAction.actionTypeId === WorkflowActionType.Decision) {
					if (this.isDecisionLabelActionSelected) {
						newActionTransition.workflowAction.transitions = [this.selectedAction.transitions[this.selectedTransitionIndex]];
						this.selectedAction.transitions[this.selectedTransitionIndex] = newActionTransition;
					} else {
						pasteAction.transitions = [this.createNewEndAction('?')];
						this.selectedAction.transitions.push(newActionTransition);
					}
				} else {
					this.selectedAction.transitions = newWorkflowTransitionArray;
				}
				this.actionService.trackAddedAction(pasteAction);
				this.selectAction(pasteAction);
				this.drawGraphFromActions();
			}
		}
	}

	private createNewEndAction(param: string): IWorkflowTransition {
		const newEndAction: IWorkflowAction = {
			actionId: null,
			actionTypeId: WorkflowActionType.End,
			description: 'End',
			id: ++this.currentMaxActionId,
			input: [],
			output: [],
			code: '',
			lifetime: 0,
			documentList: [],
			transitions: [],
			executeCondition: ''
		};
		const transitions: IWorkflowTransition = {
			id: ++this.currentMaxActionId,
			parameter: param,
			workflowAction: newEndAction
		};
		return transitions;
	}

	private setDefaultValue(actionInput: IActionParam[]): void {

		const defaultData: IUserInputConfig[] = [
			{
				description: 'Title',
				type: 'title'
			},
			{
				description: 'Subtitle',
				type: 'subtitle'
			}

		];
		actionInput.forEach(input => {
			if (input.key === 'Config') {
				input.value = JSON.stringify(defaultData);
			}
		}
		);
	}

}
