;(function ($) {
    trex = window.trex || {};

    trex.helpers = (function () {
        var _refresh, _refreshVerticalAligns, _refreshWindowHeight;

        _refresh = function() {
            _refreshWindowHeight();
            _refreshVerticalAligns();
        };

        _refreshVerticalAligns = function () {
            $('.valign-abs').each(function () {
                var $topElement = $(this).parent();

                if ($topElement[0] == document.body) {
                    $topElement = $(window);
                }

                $(this).css('position', 'absolute');
                $(this).parent().css('position', 'relative');

                if ($topElement.height() <= $(this).height()) {
                    $(this).css('top', '0px');
                } else {
                    $(this).css('top', Math.floor(($topElement.height() / 2) - ($(this).height() / 2)) + 'px');
                }
            });
        };

        _refreshWindowHeight = function () {
            $('.window-height').css('box-sizing', 'border-box');
            $('.window-height').css('min-height', ($(window).height() - $('.fixed').height()) + 'px');
        };

        return {
            refresh: _refresh,
        }
    }());

    $(function () {
        trex.helpers.refresh();
    });
    $(window).resize(trex.helpers.refresh);
}(jQuery));

