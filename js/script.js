'use strict';

$(function() {

	var
		$panelTools = $('#menuPanelTool'),
		$tools = $panelTools.children('div'),
		$main = $('#menuContainer');

	var menus = {}, currentMenu = null, nestedLevel = 4;



	$('#addMenu').on('click', function () {
		var menuID = 'id' + (new Date().getTime());
		menus[menuID] = setDefaultMenu();

		console.log('build new', menus[menuID]);
		var $menu = $('<div id="' + menuID + '">').addClass().appendTo($main);

		buildMenu(menus[menuID], $menu);

		$menu.on('click', function () {
			$main.find('.selected').removeClass('selected');
			$menu.addClass('selected');
			$tools.empty();
			currentMenu = menuID;
			buildTree(menus[menuID], $tools);
			addHorizBtn();

			$panelTools.slideDown();
			$tools.find('input').on('change', function () { rebuildAllBinds() });

			$(document).mouseup(function (e){
				if ( currentMenu === menuID
					&& !$menu.is(e.target)
					&& $menu.has(e.target).length === 0
					&& !$panelTools.is(e.target)
					&& $panelTools.has(e.target).length === 0 ) {
						$menu.removeClass('selected');
						currentMenu = null;
						$panelTools.slideUp();
					}
			});
		});

		$menu.children('ul').menu({ items: "> :not(.ui-widget-header)" })
	});

	var $btnAdd = $('#addItem').on('click', function () {
		if ($tools.children('ul').length) {
			var $ul = $tools.children('ul');
		} else {
			$ul = $('<ul>').appendTo($tools)
		}
		var $li = $('<li></li>').appendTo($ul);
		$('<input type="text" placeholder="исп. как разделитель" value="new item">').appendTo($li)
			.on('change', function () { rebuildAllBinds() });
		addBtns($li);
		rebuildAllBinds()
	});
	$('<span>').addClass('ui-icon ui-icon-plusthick').appendTo($btnAdd);

	function setDefaultMenu() {
		return [{
			tag: 'ul',
			nested: [{
				tag: 'li',
				content: 'item 1',
				nested: [{
					tag: 'ul',
					nested: [{
						tag: 'li',
						content: 'item 1.1',
						nested: [{
							tag: 'ul',
							nested: [{
								tag: 'li',
								content: 'item 1.1.1'
							}]
						}]
					}, {
						tag: 'li',
						content: 'item 1.2'
					}]
				}]
			}, {
				tag: 'li',
				content: 'Category 1',
				className: 'ui-widget-header'
			}, {
				tag: 'li',
				content: 'item 2',
				nested: [{
					tag: 'ul',
					nested: [{
						tag: 'li',
						content: 'item 2.1'
					}, {
						tag: 'li',
						content: 'item 2.2'
					}, {
						tag: 'li',
						content: 'item 2.3'
					}]
				}]
			}]
		}];
	}
	function rebuildAllBinds() {
		var $menu = $('#' + currentMenu);
		readTree(currentMenu);
		$menu.empty();
		buildMenu(menus[currentMenu], $menu);
		$menu.children('ul').menu({
			items: "> :not(.ui-widget-header)"
		});
		addHorizBtn()
	}
	function readTree(dataID) {
		var menu = menus[dataID] = [];
		readTreeIter($tools.children(), menu);
console.log('read',menu);

		function readTreeIter(container, data) {
			container.each(function (indx, domElem) {
				var node = data[indx] = {},
					tag = $(domElem)[0].localName,
					content = $(domElem).children('input').val(),
					className = $(domElem)[0].className;

				if (tag === 'ul' || tag === 'li') {
					node.tag = tag;
				}
				if (content) {
					node.content = content;
				}
				if (className) {
					node.className = className
				}

				if ($(domElem).children('ul, li').length) {
					var nested = node.nested = [];
					readTreeIter($(domElem).children('ul, li'), nested)
				}
			});
		}
	}
	function buildTree(data, target) {
		for (var i = 0; i < data.length; i++) {
			var node = data[i];

			if (node.tag) {
				var $tag = $('<' + node.tag + '>').appendTo(target);
				if (node.content) {
					$tag.append('<input type="text" placeholder="исп. как разделитель" value="' + node.content + '">');
						if (node.className) {
							$tag.addClass(node.className)
						}
					addBtns($tag);
				} else if (node.tag === 'li'){
					$tag.append('<input type="text" placeholder="исп. как разделитель">');
					if (node.className) {
						$tag.addClass(node.className)
					}
					addBtns($tag);
				}
			}
			if (node.nested && node.nested.length) {
				buildTree(node.nested, $tag);
			}
		}
	}
	function buildMenu(data, target) {
		for (var i = 0; i < data.length; i++) {
			var node = data[i];

			if (node.tag) { // !
				var $tag = $('<' + node.tag + '>').appendTo(target);
				if (node.content) {
					$tag.append('<div>' + node.content + '</div>');
				}
			}
			if (node.className) {
				$tag.addClass(node.className);
			}
			if (node.nested && node.nested.length) {
				buildMenu(node.nested, $tag);
			}
		}
	}
	function addBtns(target) {
		var $inp = target.children('input');

		var $btnRemove = $('<button>').insertAfter($inp).on('click', function () {
			target.remove();
			rebuildAllBinds()
		});
		$('<span>').addClass('ui-icon ui-icon-close').appendTo($btnRemove);

		if ($(target)[0].className === 'ui-widget-header') {
			var $btnCategoryTrue = $('<button>').insertAfter($inp).on('click', function () {
				target.removeClass('ui-widget-header');
				target.children('ul').removeClass('hide');
				$(target).children('button').remove();
				rebuildAllBinds();
				addBtns(target)
			});
			$('<span>').addClass('ui-icon ui-icon-locked').appendTo($btnCategoryTrue);
		} else {
			var $btnCategory = $('<button>').insertAfter($inp).on('click', function () {
				target.addClass('ui-widget-header');
				target.children('ul').addClass('hide');
				$(target).children('button').remove();
				rebuildAllBinds();
				addBtns(target)
			});
			$('<span>').addClass('ui-icon ui-icon-unlocked').appendTo($btnCategory);
		}

		if (target.parents('ul').length < nestedLevel) {
			var $btnNest = $('<button>').insertAfter($inp)/*.appendTo(target)*/
				.on('click', function () {
					if (target.children('ul').length) {
						var $ul = target.children('ul');
					} else {
						$ul = $('<ul>').appendTo(target)
					}
					rebuildAllBinds();
					var $li = $('<li></li>').appendTo($ul);
					$('<input type="text" placeholder="исп. как разделитель" value="new item">').appendTo($li)
						.on('change', function () { rebuildAllBinds() });
					addBtns($li)
				});
			$('<span>').addClass('ui-icon ui-icon-arrowreturnthick-1-e').appendTo($btnNest)
		}

		/*rebuildAllBinds()*/
	}
	function addHorizBtn() {
		$panelTools.find('.checkboxBtn').remove();
		if (menus[currentMenu][0].className === 'horizontal-menu') {
			$('<button>').addClass('checkboxBtn').text('horizontal').appendTo($panelTools).on('click', function () {
				$tools.children('ul').removeClass('horizontal-menu');
				$(this).remove();
				rebuildAllBinds()
			})
		} else {
			$('<button>').addClass('checkboxBtn').text('vertical').appendTo($panelTools).on('click', function () {
				$tools.children('ul').addClass('horizontal-menu');
				$(this).remove();
				rebuildAllBinds()
			})
		}
	}
});
