/**
 * Created by lst on 2/27/2017.
 */

/* global CodeMirror,require,define,exports,FilterScriptHINT */
/* jshint -W083 */
(function (mod) {
	'use strict';
	if (typeof exports === 'object' && typeof module === 'object') {
		mod(require('../../lib/codemirror'));
	} // CommonJS
	else if (typeof define === 'function' && define.amd) {
		define(['../../lib/codemirror'], mod);
	} // AMD
	else {
		mod(CodeMirror);
	} // Plain browser env

})(function (CodeMirror) {
	'use strict';
	// declare global: FilterScriptHINT

	var bogus = ['Dangerous comment'];

	var warnings = [['property is undefined']];

	var errors = ['Missing', 'not supported'];

	function validator(text, options, cm) {
		if (!window.FilterScriptHINT) {
			return [];
		}
		var d = new Date();
		FilterScriptHINT.checkFilterScript(text,cm);
		var errors = FilterScriptHINT.errors, result = [];
		if (errors) {
			parseErrors(errors, result);
		}
		console.log('show lint costs', new Date() - d, 'ms.');
		return result;
	}

	CodeMirror.registerHelper('lint', 'filterscript', validator);

	function cleanup(error) {
		// All problems are warnings by default
		fixWith(error, warnings, 'warning', true);
		fixWith(error, errors, 'error');

		return isBogus(error) ? null : error;
	}

	function fixWith(error, fixes/* , severity, force */) {
		var description, fix, find, replace, found;

		description = error.description;

		for (var i = 0; i < fixes.length; i++) {
			fix = fixes[i];
			find = (typeof fix === 'string' ? fix : fix[0]);
			replace = (typeof fix === 'string' ? null : fix[1]);
			found = description.indexOf(find) !== -1;

			// if (force || found) {
			// error.severity = severity;
			// }
			if (found && replace) {
				error.description = replace;
			}
		}
	}

	function isBogus(error) {
		var description = error.description;
		for (var i = 0; i < bogus.length; i++) {
			if (description.indexOf(bogus[i]) !== -1) {
				return true;
			}
		}
		return false;
	}

	function parseErrors(errors, output) {
		for (var i = 0; i < errors.length; i++) {
			var error = errors[i];
			if (error) {

				var index, start = error.character - 1, end = start + 1;
				if (error.evidence && error.a) {
					index = error.evidence.substring(start).indexOf(error.a);
					if (index === 0) {
						end += error.a.length - 1;
					}
				}

				// Convert to format expected by validation service
				error.description = error.reason;// + "(jshint)";
				error.start = error.character;
				error.end = end;
				error = cleanup(error);

				if (error) {
					output.push({
						message: error.description,
						severity: error.severity,
						from: CodeMirror.Pos(error.line - 1, start),
						to: CodeMirror.Pos(error.line - 1, end)
					});
				}
			}
		}
	}
});
