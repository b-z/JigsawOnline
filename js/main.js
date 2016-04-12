var GAME1_SIZE = 3;
var GAME2_SIZE = 3;
var GAME3_SIZE = 3;
var game1_img_list = [];
var game2_img_list = [];
var game3_img_list = [];
var game3_list = [];
var flag_can_move = false;
var flag_on_touch = false;
var stage = 1;
var loadCount = GAME1_SIZE * GAME1_SIZE + GAME2_SIZE * GAME2_SIZE + GAME3_SIZE * GAME3_SIZE + 3;
var loadCountTotal = loadCount;
var game2_random_move_count = 100;
var game2_last_choose = 0;
var game3_flip_count = GAME3_SIZE * GAME3_SIZE;
var game3_word = '公益文化';
var touch_start_point = {
	x: 0,
	y: 0
};

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

function loadImage() {
	$('#game_section1 #img_area').html('<img src="img/Lenna.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);">');
	$('#game_cache').append('<img class="game1_imgback" src="img/back2.jpg" width=100% onload="loadCount--;checkLoad(loadCount, 1);">');
	$('#game_cache').append('<img class="game3_imgback" src="img/back.jpg" width=100% onload="loadCount--;checkLoad(loadCount, 1);">');

	var text = '';
	for (var i = 0; i < GAME1_SIZE; i++) {
		text += '<tr>';
		for (var j = 0; j < GAME1_SIZE; j++) {
			var idx = i * GAME1_SIZE + j + 1;
			text += '<td><div id="game1_img' + idx + '_container"><img id="game1_img' + idx + '" src="img/Lenna_0' + idx + '.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);"></div></td>';
		}
		text += '</tr>';
	}
	$('#game_section1 table').html(text);
	game1_img_list = [];
	for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
		game1_img_list.push($('#game1_img' + (i + 1)));
	}

	text = '';
	for (var i = 0; i < GAME2_SIZE; i++) {
		text += '<tr>';
		for (var j = 0; j < GAME2_SIZE; j++) {
			var idx = i * GAME2_SIZE + j + 1;
			text += '<td><div id="game2_img' + idx + '_container"><img id="game2_img' + idx + '" src="img/Lenna2_0' + idx + '.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);"></div></td>';
		}
		text += '</tr>';
	}
	$('#game_section2 table').html(text);
	game2_img_list = [];
	for (var i = 0; i < GAME2_SIZE * GAME2_SIZE; i++) {
		game2_img_list.push($('#game2_img' + (i + 1)));
	}

	text = '';
	var ints = randomInts(GAME3_SIZE * GAME3_SIZE);
	for (var i = 0; i < GAME3_SIZE; i++) {
		text += '<tr>';
		for (var j = 0; j < GAME3_SIZE; j++) {
			var idx = i * GAME3_SIZE + j + 1;
			var pos = ints.indexOf(idx);
			var name = '随机' [Math.floor(2 * Math.random())];
			if (pos < 4) {
				name = game3_word[pos];
			}
			game3_list.push(name);
			text += '<td><div id="game3_img' + idx + '_container"><img alt="' + name + '" id="game3_img' + idx + '" src="img/' + name + '.png" width=100% onload="loadCount--;checkLoad(loadCount, 1);"></div></td>';
		}
		text += '</tr>';
	}
	$('#game_section3 table').html(text);
	game3_img_list = [];
	for (var i = 0; i < GAME3_SIZE * GAME3_SIZE; i++) {
		game3_img_list.push($('#game3_img' + (i + 1)));
	}
}

function checkLoad(count, section) {
	console.log(count);
	var txt = '99.';
	for (var i = 0; i < loadCountTotal - count; i += 3) {
		txt += '9';
	}
	txt += '%';
	$('#loading span').html(txt);
	if (count == 0) {
		$('#loading').hide();
		// initGame1();
		$('#game_section' + section).show();
		countdown($('#game_section' + section + ' .countdown'), 5, game1Random);
	}
}

function game1Random() {
	$('#game_section1 .mask').hide();
	// TODO: 这里还要加上一些动画OMG...
	// UPDATE: 动画来啦 啦啦啦

	$('#game_section1 td div').html($('.game1_imgback'));

	var limit = {
		x1: $('#game1_img1_container').offset().left,
		y1: $('#game1_img1_container').offset().top,
		x2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().left,
		y2: $('#game1_img' + (GAME1_SIZE * GAME1_SIZE) + '_container').offset().top
	};
	var ints = randomInts(GAME1_SIZE * GAME1_SIZE);
	for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
		game1Animate(i + 1, limit, ints, 5);
	}
}

