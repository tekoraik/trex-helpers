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
                heightOriginal = $.prototype.height,
                testElement;

            affix('.valign-abs#test');
            $('#test').css('height', "250px");
            testElement = $('#test')[0];
            spyOn($.prototype , 'parent').and.callFake(function () {
                if (this[0] == testElement) {
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

    describe("when there is a element with valign-abs class inside another, 220px height and its parent with height 400px", function () {
        beforeEach(function () {
            affix('#parent .valign-abs#test');
            $('#test').css('height', "220px");
            $('#parent').css('height', "400px");
        });
        it("should have top position = 90px", function() {
            trex.helpers.refresh();
            expect($('#test').css('top')).toEqual('90px');
        });
    });
});
