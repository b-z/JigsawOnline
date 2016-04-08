var GAME1_SIZE = 3;
var game1_img_list = [];

function randomInts(range) {
	// 产生[1，range]的随机整数
	var res = [];
	while (res.length < range) {
		var num = Math.ceil(Math.random() * range);
		// console.log(num);
		if (res.indexOf(num) >= 0 || res.length + 1 == num) {
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
	// item[0].innerHTML = '';

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
	// console.log(1);
	// $('td').css('padding','0.8%');
	$('#game_section1 .mask').hide();
	// TODO: 这里还要加上一些动画OMG...
	// UPDATE: 动画来啦 啦啦啦

	$('td div').html($('.game1_imgback'));
	// $('td div').each(function(i, e) {
	//     console.log(e);
	//     $(e).css('transform', 'rotateX('+Math.random()*360+')')
	// });

	var limit = {
		x1: $('#game1_img1_container').offset().left,
		y1: $('#game1_img1_container').offset().top,
		x2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().left,
		y2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().top
	};
	var ints = randomInts(GAME1_SIZE * GAME1_SIZE);
	for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
		animate(i + 1, limit, ints, 3);
	}
	console.log(11);

	// setTimeout(function() {
	// 	console.log(22);
	// 	var ints = randomInts(GAME1_SIZE * GAME1_SIZE);
	// 	for (var i = 0; i < GAME1_SIZE; i++) {
	// 		for (var j = 0; j < GAME1_SIZE; j++) {
	// 			var idx = i * GAME1_SIZE + j + 1;
	// 			$('#game1_img' + idx + '_container').html(game1_img_list[ints[idx - 1] - 1]);
	// 			console.log(idx);
	// 		}
	// 	}
	// }, 1800);

	// $('td div img').css('opacity', '0');
}

function animate(idx, limit, ints, count) {
	console.log('ani', count);
	if (count < 0) {
		return;
	}
	if (count == 0) {
		setTimeout(function() {
			// for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
			$('#game1_img' + idx + '_container')[0].children[0].style.transform =
				'translate(' + (idx==1?-200:0) + 'px,' + (idx==1?-100:0) + 'px) rotate(' + 0 + 'deg)';
			// }
			// $('#game1_img' + idx + '_container').html(game1_img_list[ints[idx - 1] - 1]);
		}, Math.floor(500 * Math.random()));
		return;
	}
	setTimeout(function() {
		// for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {

		var offset = $('#game1_img' + idx + '_container').offset();
		var transXlow = limit.x1 - offset.left;
		var transXhigh = limit.x2 - offset.left;
		var transYlow = limit.y1 - offset.top;
		var transYhigh = limit.y2 - offset.top;
		// console.log(limit.y2-offset.top)
		var transX = transXlow + Math.random() * (transXhigh - transXlow);
		var transY = transYlow + Math.random() * (transYhigh - transYlow);
		console.log(idx, transXlow, transXhigh, transX);
		$('#game1_img' + idx + '_container')[0].children[0].style.transform =
			'translate(' + 1.5 * transX + 'px,' + 1.5 * transY + 'px)' +
			'rotate(' + (-360 + Math.random() * 720) + 'deg) ';
		// }
		animate(idx, limit, ints, count - 1);
	}, Math.floor(500 * Math.random()));
}

function countdown(item, time, foo) {
	if (time <= 0) {
		foo();
		return;
	}
	item[0].innerHTML = '' + time;
	item.fadeIn(500);
	setTimeout(function() {
		item.hide();
		countdown(item, time - 1, foo);
	}, 1000);
}

$(document).ready(function() {
	initGame1();
});
