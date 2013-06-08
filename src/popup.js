(function(){
	"use strict";
	var $prefix = document.getElementById('prefix'),
		$settingForm = document.getElementById('setting'),
		$showKey = document.getElementById('showKey'),
		bgPage = chrome.extension.getBackgroundPage();

	var onChange = function(){
		var prefixStr = $prefix.value.replace(/\\n/g,'\n');
		bgPage.CC.text.onConfigChange('prefix', prefixStr);
	};
	$prefix.value = (localStorage.getItem('prefix') || '').replace(/\n/g,'\\n');
	$prefix.addEventListener('change', onChange, false);
	$settingForm.addEventListener('submit',function(e){
		e.preventDefault();
		//onChange();
		window.removeEventListener('unload', onChange, false);
		window.close();
	}, false);
	window.addEventListener('unload', onChange, false);

	$showKey.checked = Boolean(localStorage.getItem('showKey'));
	$showKey.addEventListener('click', function(){
		bgPage.CC.text.onConfigChange('showKey', $showKey.checked);
	}, false);
})();

(function(){
	"use strict";
	var $imgtoolForm = document.getElementById('imgtool'),
		$submitBtn = document.getElementById('submit'),
		$stopBtn = document.getElementById('stop'),
		$page = document.getElementById('page'),
		$progressBar = document.getElementById('progress'),
		bgPage = chrome.extension.getBackgroundPage();
	var hide = function($el){
			$el.style.display = 'none';
		},
		show = function($el){
			$el.style.display = '';
		};

	var checkState = function(){
		var state = bgPage.CC.image.getImgToolState();
		// console.info(state.state);
		if(state.state === 1){
			$progressBar.value = state.progress * 100;
			// console.info(state.progress * 100);
			setTimeout(checkState, 200);
		}else{
			show($submitBtn);
			show($page);
			hide($stopBtn);
			hide($progressBar);
		}
	}

	hide($submitBtn);
	hide($page);
	show($stopBtn);
	show($progressBar);
	checkState();

	$imgtoolForm.addEventListener('submit',function(e){
		e.preventDefault();
		var pageCount = $page.value;
		if(pageCount && isFinite(pageCount)){
			hide($submitBtn);
			hide($page);
			show($stopBtn);
			show($progressBar);
			chrome.tabs.getSelected(null,function(tab){
				bgPage.CC.image.startImgTool(pageCount,tab.id);
				checkState();
			});
		}
	}, false);
	$stopBtn.addEventListener('click',function(){
		bgPage.CC.image.stopImgTool();
	}, false);
})();