function game2Random() {
	game2_random_move_count--;
	if (game2_random_move_count <= 0) {
		flag_can_move = true;
		return;
	}
	var empty_id = GAME2_SIZE * GAME2_SIZE;
	var container1 = $('#game2_img' + empty_id).parent();
	var container2;
	var idx1 = container1.attr('id').split('img')[1].split('_')[0] - 0;
	var idx2;
	while (true) {
		idx2 = Math.ceil(Math.random() * GAME2_SIZE * GAME2_SIZE);
		// console.log(idx1, idx2);
		if (game2CheckValid(idx1, idx2)) {
			container2 = $('#game2_img' + idx2 + '_container');
			var childIdx = container2.children().attr('id').split('img')[1] - 0;
			if (childIdx == game2_last_choose) {
				continue;
			}
			game2_last_choose = childIdx;
			break;
		}
	}
	// console.log(container1, container2);
	exchangeFast(container1, container2, game2Random);
}

function game3Random() {
	for (var i = 0; i < GAME3_SIZE * GAME3_SIZE; i++) {
		game3RandomFlip(i + 1);
	}
}

function game3RandomFlip(idx) {
	setTimeout(function() {
		flip($('#game3_img' + idx + '_container'), idx, function() {
			game3_flip_count--;
			if (game3_flip_count == 0) {
				game3Start();
			}
		});
	}, 500 + Math.random() * 1000);
}

function game3Start() {
	flag_can_move = true;
}

function game3Click(idx) {
	var status = game3Status(idx);
	console.log(status);
	if (game3_word.indexOf(status) >= 0) {
		return;
	}
	var container = $('#game3_img' + idx + '_container');
	flip(container, idx, function() {
		if (game3_word.indexOf(game3_list[idx - 1]) < 0) {
			flag_can_move = false;
			setTimeout(function() {
				flip(container, idx, function() {
					var idx1, idx2;
					while (true) {
						idx1 = Math.floor(Math.random() * GAME3_SIZE * GAME3_SIZE) + 1;
						idx2 = Math.floor(Math.random() * GAME3_SIZE * GAME3_SIZE) + 1;
						if (idx1 != idx2 && game3Status(idx1) == 'back' && game3Status(idx2) == 'back') {
							break;
						}
					}
					var container1 = $('#game3_img' + idx1 + '_container');
					var container2 = $('#game3_img' + idx2 + '_container');
					var t = game3_list[idx1-1];
					game3_list[idx1-1] = game3_list[idx2-1];
					game3_list[idx2-1] = t;
					exchange(container1, container2, function() {
						flag_can_move = true;
					})
				});
			}, 1000);
		} else {
			game3Check();
		}
	});
}

function game3Check() {
	var c = 0;
	for (var i=1;i<=GAME3_SIZE*GAME3_SIZE;i++){
		if (game3_word.indexOf(game3Status(i))>=0){
			c++;
		}
	}
	if (c==game3_word.length){
		game3Finish();
	}
}

function game3Status(idx) {
	var container = $('#game3_img' + idx + '_container');
	var image_now = container[0].children[0].alt;
	return image_now;
}

function game2Move(direction) {
	var empty_id = GAME2_SIZE * GAME2_SIZE;
	var container1 = $('#game2_img' + empty_id).parent();
	var idx1 = container1.attr('id').split('img')[1].split('_')[0] - 0;
	var idx2;
	switch (direction) {
		case 'up':
			idx2 = idx1 + GAME2_SIZE;
			break;
		case 'down':
			idx2 = idx1 - GAME2_SIZE;
			break;
		case 'left':
			idx2 = idx1 + 1;
			break;
		case 'right':
			idx2 = idx1 - 1;
			break;
	}
	if (!game2CheckValid(idx1, idx2)) {
		return false;
	}
	var container2 = $('#game2_img' + idx2 + '_container');
	exchange(container1, container2, game2Check);
	return true;
}

