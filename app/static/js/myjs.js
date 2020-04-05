$(document).ready(function () {
    var sym;

    $('form').submit(function (event) {
        if ($('.ms-sel-ctn').find('.ms-sel-item').length == 0) {
            $('.ms-helper').text("Please Select Some value").show();
            $('.unit').hide();
        }
        else {
            $('.ms-helper').text('').hide();
            var selected = $('.ms-sel-ctn').children().last().children();
            var values = selected.map(function () {
                return $(this).val();
            }).get();

            values = JSON.stringify(values);
            //console.log(values);


            $.ajax({
                data: '{"data":' + values + '}',
                type: "POST",
                url: "/predict",
                dataType: "json",
            }).done(function (data) {
                //$('#write').text(data.columns.length).show();
                sym = data.dis_sym;
                $('.unit').css('margin-top', '55px');
                var table = $('#write');

                table.attr('style', 'padding: 20px 20px; background: linear-gradient(rgba(128,206,214,.8), rgba(128,206,214,.8)); border-radius: 10px; margin: 5px 50px -5px 50px');
                $('#myTable_wrapper').remove();
                var crtTable = $('<table id="myTable" class="table table-striped table-hover table-fixed"/>');
                var content = '<thead>' +
                    '<tr><th scope="col">#</th>' +
                    '<th scope = "col">Disease Name</th>' +
                    '<th scope = "col">Probability</th></tr></thead>' +
                    '<tbody id="tBody">';
                for (i = 0; i < data.columns.length; i++) {
                    content += '<tr><th scope="row" style=""><input type="button" class="btn btn-shadow" value="+" style="border: 4px solid WHITE; border-radius: 50%; background: #99ffcc;"></th>' +
                        '<td tabindex="0" class="" style="">' + data.columns[i] + '</td>' +
                        '<td>' + data.data[0][i] + '</td></tr>';
                }
                content += '</tbody>';
                crtTable.append(content);
                table.append(crtTable);
                $('thead, tbody').css('display', 'block');
                $('table').css('table-layout', 'fixed');
                $('tbody').css('height', '400px');
                $('tbody').css('width', '100%');
                $('tbody').css('overflow-x','hidden');
                $('table').css('overflow-y', 'auto');
                $('html, body').animate({
                    scrollTop: $('.unit').offset().top
                }, 800);

                $('#myTable').DataTable({});
                //$('#myTable_wrapper').attr('style','height: 400px; overflow-y: auto');
                $('tbody, thead').attr('style', '')
                $('input[type=button]').click(function () {
                    //console.log(i-119,sym[i-119]);
                    if ($(this).attr('value') == '+') {
                        $('tbody').find('th').each(function () {
                            if ($(this).children().attr('value') == '-') {
                                $(this).children().attr('value', '+');
                                $(this).children().css('background', '#99ffcc');
                            };
                        });
                        $('#added').remove();
                        var newRow = $('<tr id="added"/>');
                        var val = $(this).parents().closest('tr');
                        var get_dis = val.children(':eq(1)').html();
                        var get_sym = sym[get_dis
                        ];
                        $(this).attr('value', '-');
                        $(this).css('background', '#ff3333');
                        $(this).css('width', '41.1px');

                        var addButton = $('<div/>');
                        for (var i = 0; i < get_sym.length; i++) {
                            addButton.append($('<button class="btn" style="margin-top: 5px; border-radius: 7px">').append(get_sym[i])).append('&nbsp;&nbsp;');
                        }

                        var cols = '<td></td><td colspan="2"> ' + addButton.html() + ' </td>';
                        newRow.append(cols);
                        newRow.insertAfter(val);
                    }
                    else {
                        $(this).attr('value', '+');
                        $(this).css('background', '#99ffcc');
                        $('#added').remove();
                    }
                    //console.log(val);
                })
            })

            $('.unit').show();
        }
        event.preventDefault();

    });


    //$('#myTable').DataTable();
    //document.getElementById('write').innerHTML = selected;
});