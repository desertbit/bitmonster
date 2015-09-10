/*
 *  BitMonster - A Monster handling your Bits
 *  Copyright (C) 2015  Roland Singer <roland.singer[at]desertbit.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 *  This code lives inside the BitMonster function.
 */


var ConnLostWidget = (function () {
    /*
     * Variables
     */

	var instance = {}, // Our public instance object returned by this function.
		widget,
		widgetBody = 	'<div id="bm-conn-lost-widget">' +
							'<i class="fa fa-bolt fa-2x"></i>' +
							'<span><p></p><small></small></span>' +
						'</div>';



    /*
     * Private Functions
     */

	var setTitle = function(str) {
		widget.find("p").text(str);
	};

	var setText = function(str) {
		widget.find("small").text(str);
	};

	var createWidgetIfNotExists = function() {
		// Try to obtain the widget object.
		widget = $('#bm-conn-lost-widget');

		// Skip if it exists..
		if (widget.length) {
			return;
		}

		// Create it, hide it and prepend it to the document body.
		widget = $(widgetBody);
		$('body').prepend(widget);
	};



    /*
     * Public Methods
     */

    instance.show = function() {
    	// Create the widget if required.
    	createWidgetIfNotExists();

    	// Set the title and text.
		setTitle(tr.ConnLostWidget.Title);
		setText(tr.ConnLostWidget.Title);

		// Show it by adding the show class.
		widget.addClass('show');
    };


	return instance;
})();
