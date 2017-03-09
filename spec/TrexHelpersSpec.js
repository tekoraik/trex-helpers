describe("TrexHelpers", function() {
    var helpers;

    beforeEach(function() {
        herpers = trex.helpers;
    });

    describe("when there is a element with valign-abs class", function () {
        beforeEach(function () {
            affix('.valign-abs#test');
        });
        it("should have top position absolute", function() {
            trex.helpers.refresh();
            expect($('#test').css('position')).toBe('absolute');
        });
    });
    describe("when there is a element with valign-abs class, 250px height and it doesn't have parent and window.height = 500", function () {
        beforeEach(function () {
            var parentOriginal = $.prototype.parent,
                heightOriginal = $.prototype.height;

            affix('.valign-abs#test');
            $('#test').css('height', "250px");
            spyOn($.prototype , 'parent').and.callFake(function () {


                if (this.selector == '#test') {
                    return $(document.body);
                } else {
                    return parentOriginal.apply(this, arguments);
                }
            });
            spyOn($.prototype, 'height').and.callFake(function () {
                var original = $.prototype.height;
                if (this[0] === window) {
                    return 500;
                } else {
                    return heightOriginal.apply(this, arguments);
                }
            });
        });

        it("should have top position in 125px", function() {
            trex.helpers.refresh();
            expect($('#test').css('top')).toEqual('125px');
        });
    });

});
