import { Diagnostic } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { forEach } from 'lodash';
import { Injectable } from '@angular/core';

export interface IErrorEntity {
	description: string;
	start: number;
	end: number;
	character: number;
	evidence: string;
	a: string;
	reason: string;
	severity: string;
	line: number;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonFilterEditorLinterDataService {
	private bogus: string[] = ['Dangerous comment'];
	private warnings: string[][] = [['property is undefined']];
	private errors: string[] = ['Missing', 'not supported'];

	public validator(text: string, cm: object) {
		//todo application\frontend.ngjs\constructionsystem\common\services\filter-editor\addon\lint\fshint.js
	}

	public isBogus(error: IErrorEntity): boolean {
		const description = error.description;
		forEach(this.bogus, (b) => {
			if (description.indexOf(b) !== -1) {
				return true;
			}
		});
		return false;
	}

	public parseErrors(errors: IErrorEntity[], output: Diagnostic[], state: EditorState) {
		for (let i = 0; i < errors.length; i++) {
			let error = errors[i];
			if (error) {
				let index = error.character - 1;
				const start = error.character - 1;
				let end = start + 1;
				if (error.evidence && error.a) {
					index = error.evidence.substring(start).indexOf(error.a);
					if (index === 0) {
						end += error.a.length - 1;
					}
				}
				error.description = error.reason;
				error.start = error.character;
				error.end = end;
				error = this.cleanError(error);
				if (error) {
					output.push({
						message: error.description,
						severity: error.severity as 'hint' | 'info' | 'warning' | 'error', // type Severity = "hint" | "info" | "warning" | "error";
						from: this.getPos(state, error.line - 1, start),
						to: this.getPos(state, error.line - 1, end),
					});
				}
			}
		}
	}

	public getPos(state: EditorState, line: number, column: number): number {
		const lineInfo = state.doc.lineAt(line);
		const offset = lineInfo.from + column;
		return offset;
	}

	public cleanError(error: IErrorEntity): IErrorEntity | null {
		this.fixWithFn(error, this.warnings[0], 'warning', true);
		this.fixWithFn(error, this.errors, 'error');
		return this.isBogus(error) ? null : error;
	}

	public fixWithFn(error: IErrorEntity, infos: string[], info: string, isFlag?: boolean) {
		const description = error.description;
		for (let i: number = 0; i < infos.length; i++) {
			const fix = infos[i];
			const find = typeof fix === 'string' ? fix : fix[0];
			const replace = typeof fix === 'string' ? null : fix[1];
			const found = description.indexOf(find) !== -1;
			if (found && replace) {
				error.description = replace;
			}
		}
	}
}