function game2Check() {
	var imgs = $('#game_section2 td').children().children();
	var result = true;
	imgs.each(function(i, e) {
		if ($(e).attr('id').split('img')[1] != 1 + i + '') {
			result = false;
		}
	});
	if (result) {
		game2Finish();
		// console.log(flag_can_move)
	}
	return result;
}

function game2CheckValid(id1, id2) {
	if (id1 <= 0 || id2 <= 0 || id1 > GAME2_SIZE * GAME2_SIZE || id2 > GAME2_SIZE * GAME2_SIZE) {
		return false;
	}
	// return true;
	if (Math.abs(id1 - id2) == GAME2_SIZE) {
		return true;
	}
	if (Math.abs(id1 - id2) == 1) {
		var m = Math.min(id1, id2);
		if (m % GAME2_SIZE == 0) {
			return false;
		}
		return true;
	}
	return false;
}

function game1Animate(idx, limit, ints, count) {
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
		game1Animate(idx, limit, ints, count - 1);
	}, Math.floor(250 * Math.random()));
}

function countdown(item, time, foo) {
	console.log('countdown', time);
	if (time <= 0) {
		foo();
	} else {
		item.html('' + time);
		item.fadeIn(500);
		setTimeout(function() {
			item.hide();
			countdown(item, time - 1, foo);
		}, 1000);
	}
}

function exchangeFast(container1, container2, foo) {
	var temp = flag_can_move;
	flag_can_move = false;
	setTimeout(function() {
		var tmp = container1.children();
		container1.html(container2.children());
		container2.html(tmp);
		flag_can_move = temp;
		flag_on_touch = false;
		foo();
	}, 30);
}

function exchange(container1, container2, foo) {
	var temp = flag_can_move;
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
		flag_can_move = temp;
		flag_on_touch = false;
		foo();
	}, 200);
	// setTimeout(function(){
	//     var tmp = container1.children();
	//     container1.html(container2.children());
	//     container2.html(tmp);
	// }, 400);
}

function flip(container, idx, foo) {
	var temp = flag_can_move;
	flag_can_move = false;
	var axis = (Math.random() > 0.5 ? 'X' : 'Y');
	container[0].children[0].style.transform = 'rotate' + axis + '(90deg)';

	var image_now = game3Status(idx);
	var image = 'back.jpg';
	if (image_now == 'back') {
		image = game3_list[idx - 1] + '.png';
	}
	setTimeout(function() {
		container.html('<img alt="' + image.split('.')[0] + '" src="img/' + image + '" width=100% style="transform:rotate' + axis + '(90deg);">');
		setTimeout(function() {
			container[0].children[0].style.transform = 'rotate' + axis + '(0deg)';
		}, 10);
	}, 200);
	setTimeout(function() {
		flag_can_move = temp;
		foo();
	}, 410);
}

function game1Check() {
	var imgs = $('#game_section1 td').children().children();
	var result = true;
	imgs.each(function(i, e) {
		if ($(e).attr('id').split('img')[1] != 1 + i + '') {
			result = false;
		}
	});
	if (result) {
		game1Finish();
		// console.log(flag_can_move)
		// alert('yeah!');
	}
	return result;
}

function game1Finish() {
	flag_on_touch = false;
	flag_can_move = false;
	stage = 2;
	alert('yeah!');
	$('#game_section1').hide();
	$('#game_section2').show();
	$('#game_section2 .mask').hide();
	game2Random();
}

function game2Finish() {
	flag_on_touch = false;
	flag_can_move = false;
	stage = 3;
	alert('yeah!');
	$('#game_section2').hide();
	$('#game_section3').show();
	$('#game_section3 .mask').hide();
	game3Random();
}

function game3Finish() {
	flag_on_touch = false;
	flag_can_move = false;
	alert('yeah!');
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
	touch_start_point.x = e.changedTouches[e.changedTouches.length - 1].clientX;
	touch_start_point.y = e.changedTouches[e.changedTouches.length - 1].clientY;
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
	} else if (stage == 3) {
		var flags = [];
		for (var i = 0; i < GAME3_SIZE * GAME3_SIZE; i++) {
			flags.push($('#game_section3 td img')[i] != e.srcElement);
		}
		setHoverStyle($('#game_section3 td img'), flags);
	}
	// console.log('start',e)
}

