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
            _setupGoto,
            _fixedHeight,
            _fixedHeightValue,
            _refreshGradientUnderlines;

        _refresh = function() {
            _fixedHeightValue = undefined;
            _refreshWindowHeight();
            _refreshVerticalAligns();
            _setupGoto();
            _refreshGradientUnderlines();
        };

        _fixedHeight = function () {
            var $header, $adminBar;
            if (_fixedHeightValue === undefined) {
                _fixedHeightValue = 0;
                if ($('.fixed').length > 0) {
                    _fixedHeightValue = $('.fixed').outerHeight();
                } else {
                    $header = $('#page-header');
                    $adminBar = $('#wpadminbar');

                    if ($header.length > 0 && $header.css('position') === 'fixed') {
                        _fixedHeightValue = $header.outerHeight();
                    }

                    if ($adminBar.length > 0) {
                        _fixedHeightValue += $adminBar.outerHeight();
                    }
                }
            }
            return _fixedHeightValue;
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

        _refreshGradientUnderlines = function () {
            $('.gradient-underline').each(function () {
                var underline = document.createElement('div'),
                    width = $(this).data('width') || '80%',
                    height = $(this).data('height') || '1px',
                    color = $(this).data('color') || '#000000';

                underline.className = 'underline';

                if ($(this).find('.underline').length === 0) {
                    $(this).append(underline);
                    underline = $(this).find('.underline');
                    underline.css('height', height);
                    underline.css('width', width);
                    underline.css('margin', '10px auto 0 auto');
                    if (Modernizr.cssgradients) {
                        underline.css('background', '-moz-linear-gradient(left, rgba(0,0,0,0) 0%, ' + color + ' 52%, rgba(0,0,0,0) 100%)');
                        underline.css('background', '-webkit-linear-gradient(left, rgba(0,0,0,0) 0%,' + color + ' 52%,rgba(0,0,0,0) 100%)');
                        underline.css('background', 'linear-gradient(to right, rgba(0,0,0,0) 0%,' + color + ' 52%,rgba(0,0,0,0) 100%)');
                    } else {
                        underline.css('background', color);
                    }
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
            $group.css('min-height', ($(window).height() - _fixedHeight()) + 'px');

            $group.each(function () {
                var $element = $(this);

                if ($element.hasClass('forced') || $element.hasClass('slideshow') || $element.css('position') === 'fixed') {
                    $element.css('height', ($(window).height() - _fixedHeight()) + 'px');
                }
            });
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
                $('html, body').animate({scrollTop: Math.max(0, top - _fixedHeight())}, 1000, 'swing');
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

