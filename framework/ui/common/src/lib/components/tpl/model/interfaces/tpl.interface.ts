/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IData {
	[x: string]: string;
}

export interface ITplServiceInterface {
	/**
	 * @name parse
	 * @description          Parse string with <%placeholder%>
	 * @param  {string} tpl  String to parse
	 * @param  {object} data Data object {placeholder: value}
	 * @return {string}      The parsed string
	 *
	 */
	parse(tpl: string, data: IData): string;
}
