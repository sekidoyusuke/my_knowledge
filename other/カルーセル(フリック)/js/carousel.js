var LEIHAUOLI = LEIHAUOLI || {};

LEIHAUOLI.CAROUSEL = {
	INDICATOR_CURRENT_CLASS : 'current',
	MOVE_TIME : 300,
	AUTO_MOVE_INTERVAL : 5000,
	THRESHOLD : 75,
	
	init : function(){
		this.setParameters();
		this.createIndicators();
		this.prepareToExecuteCarousel();
		this.bindEvent();
	},
	setParameters : function(){
		this.$wrapper = $('#jsi-carousel-wrapper');
		this.$container = $('#jsi-carousel-container');
		this.$previous = $('#jsi-previous-trigger');
		this.$next = $('#jsi-next-trigger');
		this.$indicatorContainer = $('#jsi-indicator-container');
		this.imageWidth = this.$wrapper.width();
		this.imageCount = this.$container.children().size();
		this.currentIndex = 1;
		
		this.swipeOptions = {
			triggerOnTouchEnd : true,
			swipeStatus : $.proxy(this.swipeStatus, this),
			allowPageScroll : 'vertical',
			threshold : this.THRESHOLD
		};
	},
	createIndicators : function(){
		var $indicatorTemplate = this.$indicatorContainer.children().detach(),
			fragment = document.createDocumentFragment();
		
		for(var i = 0, count = this.imageCount; i < count; i++){
			fragment.appendChild($indicatorTemplate.clone().get(0));
		}
		this.$indicatorContainer.get(0).appendChild(fragment);
		this.$indicators = this.$indicatorContainer.find('a');
		this.$indicators.eq(0).addClass(this.INDICATOR_CURRENT_CLASS);
	},
	prepareToExecuteCarousel : function(){
		var $lis = this.$container.children();
		
		this.$container.width(this.imageWidth * (this.imageCount + 2));
		this.$container.prepend($lis.eq(this.imageCount - 1).clone());
		this.$container.append($lis.eq(0).clone());
		this.scrollImages(this.imageWidth, 0);
	},
	bindEvent : function(){
		var myself = this;
		
		this.$previous.on('click', $.proxy(this.moveToPrevious, this));
		this.$next.on('click', $.proxy(this.moveToNext, this));
		this.$indicators.each(function(index){
			$(this).on('click', function(event){
				myself.moveByIndicator(event, index + 1);
			});
		});
		this.$container.swipe(this.swipeOptions);
		this.$container.on('transitionend webkitTransitionEnd', $.proxy(this.finishToMove, this));
	},
	swipeStatus : function(event, phase, direction, distance){
		if(phase == 'move'){
			if(direction == 'left'){
				this.scrollImages(this.imageWidth * this.currentIndex + distance, 0);
			}else if (direction == 'right'){
				this.scrollImages(this.imageWidth * this.currentIndex - distance, 0);
			}
		}else if(phase == 'cancel'){
			this.scrollImages(this.imageWidth * this.currentIndex, this.SLIDE_INTERVAL);
		}else if(phase == 'end'){
			if(direction == 'right'){
				this.moveToPrevious();
			}else if(direction == 'left'){
				this.moveToNext();
			}
		}
	},
	moveToPrevious : function(event){
		if(event){
			event.preventDefault();
		}
		this.currentIndex = Math.max(this.currentIndex - 1, 0);
		this.scrollImages(this.imageWidth * this.currentIndex, this.MOVE_TIME);
	},
	moveToNext : function(event){
		if(event){
			event.preventDefault();
		}
		this.currentIndex = Math.min(this.currentIndex + 1, this.imageCount + 1);
		this.scrollImages(this.imageWidth * this.currentIndex, this.MOVE_TIME);
	},
	moveByIndicator : function(event, index){
		event.preventDefault();
		
		this.currentIndex = index;
		this.scrollImages(this.imageWidth * this.currentIndex, this.MOVE_TIME);
	},
	scrollImages : function(distance, duration){
		this.$container.css('transition-duration', duration / 1000 + 's');
		this.$container.css('transform', 'translate3d(' + -distance + 'px, 0px, 0px)');
	},
	finishToMove : function(){
		if(this.currentIndex == 0){
			this.currentIndex = this.imageCount;
		}else if(this.currentIndex == this.imageCount + 1){
			this.currentIndex = 1;
		}
		this.scrollImages(this.imageWidth * this.currentIndex, 0);
		
		this.$indicators.removeClass(this.INDICATOR_CURRENT_CLASS);
		this.$indicators.eq(this.currentIndex - 1).addClass(this.INDICATOR_CURRENT_CLASS);
	}
};

$(function(){
	LEIHAUOLI.CAROUSEL.init();
});