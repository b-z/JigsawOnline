var GAME1_SIZE = 3;
var game1_img_list = [];
var flag_can_move = false;
var flag_on_touch = false;
var stage = 1;

function randomInts(range) {
	// 产生[1，range]的随机整数
	var res = [];
	while (res.length < range) {
		var num = Math.ceil(Math.random() * range);
		if (res.indexOf(num) >= 0 || (res.length + 1 == num && num != range)) {
			continue;
		}
		res.push(num);
	}
	return res;
}

function initGame1() {
	loadCount = GAME1_SIZE * GAME1_SIZE + 2;
	$('#game_section1 #img_area')[0].innerHTML = '<img src="img/Lenna.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);">'
	$('#game1_cache').append('<img class="game1_imgback" src="img/doge.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);">');
	var item = $('#game_section1 table');

	var text = '';
	for (var i = 0; i < GAME1_SIZE; i++) {
		text += '<tr>';
		for (var j = 0; j < GAME1_SIZE; j++) {
			var idx = i * GAME1_SIZE + j + 1;
			text += '<td><div id="game1_img' + idx + '_container"><img id="game1_img' + idx + '" src="img/Lenna_0' + idx + '.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);"></div></td>';
		}
		text += '</tr>';
	}

	item[0].innerHTML = text;
	game1_img_list = [];
	for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
		game1_img_list.push($('#game1_img' + (i + 1)));
	}

	// var cell = $('#game_section1 td');
	// $('#game_section_area ')

}

function checkLoad(count, section) {
	var txt = '.';
	for (var i = 0; i < count % 4; i++) {
		txt += '.';
	}
	$('#loading span')[0].innerHTML = txt;
	if (count == 0) {
		$('#loading').hide();
		$('#game_section' + section).show();
		countdown($('#game_section' + section + ' .countdown'), 5, game1Random);
	}
}

function game1Random() {
	$('#game_section1 .mask').hide();
	// TODO: 这里还要加上一些动画OMG...
	// UPDATE: 动画来啦 啦啦啦

	$('td div').html($('.game1_imgback'));

	var limit = {
		x1: $('#game1_img1_container').offset().left,
		y1: $('#game1_img1_container').offset().top,
		x2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().left,
		y2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().top
	};
	var ints = randomInts(GAME1_SIZE * GAME1_SIZE);
	for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
		animate(i + 1, limit, ints, 5);
	}
}

function animate(idx, limit, ints, count) {
	// console.log('ani', count);
	if (count < 0) {
		return;
	}
	if (count == 0) {
		setTimeout(function() {
			$('#game1_img' + idx + '_container')[0].children[0].style.transform =
				'translate(' + 0 + 'px,' + 0 + 'px) rotate(' + 0 + 'deg)';
			setTimeout(function() {
				$('#game1_img' + idx + '_container').html(game1_img_list[ints[idx - 1] - 1]);
				flag_can_move = true;
			}, 500 * Math.random());
		}, Math.floor(250 * Math.random()));
		return;
	}
	setTimeout(function() {
		var offset = $('#game1_img' + idx + '_container').offset();
		var transXlow = limit.x1 - offset.left;
		var transXhigh = limit.x2 - offset.left;
		var transYlow = limit.y1 - offset.top;
		var transYhigh = limit.y2 - offset.top;
		var transX = transXlow + Math.random() * (transXhigh - transXlow);
		var transY = transYlow + Math.random() * (transYhigh - transYlow);
		$('#game1_img' + idx + '_container')[0].children[0].style.transform =
			'translate(' + 1 * transX + 'px,' + 1 * transY + 'px)' +
			'rotate(' + (-360 + Math.random() * 720) + 'deg) ';
		animate(idx, limit, ints, count - 1);
	}, Math.floor(250 * Math.random()));
}

function countdown(item, time, foo) {
	console.log('countdown', time);
	if (time <= 0) {
		foo();
	} else {
		item[0].innerHTML = '' + time;
		item.fadeIn(500);
		setTimeout(function() {
			item.hide();
			countdown(item, time - 1, foo);
		}, 1000);
	}
}