function ontouchmove(e) {
	if (e.srcElement.tagName == 'IMG' || e.srcElement.tagName == 'td') {
		e.preventDefault();
	}
	if (!flag_on_touch) {
		return;
	}
	if (e.srcElement.tagName != 'IMG') {
		return;
	}

	// console.log(e.target);
	var x = e.changedTouches[e.changedTouches.length - 1].clientX;
	var y = e.changedTouches[e.changedTouches.length - 1].clientY;
	var dx = x - touch_start_point.x;
	var dy = y - touch_start_point.y;
	var source = e.srcElement;
	var target = document.elementFromPoint(x, y);


	if (stage == 1) {
		var flags = [];
		for (var i = 0; i < GAME1_SIZE * GAME1_SIZE; i++) {
			flags.push($('#game_section1 td img')[i] != source && $('#game_section1 td img')[i] != target);
		}
		setHoverStyle($('#game_section1 td img'), flags);
	} else if (stage == 2) {
		if (dx * dx + dy * dy > 3000) {
			// 滑动
			flag_on_touch = false;
			if (dx > dy) {
				if (dx > -dy) {
					game2Move('right');
				} else {
					game2Move('up');
				}
			} else {
				if (dx > -dy) {
					game2Move('down');
				} else {
					game2Move('left');
				}
			}
		}
	}
	// console.log(target);
}

function ontouchend(e) {
	// console.log(e);
	if (!flag_on_touch) {
		return;
	}
	if (e.srcElement.tagName != 'IMG') {
		return;
	}
	flag_on_touch = false;
	var x = e.changedTouches[e.changedTouches.length - 1].clientX;
	var y = e.changedTouches[e.changedTouches.length - 1].clientY;
	var dx = x - touch_start_point.x;
	var dy = y - touch_start_point.y;
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
		if (source == target || target.tagName != 'IMG') {
			return;
		}

		exchange($(source).parent(), $(target).parent(), game1Check);
	} else if (stage == 3) {
		var flags = [];
		for (var i = 0; i < GAME3_SIZE * GAME3_SIZE; i++) {
			flags.push(true);
		}
		setHoverStyle($('#game_section3 td img'), flags);
		if (source != target || target.tagName != 'IMG') {
			return;
		}
		var container = $(target).parent();
		var idx = container.attr('id').split('img')[1].split('_')[0] - 0;
		game3Click(idx);
	} else if (stage == 2) {
		// console.log(dx * dx + dy * dy);
		if (dx * dx + dy * dy < 1000) {
			// 点击
			var empty_id = GAME2_SIZE * GAME2_SIZE;
			var container1 = $('#game2_img' + empty_id).parent();
			var idx1 = container1.attr('id').split('img')[1].split('_')[0] - 0;
			var idx2 = $(target).parent().attr('id').split('img')[1].split('_')[0] - 0;
			if (!game2CheckValid(idx1, idx2)) {
				return false;
			}
			var container2 = $('#game2_img' + idx2 + '_container');
			exchange(container1, container2, game2Check);
		} else {
			if (dx > dy) {
				if (dx > -dy) {
					game2Move('right');
				} else {
					game2Move('up');
				}
			} else {
				if (dx > -dy) {
					game2Move('down');
				} else {
					game2Move('left');
				}
			}
		}
	}

	// console.log('end', e);
}

function onkeydown(e) {
	// console.log(e);
	if (e.keyCode == 32) {
		if (stage == 1) {
			game1Finish();
		} else if (stage == 2) {
			game2Finish();
		}
	}
	if (stage == 2) {
		if (!flag_can_move) {
			return;
		}
		if (e.keyCode == 38) {
			game2Move('up');
		}
		if (e.keyCode == 40) {
			game2Move('down');
		}
		if (e.keyCode == 37) {
			game2Move('left');

		}
		if (e.keyCode == 39) {
			game2Move('right');
		}
	}
}

$(document).ready(function() {
	// initGame1();
	loadImage();
	// document.addEventListener('mousedown', ontouchstart);
	document.addEventListener('touchstart', ontouchstart);
	// document.addEventListener('mousemove', ontouchmove);
	document.addEventListener('touchmove', ontouchmove);
	// document.addEventListener('mouseup', ontouchend);
	document.addEventListener('touchend', ontouchend);
	document.addEventListener('keydown', onkeydown);
});
