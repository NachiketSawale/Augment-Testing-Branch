/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable, inject } from '@angular/core';
import { IDebugContext } from '../../model/workflow-debug-context.interface';
import { TValue, DebugActionResponse } from '@libs/workflow/interfaces';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',

})
export class WorkflowDebugDataService {

	private readonly httpService = inject(PlatformHttpService);


	/**
	 * function to return the first context data after beginning debug process.
	 * @returns base context
	 */

	public createContext(debugContext: IDebugContext) {
		const endPointURL: string = 'basics/workflow/instance/debug/createcontext';
		const httpOption = {
			TemplateId: debugContext.TemplateId,
			JsonContext: debugContext.JsonContext,
			Identification: debugContext.Identification,
			VersionId: debugContext.VersionId
		};
		return this.httpService.post<string>(endPointURL, httpOption);
	}

	/**
	 *function to return the action specific debug context.
	 * @param _wfAction
	 * @param _context
	 * @returns object of "context" and "result" keys.
	 */
	public debugAction(_wfAction: string, _context: string) {
		const endPointURL: string = 'basics/workflow/actions/debug';
		const httpOption = {
			wfAction: _wfAction,
			context: _context
		};
		return this.httpService.post<DebugActionResponse>(endPointURL, httpOption);
	}

	/**
	 * Evaluates execute condition on the server.
	 * @param condition execute condition based on which the action will execute.
	 * @param _context current workflow context
	 * @returns
	 */
	public evaluateExecuteCondition(condition: string, _context: string): Promise<Record<string, TValue>> {
		const endPointURL: string = 'basics/workflow/actions/executeCondition';
		const httpOption = {
			executeCondition: condition,
			context: _context
		};
		return this.httpService.post<Record<string, TValue>>(endPointURL, httpOption);
	}

}