function exchange(container1, container2, foo) {
	flag_can_move = false;
	var offset1 = container1.offset();
	var offset2 = container2.offset();
	var transX = offset2.left - offset1.left;
	var transY = offset2.top - offset1.top;
	container1[0].children[0].style.transform = 'translate(' + 1 * transX + 'px,' + 1 * transY + 'px)';
	container2[0].children[0].style.transform = 'translate(' + (-1) * transX + 'px,' + (-1) * transY + 'px)';

	setTimeout(function() {
		container1[0].children[0].style.transform = 'translate(' + 0 + 'px,' + 0 + 'px)';
		container2[0].children[0].style.transform = 'translate(' + 0 + 'px,' + 0 + 'px)';
		var tmp = container1.children();
		container1.html(container2.children());
		container2.html(tmp);
		foo();
		flag_can_move = true;
		flag_on_touch = false;
	}, 200);
	// setTimeout(function(){
	//     var tmp = container1.children();
	//     container1.html(container2.children());
	//     container2.html(tmp);
	// }, 400);
}

function game1_check() {
	var imgs = $('#game_section1 td').children().children();
	var result = true;
	imgs.each(function(i, e) {
		console.log(e);
		if ($(e).attr('id').split('img')[1] != 1 + i + '') {
			result = false;
		}
	});
    if (result){
        alert('yeah!');
    }
	return result;
}

function setHoverStyle(elements, remove) {
	elements.each(function(i, e) {
		var target = $(e);
		if (!remove[i]) {
			target.css('border-radius', '2em').css('opacity', '0.5');
		} else {
			target.css('border-radius', '0.3em').css('opacity', '1');
		}
	});
}

function ontouchstart(e) {
	if (!flag_can_move) {
		return;
	}
	if (e.srcElement.tagName != 'IMG') {
		return;
	}
	flag_on_touch = true;
	if (stage == 1) {
		var flags = [];
		for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
			flags.push($('#game_section1 td img')[i] != e.srcElement);
		}
		setHoverStyle($('#game_section1 td img'), flags);
	}
	// console.log('start',e)
}

function ontouchmove(e) {
	if (!flag_on_touch) {
		return;
	}
	if (e.srcElement.tagName == 'IMG' || e.srcElement.tagName == 'td') {
		e.preventDefault();
	}
	if (e.srcElement.tagName != 'IMG') {
		return;
	}

	// console.log(e.target);
	var x = e.changedTouches[e.changedTouches.length - 1].clientX;
	var y = e.changedTouches[e.changedTouches.length - 1].clientY;
	var source = e.srcElement;
	var target = document.elementFromPoint(x, y);


	if (stage == 1) {
		var flags = [];
		for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
			flags.push($('#game_section1 td img')[i] != source && $('#game_section1 td img')[i] != target);
		}
		setHoverStyle($('#game_section1 td img'), flags);
	}
	// console.log(target);
}

function ontouchend(e) {
	if (!flag_on_touch) {
		return;
	}
	if (e.srcElement.tagName != 'IMG') {
		return;
	}
	flag_on_touch = false;
	var x = e.changedTouches[e.changedTouches.length - 1].clientX;
	var y = e.changedTouches[e.changedTouches.length - 1].clientY;
	var source = e.srcElement;
	// var sourceid = source.id.split('img')[1];
	var target = document.elementFromPoint(x, y);
	// var targetid = target.id.split('img')[1];
	if (stage == 1) {
		var flags = [];
		for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
			flags.push(true);
		}
		setHoverStyle($('#game_section1 td img'), flags);
        if (source==target || target.tagName != 'IMG'){
            return;
        }

		exchange($(source).parent(),
			$(target).parent(), game1_check);
	}
	// console.log('end', e);
}

$(document).ready(function() {
	initGame1();
	// document.addEventListener('mousedown', ontouchstart);
	document.addEventListener('touchstart', ontouchstart);
	// document.addEventListener('mousemove', ontouchmove);
	document.addEventListener('touchmove', ontouchmove);
	// document.addEventListener('mouseup', ontouchend);
	document.addEventListener('touchend', ontouchend);
});
