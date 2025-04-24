/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 *  For checking url content the http and https string or not.
 */
export enum UrlScheme {
	/**
	 * http protocol.
	 */
	Http = 'http',

	/**
	 * https protocol.
	 */
	Https = 'https',

	/**
	 * ftp protocol.
	 */
	Ftp = 'ftp',

	/**
	 * ftps protocol.
	 */
	Ftps = 'ftps',

	/**
	 * file protocol.
	 */
	File = 'file',

}
