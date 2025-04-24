(function ($, markdown) {
	'use strict';

	function getReadMeFileUrl() {

		let dirs = window.location.pathname.split('/');
		if (dirs && dirs.length > 1) {
			dirs = dirs.slice(0, dirs.length - 1);
		}
		return window.location.origin + '/' + dirs.join('/') + '/README.md.txt';
	}

	$(document).ready(function () {
		$.ajax(getReadMeFileUrl()).done(function (readMeContent) {

			if (markdown) {

				markdown.extensions = $.extend({}, markdown.extensions);

				markdown.extensions.processTable = function (input) {
					let tableRegex = new RegExp(/(\|(?:[^\r\n|]+\|)+)(?:\r?\n|\r)\|(?:[-—\s]+\|)+((?:(?:\r?\n|\r)(?:\|(?:[^\n\r|]+\|)+))+)/, 'gu'),
						curT = 1;
					while (curT) {
						curT = tableRegex.exec(input);
						if (curT !== null) {
							let rows = curT[2].split(/\r?\n|\r/).filter(function (a) {
									return a.length !== 0;
								}),
								tableRows = '<table class="table table-striped"><thead><tr><th>' + curT[1].split('|').slice(1, -1).join('</th><th>') + '</th></tr></thead><tbody>';
							for (let i in rows) {
								tableRows += '<tr><td>' + rows[i].split('|').slice(1, -1).join('</td><td>') + '</td></tr>';
							}
							tableRows += '</tbody></table>';
							input = input.replace(curT[0], tableRows);
						}
					}

					return input;
				};

				let markHtml = markdown.toHTML(readMeContent);
				markHtml = markdown.extensions.processTable(markHtml);
				$('#readme-container').html(markHtml);
			}

		});
	});

})(window.jQuery, window.markdown);

