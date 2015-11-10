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


bm.notification = function (options) {
    /*
     * Constants
     */

     var DefaultOptions = {
         title         : "",
         text          : "",
         destroyOnClose: true,
         hideClose     : false
     };



    /*
     * Variables
     */

     var id         = "bm-notification-" + utils.randomString(14),
         timeout    = false,
 		 widgetBody = 	'<div id="' + id + '" class="bm-notification">' +
                            '<div><b></b><b></b><b></b><b></b></div>' +
 							'<p></p>' +
 							'<span></span>' +
 						'</div>';



    /*
     * Private Functions
     */

    function getWidget() {
        // Try to obtain the widget object.
        var widget = $('#' + id);

        // Return it if it exists.
        if (widget.length) {
            return widget;
        }

        // Create it and prepend it to the document body.
        widget = $(widgetBody);
        $('body').prepend(widget);

        if (options.hideClose) {
            $('#' + id + ' > div').remove();
        }
        else {
            // Bind close events.
            $('#' + id + ' > div').on('click', function() {
                if (options.destroyOnClose) {
                    destroy();
                }
                else {
                    hide();
                }
            });
        }

        return widget;
    }

    function setTitle(str) {
        getWidget().find("p").text(str);
    }

    function setText(str) {
        getWidget().find("span").text(str);
    }

    function stopTimeout() {
        // Stop the timeout.
        if (timeout !== false) {
            clearTimeout(timeout);
            timeout = false;
        }
    }

    // Optionally pass a duration which hides the widget again.
    function show(duration) {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Remove the classes if present.
        widget.removeClass('hide');
        widget.removeClass('show');

        // Show it by adding the show class.
        widget.addClass('show');

        // Hide again after a timeout duration if defined.
        if (duration > 0) {
            timeout = setTimeout(function() {
                timeout = false;
                hide();
            }, duration);
        }
    }

    function hide() {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Hide it by removing the class.
        widget.addClass('hide');

        // Remove the classes after a short duration.
        timeout = setTimeout(function() {
            timeout = false;
            widget.removeClass('hide');
            widget.removeClass('show');
        }, 3000);
    }

    function destroy() {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Hide it by removing the class.
        widget.addClass('hide');

        // Remove the object after a short duration.
        timeout = setTimeout(function() {
            timeout = false;
            widget.remove();
        }, 3000);
    }



    /*
     * Initialization
     */

    // Merge the options with the default options.
    options = $.extend(DefaultOptions, options);

    // This call creates the widget once.
    getWidget();

    // Set the default title and text.
    setTitle(options.title);
    setText(options.text);



    // Return the public object.
    return {
        setTitle: setTitle,
        setText : setText,
        show    : show,
        hide    : hide,
        destroy : destroy,

        onClick: function(f) {
            getWidget().addClass('bm-clickable').on('click', f);
        }
    };
};
