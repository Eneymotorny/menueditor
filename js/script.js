'use strict';

$(function() {

	var
		$panelTools = $('#menuPanelTool'),
		$tools = $panelTools.children('div'),
		$main = $('#menuContainer');

	var menus = {}, currentMenu = null, nestedLevel = 3;

	console.log('all', menus);


	$('#addMenu').on('click', function () {
		var menuID = 'id' + (new Date().getTime());
		menus[menuID] = setDefaultMenu();

		console.log('build new', menus[menuID]);
		var $menu = $('<div id="' + menuID + '">').addClass().appendTo($main);

		buildMenu(menus[menuID], $menu);

		$menu.on('dblclick', function () {
				$main.find('.selected').removeClass('selected');
				$menu.addClass('selected')/*.children('ul').menu()*/;
				$tools.html('');
				currentMenu = menuID;
				buildTree(menus[menuID], $tools);
				$panelTools.slideDown();
				$tools.find('input').on('change', function () { rebuildAllBind() });
		});
		$menu.children('ul').menu()
	});
	$('#rebuildMenu').on('click', function () { rebuildAllBind() });
	var $btnAdd = $('#addItem').on('click', function () {
		if ($tools.children('ul').length) {
			var $ul = $tools.children('ul');
		} else {
			$ul = $('<ul>').appendTo($tools)
		}
		var $li = $('<li><input type="text"></li>').appendTo($ul);
		addBtns($li)
	});
	$('<span>').addClass('ui-icon ui-icon-plusthick').appendTo($btnAdd);

	function rebuildAllBind() {
		var $menu = $('#' + currentMenu);
		readTree(currentMenu);
		$menu.html('');
		buildMenu(menus[currentMenu], $menu);
		$menu.children('ul').menu();
		$tools.find('input').on('change', function () { rebuildAllBind() });
		/*console.log('rebuild', menus[currentMenu]);*/
	}
	function readTree(dataID) {
		var menu = menus[dataID] = [];
		/*console.log('read', menu);*/
		readTreeIter($tools.children(), menu);

		function readTreeIter(container, data) {
			container.each(function (indx, domElem) {
				var obj = data[indx] = {},
					tag = $(domElem)[0].localName,
					content = $(domElem).children('input').val();
				if (tag === 'ul' || tag === 'li') {
					obj.tag = tag;
				}
				if (content) {
					obj.content = content
				}
				if ($(domElem).children('ul, li').length) {
					var nested = obj.nested = [];
					readTreeIter($(domElem).children('ul, li'), nested)
				}
			});
		}
	}
	function buildTree(data, target) {
		for (var i = 0; i < data.length; i++) {
			var node = data[i];

			if (node.tag) { // !
				var $tag = $('<' + node.tag + '>').appendTo(target);
				if (node.content) {
					$tag.append('<input type="text" value="' + node.content + '">');
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
			if (node.nested && node.nested.length) {
				buildMenu(node.nested, $tag);
			}
		}
	}
	function setDefaultMenu() {
		return [{
			tag: 'ul',
			/*id: id,*/
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
			}, {
				tag: 'li',
				content: 'item 3'
			}]
		}];
	}
	function addBtns(target) {
		if (target.parents('ul').length < nestedLevel) {
			var $btnNest = $('<button>').appendTo(target)
				.on('click', function () {
					if (target.children('ul').length) {
						var $ul = target.children('ul');
					} else {
						$ul = $('<ul>').appendTo(target)
					}
					rebuildAllBind();
					var $li = $('<li></li>').appendTo($ul);
					$('<input type="text">').appendTo($li)
						.on('change', function () { rebuildAllBind() });
					addBtns($li)
				});
			$('<span>').addClass('ui-icon ui-icon-arrowreturnthick-1-e').appendTo($btnNest)
		}
		var $btnRemove = $('<button>').appendTo(target).on('click', function () {
			target.remove();
			rebuildAllBind()
		});
		$('<span>').addClass('ui-icon ui-icon-close').appendTo($btnRemove);
		rebuildAllBind()
	}
});
