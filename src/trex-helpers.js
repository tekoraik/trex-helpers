;(function ($) {
    trex = window.trex || {};

    trex.helpers = (function () {
        var _refresh,
            _refreshVerticalAligns,
            _refreshWindowHeight,
            _refreshAbsVerticalAligns,
            _refreshMarginVerticalAligns,
            _getTopElement,
            _refreshTotalWindowHeight,
            _refreshPercentWindowHeight,
            _setupGoto;

        _refresh = function() {
            _refreshWindowHeight();
            _refreshVerticalAligns();
            _setupGoto();
        };

        _refreshVerticalAligns = function () {
            _refreshAbsVerticalAligns();
            _refreshMarginVerticalAligns();
        };

        _refreshAbsVerticalAligns = function () {
            $('.vcenter-abs').each(function () {
                var $element = $(this), $topElement = _getTopElement($element);

                $element.css('position', 'absolute');
                $element.parent().css('position', 'relative');

                if ($topElement.height() <= $element.outerHeight()) {
                    $(this).css('top', '0px');
                } else {
                    $(this).css('top', Math.floor(($topElement.height() / 2) - ($element.outerHeight() / 2)) + 'px');
                }
            });
        };

        _refreshMarginVerticalAligns = function () {
            $('.vcenter-margin').each(function () {
                var $element = $(this),
                    $topElement = _getTopElement($element),
                    margin = 0,
                    paddingTop,
                    paddingBottom;

                if ($topElement[0] == document.body) {
                    $topElement = $(window);
                }

                if ($topElement.height() <= $element.height()) {
                    $element.css('margin-top', '0px');
                    $element.css('margin-bottom', '0px');
                } else {
                    paddingTop = $(this).css('padding-top').replace('px', '');
                    paddingBottom = $(this).css('padding-bottom').replace('px', '');

                    margin = Math.floor(($topElement.height() - $element.height()) / 2);

                    $element.css('margin-top', (margin - paddingTop) + 'px');
                    $element.css('margin-bottom', (margin - paddingBottom) + 'px');
                }
            });
        };

        _getTopElement = function ($element) {
            var $topElement = $element.parent();

            if ($topElement[0] == document.body) {
                $topElement = $(window);
            }
            return $topElement;
        };

        _refreshWindowHeight = function () {
            _refreshTotalWindowHeight();
            _refreshPercentWindowHeight();
        };

        _refreshTotalWindowHeight = function () {
            var $group = $('.window-height');

            $group.css('box-sizing', 'border-box');
            $group.css('min-height', ($(window).height() - $('.fixed').height()) + 'px');
        };

        _refreshPercentWindowHeight = function () {
            $('.percent-window').each(function() {
                var $element = $(this), height, percent;
                percent = $element.data('percent') / 100;
                height = $(window).height() * percent;
                $element.css('min-height', height + 'px');
            });

        };

        _setupGoto = function () {
            $(window.document).on('click', '.goto', function (event) {
                var target = $($(this).data('target')),
                    top = target.offset().top;

                event.preventDefault();
                window.history.pushState({}, '', '#' + target.attr('id'));
                $('html, body').animate({scrollTop: Math.max(0, top - $('.fixed').height())}, 1000, 'swing');
            });
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

