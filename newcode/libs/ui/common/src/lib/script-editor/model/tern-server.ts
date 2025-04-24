/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';

import { Position, Server } from 'tern';
import { CompletionsQueryResult, Def } from 'tern/lib/tern';

import { Completion } from '@codemirror/autocomplete';

import { IScriptEditorCompleteOptions } from './interfaces/script-editor-options.interface';

/**
 * JavaScript code analyzer server, used to show code suggestion according to context
 */
export class TernServer {
	private server!: Server;

	/**
	 * The constructor
	 * @param defs api definitions
	 */
	public constructor(defs?: Def[]) {
		this.server = new Server({
			async: true,
			defs: defs
		});
	}

	/**
	 *
	 * @param defs
	 */
	public addDefs(defs: Def[]) {
		this.server.addDefs(defs);
		this.server.reset();
	}

	/**
	 * Query completions
	 * @param doc
	 * @param pos
	 * @param options
	 */
	public query(doc: string, pos: Position, options: IScriptEditorCompleteOptions): Observable<Completion[]> {
		const docId = '[doc]';
		const server = this.server;

		return new Observable((observer) => {
			server.request({
				files: [
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					{ name: docId, text: doc, type: 'full' }
				],
				query: {
					caseInsensitive: true,
					docs: true,
					end: pos,
					file: docId,
					guess: false,
					includeKeywords: true,
					lineCharPositions: true,
					type: 'completions',
					types: true,
					urls: true,
					...options
				}
			}, (error, data) => {
				if (error) {
					observer.error(error);
				} else {
					if (!data) {
						return;
					}

					const result = data as CompletionsQueryResult;

					const completions = result.completions.map(item => {
						item = item as {
							name: string,
							type?: string | undefined,
							depth?: number | undefined,
							doc?: string | undefined,
							url?: string | undefined,
							origin?: string | undefined
						};

						return {
							label: item.name,
							type: item.type,
							info: item.doc,
							detail: item.url
						};
					});

					observer.next(completions);
					observer.complete();
				}
			});
		});
	}
}