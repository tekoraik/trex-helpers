;(function ($) {
    trex = window.trex || {};

    trex.helpers = (function () {
        var _refresh, _refreshVerticalAligns;

        _refresh = function() {
            _refreshVerticalAligns();
        };

        _refreshVerticalAligns = function () {
            $('.valign-abs').each(function () {
                var $topElement = $(this).parent();

                if ($topElement[0] == document.body) {
                    $topElement = $(window);
                }
                $(this).css('position', 'absolute');
                $(this).css('top', Math.floor(($topElement.height() / 2) - ($(this).height() / 2)) + 'px');
            });
        };
        return {
            refresh: _refresh,
        }
    }());
}(jQuery))
