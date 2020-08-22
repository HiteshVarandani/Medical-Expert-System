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
            var my_values = selected.map(function () {
                return $(this).val();
            }).get();

            values = JSON.stringify(my_values);
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

                table.attr('style', 'padding: 20px 20px; background: linear-gradient(rgba(128,206,214,.8), rgba(128,206,214,.8)); border-radius: 10px; margin: 5px 50px -5px 50px; min-width:540px;');
                $('#myTable_wrapper').remove();
                var crtTable = $('<table id="myTable" class="table table-striped table-hover"/>');
                var content = '<thead>' +
                    '<tr><th scope="col">#</th>' +
                    '<th scope = "col">Disease Name</th>' +
                    '<th scope = "col">Probability</th></tr></thead>' +
                    '<tbody id="tBody">';
                for (i = 0; i < data.columns.length; i++) {
                    var my_str = JSON.stringify(data.data[0][i]);
                    content += '<tr><th scope="row" style=""><input type="button" class="btn btn-shadow" value="+" style="border: 4px solid WHITE; border-radius: 50%; background: #99ffcc;"></th>' +
                        '<td tabindex="0" class="" style="">' + data.columns[i] + '</td>' +
                        '<td>' + my_str.substring(0,my_str.indexOf('.')+5) + '</td></tr>';
                     
                }
                content += '</tbody>';
                crtTable.append(content);
                table.append(crtTable);
                $('table').css('float','left');
                $('table').css('clear','left');
                $('table').css('min-width','500px');
                $('table').css('overflow-y', 'auto');
                $('html, body').animate({
                    scrollTop: $('.unit').offset().top
                }, 800);

                $('#myTable').DataTable({
                    
                });
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
                        var get_sym = sym[get_dis];
                        var diffSym = val.children(':eq(2)');
                        $('tbody').find('tr').each(function () {
                            $(this).children(':eq(2)').children().remove();
                        })

                        $(this).attr('value', '-');
                        $(this).css('background', '#ff3333');
                        $(this).css('width', '41.1px');

			var select = $('<select class="select">');
			var op_tre = $('<option/>');
			var op_inv = $('<option/>');

			op_tre.text("Treatement");
			op_tre.attr('value', 'Treatement');
			op_tre.attr('selected', 'true');

			op_inv.text("Laboratory Tests");
			op_inv.attr('value', 'Laboratory Tests');

			select.append(op_tre);
			select.append(op_inv);

                        var addButton = $('<div/>');
                        var diffButton = $('<div/>');
                        diffButton.attr('style','display: inline; float: right; margin-right: 8px;');
                        diffButton.append('<button class="diff">diff</button>&nbsp;&nbsp;&nbsp;');
			
			diffButton.append(select);
			diffButton.append('&nbsp;&nbsp;<button class="invest">Search</button>');
                        diffSym.append(diffButton);

                        for (var i = 0; i < get_sym.length; i++) {
                            var has = false;
                            for (var j = 0; j < my_values.length; j++) {
                                if (get_sym[i] == my_values[j]) {
                                    has = true;
                                    break;
                                }
                            }
                            if(has) {
                                addButton.append($('<button class="myclass active btn glyphicon glyphicon-ok" style="background: #b3ffd9; margin-top: 5px; border-radius: 7px; box-shadow: 0 0 3px #1f5a60">').append('&nbsp;').append(get_sym[i])).append('&nbsp;&nbsp;');
                            }
                            else
                                addButton.append($('<button class="myclass btn glyphicon glyphicon-ok" style="margin-top: 5px; border-radius: 7px; box-shadow: 0 0 3px #1f5a60">').append('&nbsp;').append(get_sym[i])).append('&nbsp;&nbsp;');
                        }

                        var cols = '<td><button class="mybutton">Refresh</button></td><td> ' + addButton.html() + ' </td><td></td>';
                        newRow.append(cols);
                        newRow.insertAfter(val);
                        $('.myclass').click(function () {
                            if($(this).hasClass('active')) {
                                $(this).css('background','');
                                $(this).removeClass('active');
                                var rm = $(this).html().replace(/&nbsp;/g, '');;
                                
                                my_values = my_values.filter(function (value, index) {
                                    return value != rm
                                })
                                
                            }
                            else {
                                $(this).css('background','#b3ffd9');
                                $(this).addClass('active');
                                var rm = $(this).html().replace(/&nbsp;/g, '');;
                                
                                my_values.unshift(rm);

                            }
                        })
                        $('.diff').click(function() {
                            var dis_1 = $(this).parents().closest('tr').children(':eq(1)').html()
                            var dis_2 = $(this).parents().closest('tr').nextAll('tr').eq(1).children(':eq(1)').html()
                            var diff = $(this).parents().closest('tr').next('tr').children(':eq(2)')
                            $.ajax({
                                type: "POST",
                                url: `/differ/${dis_1}/${dis_2}`,
                            }).done(function (data) {
                                data = JSON.parse(data)
				diff.html('');
                                diff.append(`Symptoms that are present in <strong>${dis_1}</strong> but not in <strong>${dis_2}</strong>`)
                                for (var i = 0; i < data.length; i++) {
                                    diff.append(`<div style="margin-top: 7px; background: yellow">${data[i]}</div>`)
                                }
                            })
                        })
			var getSel = $('select.select').children('option:selected').val();
			$('select.select').change(function () {
				getSel = $(this).children('option:selected').val();
			})
			$('.invest').click(function () {
			    $('.modal').attr('style','display: block');
                            var dis_1 = $(this).parents().closest('tr').children(':eq(1)').html()
			    
			    $.ajax({
				type: "POST",
				url: `/invest/${dis_1}`,
				data: getSel
			    }).done(function (data) {
                                $('#myModal div p').empty();
				$('#myModal div p').html('Before reaching out doctor, the patient can take <strong>precautionary steps </strong><br>as per the system like taking basic <strong>treatement and tests</strong> shown:<br> ');
				$('#myModal div p').append(data);
			    })
				
			})
			$('.mybutton').click(function () {
				//console.log($(this).parents().closest('tr').children(':eq(1)').children());
				values = JSON.stringify(my_values);
				//console.log(values);
				var ajax_done = $.ajax({
					type: "POST",
					url: "/predict",
					dataType: "json",
					data: '{"data":'+values+'}',
				})
				$('.modal').attr('style','display: block');

				ajax_done.done(function (data) {
                                        $('.modal div p').html('');
					$('.modal div p').append('<h4>Updated data as followed:</h4><br>');
					
					var table = $('<table id="" class="table"/>');
					for(var i=0; i<data.columns.length; i++) {
						table.append(`<tr><td>${data.columns[i]}</td><td>${data.data[0][i]}</td></tr>`)
					}
					$('#myModal div p').append(table);
				})
			})

			$('.close').click(function () {
                                $('.modal div p').empty();
				$('.modal').attr('style','display: none');
			})

			$(window).click(function (event) {
				
				if (event.target == $('.modal')[0]) {
	                                $('modal div').empty();
					$('.modal').attr('style','display: none');
				}
			})

                    }
                    else {
                        $(this).attr('value', '+');
                        $(this).css('background', '#99ffcc');
                        $('#added').remove();

                        var newRow = $('<tr id="added"/>');
                        var val = $(this).parents().closest('tr');
                        var diffSym = val.children(':eq(2)');
                        diffSym.children().remove();

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
