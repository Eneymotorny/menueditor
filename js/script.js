'use strict';

$(function() {

	var
		$tools = $('#menuPanelTool'),
		$main = $('#menuContainer');

	var menus = {}, currentMenu = null;

	console.log('all', menus);

	$('#addMenu').on('click', function () {
		var menuID = 'id' + (new Date().getTime());
		var menu = menus[menuID] = setDefaultMenu();

		console.log('build new', menus[menuID]);
		var $menu = $('<div id="' + menuID + '">').addClass().appendTo($main);

		buildMenu(menu, $menu);

		$menu.on('dblclick', function () {
				$main.find('.selected').removeClass('selected');
				$menu.addClass('selected').children('ul').menu();
				$tools.html('');
				$tools.slideDown();
				currentMenu = menuID;
				buildTree(menu, $tools);

				$tools.find('input').on('change', function () {
					var $menu = $('#' + currentMenu);
					readTree(currentMenu);
					$menu.html('');
					buildMenu(menus[currentMenu], $menu);
					$menu.children('ul').menu();
					console.log('rebuild', menus[currentMenu]);
				});

		});

	});
	$('#rebuildMenu').on('click', function () {
		var $menu = $('#' + currentMenu);
		readTree(currentMenu);
		$menu.html('');
		buildMenu(menus[currentMenu], $menu);
		$menu.children('ul').menu();
		console.log('rebuild', menus[currentMenu]);
	});
	$tools.find('input').on('change', function () {
		var $menu = $('#' + currentMenu);
		readTree(currentMenu);
		$menu.html('');
		buildMenu(menus[currentMenu], $menu);
		$menu.children('ul').menu();
		console.log('rebuild', menus[currentMenu]);
	});



	function readTree(dataID) {
		var menu = menus[dataID] = [];
		console.log('read', menu);
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
});
